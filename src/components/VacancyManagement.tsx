import { useEffect, useRef, useState } from "react";
import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  onSnapshot,
  serverTimestamp,
  updateDoc,
} from "firebase/firestore";
import { BriefcaseBusiness, Loader2, Mail, Pencil, PlusCircle, Trash, Users } from "lucide-react";
import { db } from "@/firebase";
import { vacancySeedData, type VacancyRecord } from "@/data/vacancies";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

interface ApplicationRecord {
  id: string;
  name: string;
  email: string;
  phone: string;
  role: string;
  portfolio: string;
  message: string;
  status: string;
  createdAt?: { toDate?: () => Date };
}

type VacancyForm = {
  title: string;
  type: string;
  location: string;
  summary: string;
  responsibilities: string;
  skills: string;
  isOpen: boolean;
};

const emptyForm: VacancyForm = {
  title: "",
  type: "Full-time",
  location: "Remote",
  summary: "",
  responsibilities: "",
  skills: "",
  isOpen: true,
};

const toForm = (vacancy: VacancyRecord): VacancyForm => ({
  title: vacancy.title || "",
  type: vacancy.type || "Full-time",
  location: vacancy.location || "Remote",
  summary: vacancy.summary || "",
  responsibilities: (vacancy.responsibilities || []).join("\n"),
  skills: (vacancy.skills || []).join(", "),
  isOpen: vacancy.isOpen !== false,
});

const formatApplicationDate = (createdAt?: ApplicationRecord["createdAt"]) => {
  const date = createdAt?.toDate?.();
  return date ? date.toLocaleString() : "Just now";
};

