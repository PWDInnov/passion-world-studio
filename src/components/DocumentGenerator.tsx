import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Plus, Trash2, Printer, Download, FileText } from "lucide-react";

interface LineItem {
  id: string;
  description: string;
  quantity: number;
  rate: number;
}

const DocumentGenerator = () => {
  const [docType, setDocType] = useState<"Quotation" | "Invoice" | "Receipt">("Quotation");
  const [docNumber, setDocNumber] = useState(`PWD-${Math.floor(1000 + Math.random() * 9000)}`);
  const [docDate, setDocDate] = useState(new Date().toISOString().split("T")[0]);
  const [dueDate, setDueDate] = useState("");
  const [clientName, setClientName] = useState("");
  const [clientEmail, setClientEmail] = useState("");
  const [clientAddress, setClientAddress] = useState("");
  const [notes, setNotes] = useState("Thank you for your business. Payment terms: 50% deposit, 50% on delivery.");

  const [items, setItems] = useState<LineItem[]>([
    { id: "1", description: "Custom Website Design & Development", quantity: 1, rate: 850 },
    { id: "2", description: "Brand Identity & Logo Package", quantity: 1, rate: 300 },
  ]);

  const addItem = () => {
    setItems((prev) => [
      ...prev,
      { id: Date.now().toString(), description: "New Item", quantity: 1, rate: 100 },
    ]);
  };

  const removeItem = (id: string) => {
    setItems((prev) => prev.filter((item) => item.id !== id));
  };

  const updateItem = (id: string, field: keyof LineItem, val: string | number) => {
    setItems((prev) =>
      prev.map((item) => (item.id === id ? { ...item, [field]: val } : item))
    );
  };

  const subtotal = items.reduce((sum, item) => sum + item.quantity * item.rate, 0);

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
        <div>
          <h3 className="text-xl font-bold">Invoices &amp; Quotation Generator</h3>
          <p className="text-xs text-muted-foreground">Draft and print official PassionWorld Designs quotations, invoices, and receipts.</p>
        </div>
        <div className="flex gap-2">
          <Button onClick={handlePrint} className="bg-primary hover:bg-primary/90 text-primary-foreground">
            <Printer className="w-4 h-4 mr-2" /> Print / Save as PDF
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Controls */}
        <div className="lg:col-span-1 space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Document Parameters</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div>
                <label className="text-xs font-medium text-muted-foreground block mb-1">Document Type</label>
                <select
                  className="w-full border rounded-md px-3 py-2 bg-background text-sm"
                  value={docType}
                  onChange={(e) => setDocType(e.target.value as "Quotation" | "Invoice" | "Receipt")}
                >
                  <option value="Quotation">Quotation</option>
                  <option value="Invoice">Invoice</option>
                  <option value="Receipt">Official Receipt</option>
                </select>
              </div>

              <div>
                <label className="text-xs font-medium text-muted-foreground block mb-1">Reference Number</label>
                <Input value={docNumber} onChange={(e) => setDocNumber(e.target.value)} />
              </div>

              <div>
                <label className="text-xs font-medium text-muted-foreground block mb-1">Issue Date</label>
                <Input type="date" value={docDate} onChange={(e) => setDocDate(e.target.value)} />
              </div>

              <div>
                <label className="text-xs font-medium text-muted-foreground block mb-1">Client Name / Business</label>
                <Input placeholder="Client Co. Ltd" value={clientName} onChange={(e) => setClientName(e.target.value)} />
              </div>

              <div>
                <label className="text-xs font-medium text-muted-foreground block mb-1">Client Email</label>
                <Input placeholder="client@company.com" value={clientEmail} onChange={(e) => setClientEmail(e.target.value)} />
              </div>

              <div>
                <label className="text-xs font-medium text-muted-foreground block mb-1">Notes / Bank Details</label>
                <Textarea value={notes} onChange={(e) => setNotes(e.target.value)} rows={3} />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Live Preview Paper */}
        <div className="lg:col-span-2">
          <div className="p-8 md:p-12 border rounded-xl bg-card shadow-lg print:border-none print:shadow-none print:p-0 space-y-8 min-h-[600px] flex flex-col justify-between">
            {/* Header */}
            <div>
              <div className="flex justify-between items-start border-b pb-6">
                <div>
                  <h1 className="text-2xl font-black text-primary tracking-wide">PASSIONWORLD DESIGNS</h1>
                  <p className="text-xs text-muted-foreground mt-1">Creative Studio &amp; Software Solutions</p>
                  <p className="text-xs text-muted-foreground">Windhoek, Namibia</p>
                  <p className="text-xs text-muted-foreground">pwdinnovate@hotmail.com</p>
                </div>
                <div className="text-right">
                  <h2 className="text-3xl font-extrabold uppercase text-foreground">{docType}</h2>
                  <p className="text-sm font-semibold text-primary mt-1">#{docNumber}</p>
                  <p className="text-xs text-muted-foreground">Date: {docDate}</p>
                </div>
              </div>

              {/* Bill To */}
              <div className="my-6">
                <span className="text-xs font-bold uppercase tracking-wider text-muted-foreground block mb-1">Billed To:</span>
                <p className="font-bold text-foreground">{clientName || "Valued Client"}</p>
                {clientEmail && <p className="text-sm text-muted-foreground">{clientEmail}</p>}
              </div>

              {/* Items Table */}
              <div className="border rounded-lg overflow-hidden my-6">
                <table className="w-full text-left text-sm">
                  <thead className="bg-muted text-muted-foreground font-semibold">
                    <tr>
                      <th className="p-3">Description</th>
                      <th className="p-3 w-20 text-center">Qty</th>
                      <th className="p-3 w-28 text-right">Rate ($)</th>
                      <th className="p-3 w-28 text-right">Amount ($)</th>
                      <th className="p-3 w-12 text-center print:hidden"></th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border">
                    {items.map((item) => (
                      <tr key={item.id}>
                        <td className="p-3">
                          <Input
                            value={item.description}
                            onChange={(e) => updateItem(item.id, "description", e.target.value)}
                            className="h-8 text-sm border-none shadow-none focus-visible:ring-1"
                          />
                        </td>
                        <td className="p-3 text-center">
                          <Input
                            type="number"
                            min="1"
                            value={item.quantity}
                            onChange={(e) => updateItem(item.id, "quantity", Number(e.target.value))}
                            className="h-8 text-sm text-center w-16 mx-auto border-none shadow-none focus-visible:ring-1"
                          />
                        </td>
                        <td className="p-3 text-right">
                          <Input
                            type="number"
                            value={item.rate}
                            onChange={(e) => updateItem(item.id, "rate", Number(e.target.value))}
                            className="h-8 text-sm text-right w-24 ml-auto border-none shadow-none focus-visible:ring-1"
                          />
                        </td>
                        <td className="p-3 text-right font-medium">
                          ${(item.quantity * item.rate).toLocaleString()}
                        </td>
                        <td className="p-3 text-center print:hidden">
                          <button
                            onClick={() => removeItem(item.id)}
                            className="text-muted-foreground hover:text-destructive p-1 rounded"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              <div className="flex justify-between items-center print:hidden mb-6">
                <Button variant="outline" size="sm" onClick={addItem}>
                  <Plus className="w-3.5 h-3.5 mr-1.5" /> Add Line Item
                </Button>
              </div>

              {/* Total Breakdown */}
              <div className="flex justify-end pt-4 border-t">
                <div className="w-64 space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Subtotal:</span>
                    <span className="font-semibold">${subtotal.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between text-base font-bold border-t pt-2 text-primary">
                    <span>Total Due:</span>
                    <span>${subtotal.toLocaleString()}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Footer notes */}
            <div className="border-t pt-6 text-xs text-muted-foreground">
              <p className="font-semibold text-foreground mb-1">Terms &amp; Notes:</p>
              <p className="whitespace-pre-wrap">{notes}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DocumentGenerator;
