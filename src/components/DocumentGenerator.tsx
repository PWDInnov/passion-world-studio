import { ChangeEvent, PointerEvent, useEffect, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { FileDown, FileText, Plus, Printer, RotateCcw, Trash2, Upload } from "lucide-react";
import "./document-generator.css";

type DocumentKind = "quotation" | "invoice";
type Currency = "NAD" | "ZAR" | "USD";
type LineItem = { id: string; description: string; quantity: number; unitPrice: number };
type CompanySettings = {
  name: string;
  registration: string;
  phone: string;
  email: string;
  website: string;
  address: string;
  logoUrl: string;
  signatory: string;
  signatoryTitle: string;
  signatureUrl: string;
  paymentDetails: string;
};
type DocumentDetails = {
  kind: DocumentKind;
  documentNumber: string;
  issueDate: string;
  dueDate: string;
  currency: Currency;
  clientName: string;
  clientCompany: string;
  clientEmail: string;
  clientPhone: string;
  clientAddress: string;
  reference: string;
  items: LineItem[];
  discountPercent: number;
  taxPercent: number;
  paidAmount: number;
  status: "Draft" | "Unpaid" | "Partially paid" | "Paid";
  notes: string;
  terms: string;
};

const COMPANY_STORAGE_KEY = "pwd-document-company-settings";
const defaultCompany: CompanySettings = {
  name: "Passion World Designs",
  registration: "",
  phone: "+264 81 3100 204",
  email: "pwdinnovate@hotmail.com",
  website: "www.passionworlddesigns.com",
  address: "Windhoek, Namibia",
  logoUrl: "https://cdn.builder.io/api/v1/image/assets%2F33ccba396c2d4c9491b2c70ac3a19821%2F8014310f61cd41eab08ad68e0d5d54da?format=webp&width=800&height=1200",
  signatory: "",
  signatoryTitle: "Authorized Signatory",
  signatureUrl: "",
  paymentDetails: "",
};

const localDate = () => {
  const date = new Date();
  return new Date(date.getTime() - date.getTimezoneOffset() * 60000).toISOString().slice(0, 10);
};

const newDocumentNumber = (kind: DocumentKind) => {
  const prefix = kind === "quotation" ? "QUO" : "INV";
  return `PWD/${prefix}/${new Date().getFullYear()}/${Date.now().toString(36).toUpperCase().slice(-5)}`;
};

const createDocument = (kind: DocumentKind = "quotation"): DocumentDetails => ({
  kind,
  documentNumber: newDocumentNumber(kind),
  issueDate: localDate(),
  dueDate: "",
  currency: "NAD",
  clientName: "",
  clientCompany: "",
  clientEmail: "",
  clientPhone: "",
  clientAddress: "",
  reference: "",
  items: [{ id: crypto.randomUUID(), description: "", quantity: 1, unitPrice: 0 }],
  discountPercent: 0,
  taxPercent: 0,
  paidAmount: 0,
  status: "Draft",
  notes: "",
  terms: kind === "quotation"
    ? "This quotation is valid for 14 days. Work begins upon written approval and receipt of the agreed deposit."
    : "Payment is due by the date indicated above. Please use the invoice number as your payment reference.",
});

const readCompanySettings = (): CompanySettings => {
  try {
    const stored = localStorage.getItem(COMPANY_STORAGE_KEY);
    return stored ? { ...defaultCompany, ...JSON.parse(stored) } : defaultCompany;
  } catch {
    return defaultCompany;
  }
};

const Field = ({ label, children }: { label: string; children: React.ReactNode }) => (
  <label className="block space-y-1.5">
    <span className="text-xs font-medium text-muted-foreground">{label}</span>
    {children}
  </label>
);

const safeImageSource = (source: string) => {
  const value = source.trim();
  return /^https:\/\//i.test(value) || /^data:image\/(png|jpeg|webp);base64,/i.test(value) ? value : "";
};

const formatMoney = (amount: number, currency: Currency) => new Intl.NumberFormat("en-NA", {
  style: "currency",
  currency,
  minimumFractionDigits: 2,
}).format(Number.isFinite(amount) ? amount : 0);

const formatDate = (value: string) => value
  ? new Intl.DateTimeFormat("en-GB", { day: "2-digit", month: "short", year: "numeric" }).format(new Date(`${value}T00:00:00`))
  : "—";

const numberValue = (value: string) => {
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : 0;
};

const DocumentGenerator = () => {
  const [company, setCompany] = useState<CompanySettings>(readCompanySettings);
  const [document, setDocument] = useState<DocumentDetails>(() => createDocument());
  const [storageWarning, setStorageWarning] = useState(false);
  const [fileMessage, setFileMessage] = useState("");
  const signatureCanvas = useRef<HTMLCanvasElement>(null);
  const isDrawing = useRef(false);
  const sheetRef = useRef<HTMLElement>(null);
  const logoInput = useRef<HTMLInputElement>(null);
  const signatureInput = useRef<HTMLInputElement>(null);

  useEffect(() => {
    try {
      localStorage.setItem(COMPANY_STORAGE_KEY, JSON.stringify(company));
      setStorageWarning(false);
    } catch {
      setStorageWarning(true);
    }
  }, [company]);

  const totals = (() => {
    const subtotal = document.items.reduce((sum, item) => sum + item.quantity * item.unitPrice, 0);
    const discount = subtotal * document.discountPercent / 100;
    const taxableAmount = subtotal - discount;
    const tax = taxableAmount * document.taxPercent / 100;
    const total = taxableAmount + tax;
    return { subtotal, discount, tax, total, balance: Math.max(total - document.paidAmount, 0) };
  })();

  const updateCompany = <K extends keyof CompanySettings>(key: K, value: CompanySettings[K]) => {
    setCompany((current) => ({ ...current, [key]: value }));
  };

  const updateDocument = <K extends keyof DocumentDetails>(key: K, value: DocumentDetails[K]) => {
    setDocument((current) => ({ ...current, [key]: value }));
  };

  const changeDocumentKind = (kind: DocumentKind) => {
    setDocument((current) => ({
      ...current,
      kind,
      documentNumber: newDocumentNumber(kind),
      status: "Draft",
      paidAmount: kind === "quotation" ? 0 : current.paidAmount,
      terms: kind === "quotation"
        ? "This quotation is valid for 14 days. Work begins upon written approval and receipt of the agreed deposit."
        : "Payment is due by the date indicated above. Please use the invoice number as your payment reference.",
    }));
  };

  const updateItem = (id: string, key: "description" | "quantity" | "unitPrice", value: string) => {
    setDocument((current) => ({
      ...current,
      items: current.items.map((item) => item.id === id
        ? { ...item, [key]: key === "description" ? value : Math.max(0, numberValue(value)) }
        : item),
    }));
  };

  const readImageFile = (event: ChangeEvent<HTMLInputElement>, key: "logoUrl" | "signatureUrl") => {
    const file = event.currentTarget.files?.[0];
    event.currentTarget.value = "";
    setFileMessage("");
    if (!file) return;
    if (!["image/png", "image/jpeg", "image/webp"].includes(file.type) || file.size > 750_000) {
      setFileMessage("Choose a PNG, JPG, or WebP image under 750 KB.");
      return;
    }
    const reader = new FileReader();
    reader.onload = () => updateCompany(key, String(reader.result));
    reader.readAsDataURL(file);
  };

  const pointerPosition = (event: PointerEvent<HTMLCanvasElement>) => {
    const bounds = event.currentTarget.getBoundingClientRect();
    return {
      x: (event.clientX - bounds.left) * (event.currentTarget.width / bounds.width),
      y: (event.clientY - bounds.top) * (event.currentTarget.height / bounds.height),
    };
  };

  const startSignature = (event: PointerEvent<HTMLCanvasElement>) => {
    const canvas = event.currentTarget;
    const context = canvas.getContext("2d");
    if (!context) return;
    isDrawing.current = true;
    canvas.setPointerCapture(event.pointerId);
    const point = pointerPosition(event);
    context.beginPath();
    context.moveTo(point.x, point.y);
    context.lineWidth = 3;
    context.lineCap = "round";
    context.lineJoin = "round";
    context.strokeStyle = "#1b1a17";
  };

  const drawSignature = (event: PointerEvent<HTMLCanvasElement>) => {
    if (!isDrawing.current) return;
    const context = event.currentTarget.getContext("2d");
    if (!context) return;
    const point = pointerPosition(event);
    context.lineTo(point.x, point.y);
    context.stroke();
  };

  const finishSignature = () => {
    if (!isDrawing.current) return;
    isDrawing.current = false;
    if (signatureCanvas.current) updateCompany("signatureUrl", signatureCanvas.current.toDataURL("image/png"));
  };

  const clearSignature = () => {
    const canvas = signatureCanvas.current;
    canvas?.getContext("2d")?.clearRect(0, 0, canvas.width, canvas.height);
    updateCompany("signatureUrl", "");
  };

  const downloadWordFile = () => {
    if (!sheetRef.current) return;
    const wordDocument = `<!doctype html><html><head><meta charset="utf-8"><style>${documentCss}</style></head><body>${sheetRef.current.outerHTML}</body></html>`;
    const url = URL.createObjectURL(new Blob([wordDocument], { type: "application/msword;charset=utf-8" }));
    const link = window.document.createElement("a");
    link.href = url;
    link.download = `${document.documentNumber.replace(/[^a-z0-9-_]+/gi, "-") || "PWD-document"}.doc`;
    link.click();
    window.setTimeout(() => URL.revokeObjectURL(url), 1000);
  };

  const startNewDocument = () => {
    if (!window.confirm("Start a new document? The current client details and line items will be cleared.")) return;
    setDocument(createDocument(document.kind));
    setFileMessage("");
  };

  const logoSource = safeImageSource(company.logoUrl);
  const signatureSource = safeImageSource(company.signatureUrl);
  const isQuotation = document.kind === "quotation";

  return (
    <div className="document-generator space-y-5">
      <style>{documentCss}</style>
      <div className="document-generator-intro flex flex-col gap-4 rounded-xl border border-border bg-background p-5 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-primary">Business documents</p>
          <h2 className="mt-1 text-2xl font-semibold">Quotation &amp; invoice generator</h2>
          <p className="mt-1 max-w-2xl text-sm text-muted-foreground">Build a polished client document, then print it or download a Word-compatible copy.</p>
        </div>
        <div className="flex flex-wrap gap-2">
          <Button variant="outline" onClick={startNewDocument}><RotateCcw className="mr-2 h-4 w-4" />New document</Button>
          <Button variant="outline" onClick={downloadWordFile}><FileDown className="mr-2 h-4 w-4" />Download Word</Button>
          <Button onClick={() => window.print()}><Printer className="mr-2 h-4 w-4" />Print / Save PDF</Button>
        </div>
      </div>
      <p className="document-generator-intro text-xs text-muted-foreground">Company details and signature are saved only in this browser. Client document details are not uploaded or stored.</p>
      {storageWarning && <p className="document-generator-intro text-xs text-amber-700">Browser storage is full; company settings may not persist after closing this page.</p>}
      {fileMessage && <p role="status" className="document-generator-intro text-xs text-amber-700">{fileMessage}</p>}

      <div className="document-generator-layout grid items-start gap-5 xl:grid-cols-[minmax(360px,0.82fr)_minmax(580px,1.18fr)]">
        <section className="document-generator-editor space-y-4">
          <details open className="rounded-xl border border-border bg-background p-4">
            <summary className="cursor-pointer text-sm font-semibold">Your business details &amp; signature</summary>
            <div className="mt-4 grid gap-3 sm:grid-cols-2">
              <Field label="Business name"><Input value={company.name} onChange={(event) => updateCompany("name", event.target.value)} /></Field>
              <Field label="Registration number"><Input value={company.registration} onChange={(event) => updateCompany("registration", event.target.value)} placeholder="Optional" /></Field>
              <Field label="Phone"><Input value={company.phone} onChange={(event) => updateCompany("phone", event.target.value)} /></Field>
              <Field label="Email"><Input type="email" value={company.email} onChange={(event) => updateCompany("email", event.target.value)} /></Field>
              <Field label="Website"><Input value={company.website} onChange={(event) => updateCompany("website", event.target.value)} /></Field>
              <Field label="Business address"><Input value={company.address} onChange={(event) => updateCompany("address", event.target.value)} /></Field>
              <div className="space-y-2 sm:col-span-2">
                <Label className="text-xs font-medium text-muted-foreground">Company logo</Label>
                <Input aria-label="Company logo image URL" value={company.logoUrl.startsWith("data:") ? "Uploaded logo" : company.logoUrl} onChange={(event) => updateCompany("logoUrl", event.target.value)} placeholder="https://..." />
                <div className="flex items-center gap-2">
                  <Button type="button" variant="outline" size="sm" onClick={() => logoInput.current?.click()}><Upload className="mr-2 h-3.5 w-3.5" />Upload logo</Button>
                  {company.logoUrl && <Button type="button" variant="ghost" size="sm" onClick={() => updateCompany("logoUrl", "")}>Remove</Button>}
                  <input ref={logoInput} className="hidden" type="file" accept="image/png,image/jpeg,image/webp" onChange={(event) => readImageFile(event, "logoUrl")} />
                </div>
              </div>
              <Field label="Authorized signatory"><Input value={company.signatory} onChange={(event) => updateCompany("signatory", event.target.value)} placeholder="Your name" /></Field>
              <Field label="Signatory title"><Input value={company.signatoryTitle} onChange={(event) => updateCompany("signatoryTitle", event.target.value)} /></Field>
              <div className="space-y-2 sm:col-span-2">
                <Label className="text-xs font-medium text-muted-foreground">Signature</Label>
                {signatureSource ? <img src={signatureSource} alt="Authorized signature preview" className="h-20 w-full rounded-md border border-dashed border-border bg-white object-contain p-2" /> : (
                  <canvas
                    ref={signatureCanvas}
                    width={520}
                    height={120}
                    aria-label="Draw your signature"
                    className="h-24 w-full touch-none rounded-md border border-dashed border-border bg-white"
                    onPointerDown={startSignature}
                    onPointerMove={drawSignature}
                    onPointerUp={finishSignature}
                    onPointerCancel={finishSignature}
                  />
                )}
                <div className="flex flex-wrap gap-2">
                  <Button type="button" variant="outline" size="sm" onClick={() => signatureInput.current?.click()}><Upload className="mr-2 h-3.5 w-3.5" />Upload signature</Button>
                  <Button type="button" variant="ghost" size="sm" onClick={clearSignature}>Clear signature</Button>
                  <input ref={signatureInput} className="hidden" type="file" accept="image/png,image/jpeg,image/webp" onChange={(event) => readImageFile(event, "signatureUrl")} />
                </div>
                <p className="text-[11px] text-muted-foreground">Draw above or upload your signature image. It is stored in this browser only.</p>
              </div>
              <div className="space-y-2 sm:col-span-2">
                <Label className="text-xs font-medium text-muted-foreground">Payment details</Label>
                <Textarea rows={2} value={company.paymentDetails} onChange={(event) => updateCompany("paymentDetails", event.target.value)} placeholder="Bank, account name, account number, branch" />
              </div>
            </div>
          </details>

          <div className="space-y-4 rounded-xl border border-border bg-background p-4">
            <div className="flex items-center gap-2 border-b border-border pb-3"><FileText className="h-4 w-4 text-primary" /><h3 className="text-sm font-semibold">Document details</h3></div>
            <div className="grid gap-3 sm:grid-cols-2">
              <Field label="Document type"><select className="h-10 w-full rounded-md border border-input bg-background px-3 text-sm" value={document.kind} onChange={(event) => changeDocumentKind(event.target.value as DocumentKind)}><option value="quotation">Quotation</option><option value="invoice">Invoice</option></select></Field>
              <Field label="Document number"><Input value={document.documentNumber} onChange={(event) => updateDocument("documentNumber", event.target.value)} /></Field>
              <Field label="Issue date"><Input type="date" value={document.issueDate} onChange={(event) => updateDocument("issueDate", event.target.value)} /></Field>
              <Field label={isQuotation ? "Valid until" : "Due date"}><Input type="date" value={document.dueDate} onChange={(event) => updateDocument("dueDate", event.target.value)} /></Field>
              <Field label="Currency"><select className="h-10 w-full rounded-md border border-input bg-background px-3 text-sm" value={document.currency} onChange={(event) => updateDocument("currency", event.target.value as Currency)}><option value="NAD">NAD — Namibian dollar</option><option value="ZAR">ZAR — South African rand</option><option value="USD">USD — US dollar</option></select></Field>
              {!isQuotation && <Field label="Invoice status"><select className="h-10 w-full rounded-md border border-input bg-background px-3 text-sm" value={document.status} onChange={(event) => updateDocument("status", event.target.value as DocumentDetails["status"])}><option>Draft</option><option>Unpaid</option><option>Partially paid</option><option>Paid</option></select></Field>}
            </div>
          </div>

          <div className="space-y-4 rounded-xl border border-border bg-background p-4">
            <div className="flex items-center gap-2 border-b border-border pb-3"><h3 className="text-sm font-semibold">Bill to</h3></div>
            <div className="grid gap-3 sm:grid-cols-2">
              <Field label="Client / contact name"><Input value={document.clientName} onChange={(event) => updateDocument("clientName", event.target.value)} placeholder="Client name" /></Field>
              <Field label="Company"><Input value={document.clientCompany} onChange={(event) => updateDocument("clientCompany", event.target.value)} placeholder="Client company" /></Field>
              <Field label="Email"><Input type="email" value={document.clientEmail} onChange={(event) => updateDocument("clientEmail", event.target.value)} /></Field>
              <Field label="Phone"><Input value={document.clientPhone} onChange={(event) => updateDocument("clientPhone", event.target.value)} /></Field>
              <Field label="Client reference / project"><Input value={document.reference} onChange={(event) => updateDocument("reference", event.target.value)} /></Field>
              <Field label="Client address"><Input value={document.clientAddress} onChange={(event) => updateDocument("clientAddress", event.target.value)} /></Field>
            </div>
          </div>

          <div className="space-y-4 rounded-xl border border-border bg-background p-4">
            <div className="flex items-center justify-between gap-3 border-b border-border pb-3"><h3 className="text-sm font-semibold">Items &amp; services</h3><Button type="button" variant="outline" size="sm" onClick={() => updateDocument("items", [...document.items, { id: crypto.randomUUID(), description: "", quantity: 1, unitPrice: 0 }])}><Plus className="mr-1.5 h-3.5 w-3.5" />Add item</Button></div>
            <div className="space-y-3">
              {document.items.map((item, index) => (
                <div key={item.id} className="grid grid-cols-2 gap-2 rounded-lg border border-border p-3 sm:grid-cols-[minmax(0,1fr)_80px_120px_36px] sm:items-end">
                  <div className="col-span-2 space-y-1.5 sm:col-span-1"><Label className="text-xs text-muted-foreground">Description {index + 1}</Label><Input value={item.description} onChange={(event) => updateItem(item.id, "description", event.target.value)} placeholder="Service or item" /></div>
                  <div className="space-y-1.5"><Label className="text-xs text-muted-foreground">Qty</Label><Input type="number" min="0" step="any" value={item.quantity} onChange={(event) => updateItem(item.id, "quantity", event.target.value)} /></div>
                  <div className="space-y-1.5"><Label className="text-xs text-muted-foreground">Unit price</Label><Input type="number" min="0" step="0.01" value={item.unitPrice} onChange={(event) => updateItem(item.id, "unitPrice", event.target.value)} /></div>
                  <Button type="button" variant="ghost" size="icon" aria-label={`Remove item ${index + 1}`} disabled={document.items.length === 1} onClick={() => updateDocument("items", document.items.filter((entry) => entry.id !== item.id))}><Trash2 className="h-4 w-4" /></Button>
                </div>
              ))}
            </div>
            <div className="grid gap-3 sm:grid-cols-3">
              <Field label="Discount (%)"><Input type="number" min="0" max="100" step="0.01" value={document.discountPercent} onChange={(event) => updateDocument("discountPercent", Math.min(100, Math.max(0, numberValue(event.target.value))))} /></Field>
              <Field label="Tax / VAT (%)"><Input type="number" min="0" step="0.01" value={document.taxPercent} onChange={(event) => updateDocument("taxPercent", Math.max(0, numberValue(event.target.value)))} /></Field>
              {!isQuotation && <Field label="Amount paid"><Input type="number" min="0" step="0.01" value={document.paidAmount} onChange={(event) => updateDocument("paidAmount", Math.max(0, numberValue(event.target.value)))} /></Field>}
            </div>
          </div>

          <div className="space-y-3 rounded-xl border border-border bg-background p-4">
            <Field label="Notes"><Textarea rows={2} value={document.notes} onChange={(event) => updateDocument("notes", event.target.value)} placeholder="Optional message for your client" /></Field>
            <Field label="Terms & conditions"><Textarea rows={3} value={document.terms} onChange={(event) => updateDocument("terms", event.target.value)} /></Field>
          </div>
        </section>

        <div className="document-generator-preview min-w-0 overflow-x-auto rounded-xl bg-stone-100 p-3 sm:p-5">
          <article ref={sheetRef} id="pwd-document-sheet" className="pwd-document-sheet">
            <div className="pwd-document-accent" />
            <header className="pwd-document-header">
              <div className="pwd-company-block">
                {logoSource && <img className="pwd-company-logo" src={logoSource} alt={`${company.name} logo`} />}
                <div>
                  <h2 className="pwd-company-name">{company.name || "Your Business Name"}</h2>
                  {company.registration && <p className="pwd-company-line">Registration: {company.registration}</p>}
                  {[company.address, company.phone, company.email, company.website].filter(Boolean).map((line) => <p className="pwd-company-line" key={line}>{line}</p>)}
                </div>
              </div>
              <div className="pwd-document-title-block">
                <p className="pwd-document-eyebrow">Passion World Designs</p>
                <h1>{isQuotation ? "QUOTATION" : "INVOICE"}</h1>
                {!isQuotation && <span className={`pwd-status pwd-status-${document.status.toLowerCase().replaceAll(" ", "-")}`}>{document.status}</span>}
              </div>
            </header>

            <section className="pwd-document-meta">
              <div className="pwd-bill-to">
                <p className="pwd-section-label">{isQuotation ? "QUOTATION FOR" : "BILL TO"}</p>
                <p className="pwd-client-name">{document.clientCompany || document.clientName || "Client name"}</p>
                {document.clientCompany && document.clientName && <p>{document.clientName}</p>}
                {document.clientAddress && <p>{document.clientAddress}</p>}
                {document.clientEmail && <p>{document.clientEmail}</p>}
                {document.clientPhone && <p>{document.clientPhone}</p>}
                {document.reference && <p className="pwd-reference">Reference: {document.reference}</p>}
              </div>
              <dl className="pwd-document-facts">
                <div><dt>{isQuotation ? "Quotation no." : "Invoice no."}</dt><dd>{document.documentNumber || "—"}</dd></div>
                <div><dt>Issue date</dt><dd>{formatDate(document.issueDate)}</dd></div>
                <div><dt>{isQuotation ? "Valid until" : "Due date"}</dt><dd>{formatDate(document.dueDate)}</dd></div>
                <div><dt>Currency</dt><dd>{document.currency}</dd></div>
              </dl>
            </section>

            <table className="pwd-document-table">
              <thead><tr><th className="pwd-item-number">#</th><th>Description</th><th className="pwd-quantity">Qty</th><th className="pwd-unit-price">Unit price</th><th className="pwd-amount">Amount ({document.currency})</th></tr></thead>
              <tbody>
                {document.items.map((item, index) => <tr key={item.id}><td className="pwd-item-number">{index + 1}</td><td>{item.description || "—"}</td><td className="pwd-quantity">{item.quantity}</td><td className="pwd-unit-price">{formatMoney(item.unitPrice, document.currency)}</td><td className="pwd-amount">{formatMoney(item.quantity * item.unitPrice, document.currency)}</td></tr>)}
              </tbody>
            </table>

            <section className="pwd-totals">
              <div className="pwd-total-row"><span>Subtotal</span><strong>{formatMoney(totals.subtotal, document.currency)}</strong></div>
              {document.discountPercent !== 0 && <div className="pwd-total-row"><span>Discount ({document.discountPercent}%)</span><strong>− {formatMoney(totals.discount, document.currency)}</strong></div>}
              {document.taxPercent !== 0 && <div className="pwd-total-row"><span>Tax / VAT ({document.taxPercent}%)</span><strong>{formatMoney(totals.tax, document.currency)}</strong></div>}
              <div className="pwd-grand-total"><span>{isQuotation ? "TOTAL QUOTED" : "TOTAL DUE"}</span><strong>{formatMoney(isQuotation ? totals.total : totals.balance, document.currency)}</strong></div>
              {!isQuotation && <div className="pwd-total-row pwd-paid-row"><span>Invoice total · Paid</span><strong>{formatMoney(totals.total, document.currency)} · {formatMoney(document.paidAmount, document.currency)}</strong></div>}
            </section>

            <section className="pwd-document-bottom">
              <div className="pwd-document-notes">
                {document.notes && <div><h3>Notes</h3><p>{document.notes}</p></div>}
                {document.terms && <div><h3>Terms &amp; conditions</h3><p>{document.terms}</p></div>}
                {company.paymentDetails && <div><h3>Payment details</h3><p>{company.paymentDetails}</p></div>}
              </div>
              <div className="pwd-signature-block">
                {signatureSource ? <img className="pwd-signature-image" src={signatureSource} alt="Authorized signature" /> : <div className="pwd-signature-space" />}
                <div className="pwd-signature-rule" />
                <p className="pwd-signatory-name">{company.signatory || "Authorized signatory"}</p>
                <p>{company.signatoryTitle}</p>
              </div>
            </section>

            <footer className="pwd-document-footer">
              <span>{company.name || "Passion World Designs"}</span>
              <span>{company.email}{company.phone ? `  ·  ${company.phone}` : ""}</span>
            </footer>
          </article>
        </div>
      </div>
    </div>
  );
};

const documentCss = `
.pwd-document-sheet{box-sizing:border-box;width:100%;max-width:210mm;min-height:297mm;margin:0 auto;padding:13mm;background:#fff;color:#28251f;font-family:Arial,Helvetica,sans-serif;font-size:11px;line-height:1.5;box-shadow:0 14px 38px rgba(35,29,18,.12)}
.pwd-document-accent{height:6px;margin:-13mm -13mm 9mm;background:#b5934e}
.pwd-document-header{display:flex;justify-content:space-between;align-items:flex-start;gap:20px;padding-bottom:17px;border-bottom:1px solid #dedbd3}
.pwd-company-block{display:flex;align-items:center;gap:14px;min-width:0}
.pwd-company-logo{width:83px;height:76px;flex:none;object-fit:contain}
.pwd-company-name{margin:0 0 4px;font-size:16px;line-height:1.2;font-weight:700;letter-spacing:.02em;color:#171613}
.pwd-company-line{margin:1px 0;color:#615d54;font-size:9px;overflow-wrap:anywhere}
.pwd-document-title-block{text-align:right;white-space:nowrap}
.pwd-document-eyebrow{margin:0 0 4px;color:#827552;font-size:8px;letter-spacing:.16em;text-transform:uppercase}
.pwd-document-title-block h1{margin:0;color:#a17d34;font-size:25px;line-height:1.1;letter-spacing:.08em}
.pwd-status{display:inline-block;margin-top:7px;padding:3px 9px;border-radius:20px;background:#eee9de;color:#65572f;font-size:8px;font-weight:700;text-transform:uppercase;letter-spacing:.08em}
.pwd-status-paid{background:#e5f2e9;color:#27613a}.pwd-status-unpaid{background:#f8e7e4;color:#99463d}.pwd-status-partially-paid{background:#fbf0d9;color:#805f1d}
.pwd-document-meta{display:grid;grid-template-columns:1fr minmax(190px,.8fr);gap:20px;padding:20px 0 22px}
.pwd-bill-to p{margin:2px 0;color:#5f5b53;font-size:9px;white-space:pre-wrap;overflow-wrap:anywhere}
.pwd-section-label{margin:0 0 8px!important;color:#997738!important;font-size:8px!important;font-weight:700;letter-spacing:.16em}
.pwd-client-name{color:#25231f!important;font-size:12px!important;font-weight:700}
.pwd-reference{padding-top:4px;font-weight:600}
.pwd-document-facts{margin:0;display:grid;grid-template-columns:1fr auto;align-content:start;gap:7px 12px}
.pwd-document-facts div{display:contents}
.pwd-document-facts dt{color:#777168;font-size:9px}
.pwd-document-facts dd{margin:0;text-align:right;font-size:9px;font-weight:700;overflow-wrap:anywhere}
.pwd-document-table{width:100%;border-collapse:collapse;table-layout:fixed}
.pwd-document-table th{padding:9px 7px;background:#171715;color:#e4c77f;text-align:left;font-size:8px;font-weight:700;letter-spacing:.04em}
.pwd-document-table td{padding:10px 7px;border-bottom:1px solid #e7e4dc;vertical-align:top;overflow-wrap:anywhere;font-size:9px}
.pwd-document-table tbody tr:nth-child(even){background:#fbfaf7}
.pwd-document-table .pwd-item-number{width:7%;text-align:center}
.pwd-document-table .pwd-quantity{width:10%;text-align:center}
.pwd-document-table .pwd-unit-price{width:20%;text-align:right}
.pwd-document-table .pwd-amount{width:23%;text-align:right;font-weight:600}
.pwd-totals{width:min(100%,290px);margin:16px 0 0 auto}
.pwd-total-row{display:flex;justify-content:space-between;gap:12px;padding:5px 0;color:#5e5a52;font-size:9px}
.pwd-total-row strong{color:#302d27;text-align:right;font-weight:600}
.pwd-grand-total{display:flex;justify-content:space-between;gap:12px;margin-top:5px;padding:11px 12px;background:#f1e5c8;color:#28251f;font-size:9px;font-weight:700;letter-spacing:.04em}
.pwd-grand-total strong{font-size:13px;white-space:nowrap}
.pwd-paid-row{font-size:8px}
.pwd-document-bottom{display:grid;grid-template-columns:1fr minmax(145px,.58fr);gap:26px;margin-top:30px;align-items:end}
.pwd-document-notes{display:grid;gap:13px}
.pwd-document-notes h3{margin:0 0 4px;color:#8e6f32;font-size:8px;font-weight:700;letter-spacing:.1em;text-transform:uppercase}
.pwd-document-notes p{margin:0;color:#5e5a52;font-size:9px;white-space:pre-wrap;overflow-wrap:anywhere}
.pwd-signature-block{text-align:center;color:#656057;font-size:8px}
.pwd-signature-image{display:block;width:100%;height:46px;margin:0 auto 3px;object-fit:contain;object-position:center bottom}
.pwd-signature-space{height:49px}
.pwd-signature-rule{height:1px;background:#8a857a}
.pwd-signatory-name{margin:5px 0 0;color:#28251f;font-size:9px;font-weight:700}
.pwd-signature-block p:last-child{margin:1px 0}
.pwd-document-footer{display:flex;justify-content:space-between;gap:12px;margin-top:35px;padding-top:9px;border-top:1px solid #d8d4ca;color:#777168;font-size:8px}
@media(max-width:640px){.pwd-document-sheet{padding:7mm;font-size:10px}.pwd-document-accent{margin:-7mm -7mm 7mm}.pwd-document-header{gap:8px}.pwd-company-block{gap:7px}.pwd-company-logo{width:52px;height:58px}.pwd-company-name{font-size:12px}.pwd-company-line{font-size:7px}.pwd-document-title-block h1{font-size:18px}.pwd-document-eyebrow{font-size:6px}.pwd-document-meta{grid-template-columns:1fr;gap:12px}.pwd-document-facts{grid-template-columns:1fr 1fr}.pwd-document-facts dd{text-align:left}.pwd-document-table th{padding:7px 3px;font-size:6px}.pwd-document-table td{padding:7px 3px;font-size:7px}.pwd-document-table .pwd-unit-price{width:21%}.pwd-document-table .pwd-amount{width:25%}.pwd-document-bottom{grid-template-columns:1fr;gap:18px}.pwd-signature-block{max-width:190px;margin-left:auto}.pwd-document-footer{font-size:6px}}
@page{size:A4;margin:0}
@media print{html,body{background:#fff!important}body *{visibility:hidden!important}.document-generator,.document-generator>*{display:contents!important}.document-generator-preview{overflow:visible!important}.pwd-document-sheet,.pwd-document-sheet *{visibility:visible!important}.pwd-document-sheet{position:absolute!important;left:0!important;top:0!important;width:210mm!important;max-width:none!important;min-height:297mm!important;margin:0!important;padding:13mm!important;border:0!important;border-radius:0!important;box-shadow:none!important;print-color-adjust:exact;-webkit-print-color-adjust:exact}.pwd-document-accent{margin:-13mm -13mm 9mm!important}.document-generator-intro,.document-generator-editor{display:none!important}.pwd-document-table tr,.pwd-totals,.pwd-document-bottom{break-inside:avoid}}
`;

export default DocumentGenerator;