const VacancyManagement = () => {
  const [vacancies, setVacancies] = useState<VacancyRecord[]>([]);
  const [applications, setApplications] = useState<ApplicationRecord[]>([]);
  const [selectedApplication, setSelectedApplication] = useState<ApplicationRecord | null>(null);
  const [form, setForm] = useState<VacancyForm>(emptyForm);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const seededDefaults = useRef(false);

  useEffect(() => {
    const unsubscribeVacancies = onSnapshot(
      collection(db, "vacancies"),
      (snapshot) => {
        const records = snapshot.docs.map((item) => ({ id: item.id, ...item.data() }) as VacancyRecord);
        setVacancies(records);
        setLoading(false);
        if (snapshot.empty && !seededDefaults.current) {
          seededDefaults.current = true;
          Promise.all(vacancySeedData.map((vacancy) => addDoc(collection(db, "vacancies"), { ...vacancy, createdAt: serverTimestamp() })))
            .catch(() => setError("Unable to create the default vacancies. Please add a vacancy manually."));
        }
      },
      () => {
        setError("Unable to load vacancies. Please refresh and try again.");
        setLoading(false);
      },
    );
    const unsubscribeApplications = onSnapshot(
      collection(db, "applications"),
      (snapshot) => {
        const records = snapshot.docs.map((item) => ({ id: item.id, ...item.data() }) as ApplicationRecord);
        records.sort((a, b) => {
          const first = b.createdAt?.toDate?.()?.getTime() || 0;
          const second = a.createdAt?.toDate?.()?.getTime() || 0;
          return first - second;
        });
        setApplications(records);
        setSelectedApplication((current) => current ? records.find((record) => record.id === current.id) || null : null);
      },
      () => setError("Unable to load applications. Please refresh and try again."),
    );

    return () => {
      unsubscribeVacancies();
      unsubscribeApplications();
    };
  }, []);

  const updateForm = (field: keyof VacancyForm, value: string | boolean) => {
    setForm((current) => ({ ...current, [field]: value }));
  };

  const openCreateForm = () => {
    setEditingId(null);
    setForm(emptyForm);
    setIsFormOpen(true);
  };

  const openEditForm = (vacancy: VacancyRecord) => {
    setEditingId(vacancy.id);
    setForm(toForm(vacancy));
    setIsFormOpen(true);
  };

  const closeForm = () => {
    setEditingId(null);
    setForm(emptyForm);
    setIsFormOpen(false);
  };

  const handleVacancySubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const data = {
      title: form.title.trim(),
      type: form.type.trim(),
      location: form.location.trim(),
      summary: form.summary.trim(),
      responsibilities: form.responsibilities.split("\n").map((item) => item.trim()).filter(Boolean),
      skills: form.skills.split(",").map((item) => item.trim()).filter(Boolean),
      isOpen: form.isOpen,
    };

    try {
      if (editingId) {
        await updateDoc(doc(db, "vacancies", editingId), data);
      } else {
        await addDoc(collection(db, "vacancies"), { ...data, createdAt: serverTimestamp() });
      }
      closeForm();
    } catch {
      setError("Unable to save this vacancy. Please try again.");
    }
  };

  const handleDeleteVacancy = async (id: string) => {
    if (!window.confirm("Delete this vacancy?")) return;
    try {
      await deleteDoc(doc(db, "vacancies", id));
      if (editingId === id) closeForm();
    } catch {
      setError("Unable to delete this vacancy. Please try again.");
    }
  };

  const handleToggleVacancy = async (vacancy: VacancyRecord) => {
    try {
      await updateDoc(doc(db, "vacancies", vacancy.id), { isOpen: !vacancy.isOpen });
    } catch {
      setError("Unable to update this vacancy status. Please try again.");
    }
  };

  const handleApplicationStatus = async (application: ApplicationRecord, status: string) => {
    try {
      await updateDoc(doc(db, "applications", application.id), { status });
    } catch {
      setError("Unable to update the application status. Please try again.");
    }
  };

  const handleDeleteApplication = async (id: string) => {
    if (!window.confirm("Delete this application?")) return;
    try {
      await deleteDoc(doc(db, "applications", id));
      if (selectedApplication?.id === id) setSelectedApplication(null);
    } catch {
      setError("Unable to delete this application. Please try again.");
    }
  };

  if (loading) {
    return <div className="flex justify-center p-10"><Loader2 className="animate-spin text-primary" /></div>;
  }

  return (
    <div className="space-y-8">
      {error && <p role="alert" className="rounded-md border border-destructive/40 bg-destructive/10 p-4 text-sm text-destructive">{error}</p>}

      <section>
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between mb-4">
          <div>
            <h3 className="text-lg font-bold">Vacancies</h3>
            <p className="text-sm text-muted-foreground">Manage which roles appear on the public vacancies page.</p>
          </div>
          <Button onClick={openCreateForm}><PlusCircle className="mr-2 h-4 w-4" />Add vacancy</Button>
        </div>

        {isFormOpen && (
          <Card className="mb-6 border-primary/30">
            <CardHeader><CardTitle>{editingId ? "Edit vacancy" : "Add vacancy"}</CardTitle></CardHeader>
            <CardContent>
              <form onSubmit={handleVacancySubmit} className="space-y-4">
                <div className="grid gap-4 md:grid-cols-2">
                  <div className="space-y-2"><Label htmlFor="vacancy-title">Job title</Label><Input id="vacancy-title" value={form.title} onChange={(event) => updateForm("title", event.target.value)} required /></div>
                  <div className="space-y-2"><Label htmlFor="vacancy-type">Employment type</Label><Input id="vacancy-type" value={form.type} onChange={(event) => updateForm("type", event.target.value)} placeholder="Full-time" required /></div>
                  <div className="space-y-2"><Label htmlFor="vacancy-location">Location</Label><Input id="vacancy-location" value={form.location} onChange={(event) => updateForm("location", event.target.value)} placeholder="Remote" required /></div>
                  <div className="space-y-2"><Label htmlFor="vacancy-skills">Skills</Label><Input id="vacancy-skills" value={form.skills} onChange={(event) => updateForm("skills", event.target.value)} placeholder="React, TypeScript, CSS" /></div>
                </div>
                <div className="space-y-2"><Label htmlFor="vacancy-summary">Summary</Label><Textarea id="vacancy-summary" value={form.summary} onChange={(event) => updateForm("summary", event.target.value)} rows={3} required /></div>
                <div className="space-y-2"><Label htmlFor="vacancy-responsibilities">Responsibilities <span className="font-normal text-muted-foreground">(one per line)</span></Label><Textarea id="vacancy-responsibilities" value={form.responsibilities} onChange={(event) => updateForm("responsibilities", event.target.value)} rows={5} required /></div>
                <label className="flex items-center gap-2 text-sm"><input type="checkbox" checked={form.isOpen} onChange={(event) => updateForm("isOpen", event.target.checked)} /> Publish this vacancy on the public page</label>
                <div className="flex gap-2"><Button type="submit">{editingId ? "Save changes" : "Create vacancy"}</Button><Button type="button" variant="outline" onClick={closeForm}>Cancel</Button></div>
              </form>
            </CardContent>
          </Card>
        )}

        {vacancies.length === 0 ? <p className="rounded-lg border border-dashed p-8 text-center text-muted-foreground">No vacancies yet. Add your first opening above.</p> : (
          <div className="grid gap-4 md:grid-cols-2">
            {vacancies.map((vacancy) => (
              <Card key={vacancy.id}>
                <CardContent className="p-5">
                  <div className="flex items-start justify-between gap-4"><div><h4 className="font-bold">{vacancy.title}</h4><p className="text-sm text-muted-foreground">{vacancy.type} · {vacancy.location}</p></div><Badge variant={vacancy.isOpen ? "default" : "secondary"}>{vacancy.isOpen ? "Open" : "Closed"}</Badge></div>
                  <p className="mt-3 line-clamp-2 text-sm text-muted-foreground">{vacancy.summary}</p>
                  <div className="mt-4 flex flex-wrap justify-end gap-2"><Button variant="outline" size="sm" onClick={() => handleToggleVacancy(vacancy)}>{vacancy.isOpen ? "Close role" : "Publish role"}</Button><Button variant="outline" size="icon" onClick={() => openEditForm(vacancy)} aria-label={`Edit ${vacancy.title}`}><Pencil className="h-4 w-4" /></Button><Button variant="destructive" size="icon" onClick={() => handleDeleteVacancy(vacancy.id)} aria-label={`Delete ${vacancy.title}`}><Trash className="h-4 w-4" /></Button></div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </section>

      <section className="border-t pt-8">
        <div className="mb-4"><h3 className="flex items-center gap-2 text-lg font-bold"><Users className="h-5 w-5 text-primary" />Applications <Badge variant="secondary">{applications.length}</Badge></h3><p className="text-sm text-muted-foreground">Review applications submitted through the public vacancies page.</p></div>
        <div className="grid gap-6 lg:grid-cols-[0.8fr_1.2fr]">
          <Card><CardContent className="p-2"><div className="space-y-1">{applications.length === 0 ? <p className="p-6 text-center text-sm text-muted-foreground">No applications yet.</p> : applications.map((application) => <button type="button" key={application.id} className={`w-full rounded-lg p-3 text-left transition-colors ${selectedApplication?.id === application.id ? "bg-primary/10" : "hover:bg-muted"}`} onClick={() => setSelectedApplication(application)}><div className="flex items-start justify-between gap-3"><span className="font-semibold">{application.name}</span><Badge variant="outline" className="text-xs">{application.status || "new"}</Badge></div><p className="truncate text-sm text-muted-foreground">{application.role}</p><p className="text-xs text-muted-foreground">{formatApplicationDate(application.createdAt)}</p></button>)}</div></CardContent></Card>
          <Card><CardHeader><CardTitle>Application details</CardTitle></CardHeader><CardContent>{selectedApplication ? <div className="space-y-4"><div><h4 className="text-xl font-bold">{selectedApplication.name}</h4><a href={`mailto:${selectedApplication.email}`} className="inline-flex items-center gap-1 text-sm text-primary hover:underline"><Mail className="h-3.5 w-3.5" />{selectedApplication.email}</a>{selectedApplication.phone && <p className="text-sm text-muted-foreground">{selectedApplication.phone}</p>}</div><div className="rounded-lg bg-muted/50 p-4"><p className="text-sm font-semibold">Applying for</p><p>{selectedApplication.role}</p></div><div><p className="mb-1 text-sm font-semibold">Cover letter</p><p className="whitespace-pre-wrap text-sm text-muted-foreground">{selectedApplication.message}</p></div>{selectedApplication.portfolio && /^https?:\/\//i.test(selectedApplication.portfolio) && <a href={selectedApplication.portfolio} target="_blank" rel="noopener noreferrer" className="text-sm text-primary underline">View portfolio or CV</a>}<div className="flex flex-wrap items-center gap-2 border-t pt-4"><Label htmlFor="application-status">Status</Label><select id="application-status" value={selectedApplication.status || "new"} onChange={(event) => handleApplicationStatus(selectedApplication, event.target.value)} className="h-9 rounded-md border border-input bg-background px-3 text-sm"><option value="new">New</option><option value="reviewing">Reviewing</option><option value="shortlisted">Shortlisted</option><option value="rejected">Rejected</option><option value="hired">Hired</option></select><Button variant="destructive" size="sm" className="ml-auto" onClick={() => handleDeleteApplication(selectedApplication.id)}><Trash className="mr-2 h-4 w-4" />Delete</Button></div></div> : <div className="flex min-h-56 flex-col items-center justify-center text-center text-muted-foreground"><BriefcaseBusiness className="mb-3 h-10 w-10" /><p>Select an application to view its details.</p></div>}</CardContent></Card>
        </div>
      </section>
    </div>
  );
};

export default VacancyManagement;
