import { useState, useEffect } from "react";
import { collection, getDocs, addDoc, updateDoc, deleteDoc, doc, serverTimestamp } from "firebase/firestore";
import { db } from "@/firebase";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { toast } from "@/components/ui/use-toast";
import { Plus, Pencil, Trash, Briefcase, MapPin, Clock } from "lucide-react";
import type { VacancyRecord } from "@/data/vacancies";

const VacancyManagement = () => {
  const [vacancies, setVacancies] = useState<VacancyRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingItem, setEditingItem] = useState<VacancyRecord | null>(null);
  const [isFormOpen, setIsFormOpen] = useState(false);

  // Form fields
  const [title, setTitle] = useState("");
  const [department, setDepartment] = useState("");
  const [location, setLocation] = useState("");
  const [type, setType] = useState("Full-time");
  const [experience, setExperience] = useState("");
  const [salaryRange, setSalaryRange] = useState("");
  const [summary, setSummary] = useState("");
  const [responsibilities, setResponsibilities] = useState("");
  const [requirements, setRequirements] = useState("");
  const [isOpen, setIsOpen] = useState(true);

  const fetchVacancies = async () => {
    try {
      setLoading(true);
      const snapshot = await getDocs(collection(db, "vacancies"));
      const list = snapshot.docs.map((d) => ({ id: d.id, ...d.data() } as VacancyRecord));
      setVacancies(list);
    } catch (err: unknown) {
      console.error("Error fetching vacancies:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchVacancies();
  }, []);

  const handleOpenForm = (item?: VacancyRecord) => {
    if (item) {
      setEditingItem(item);
      setTitle(item.title || "");
      setDepartment(item.department || "");
      setLocation(item.location || "");
      setType(item.type || "Full-time");
      setExperience(item.experience || "");
      setSalaryRange(item.salaryRange || "");
      setSummary(item.summary || "");
      setResponsibilities(Array.isArray(item.responsibilities) ? item.responsibilities.join("\n") : "");
      setRequirements(Array.isArray(item.requirements) ? item.requirements.join("\n") : "");
      setIsOpen(item.isOpen ?? true);
    } else {
      setEditingItem(null);
      setTitle("");
      setDepartment("");
      setLocation("Windhoek / Remote");
      setType("Full-time");
      setExperience("2+ years");
      setSalaryRange("Competitive");
      setSummary("");
      setResponsibilities("");
      setRequirements("");
      setIsOpen(true);
    }
    setIsFormOpen(true);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const payload = {
        title,
        department,
        location,
        type,
        experience,
        salaryRange,
        summary,
        responsibilities: responsibilities.split("\n").map((r) => r.trim()).filter(Boolean),
        requirements: requirements.split("\n").map((r) => r.trim()).filter(Boolean),
        isOpen,
        updatedAt: serverTimestamp(),
      };

      if (editingItem?.id) {
        await updateDoc(doc(db, "vacancies", editingItem.id), payload);
        toast({ title: "Vacancy updated!" });
      } else {
        await addDoc(collection(db, "vacancies"), {
          ...payload,
          createdAt: serverTimestamp(),
        });
        toast({ title: "Vacancy published!" });
      }

      setIsFormOpen(false);
      fetchVacancies();
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Failed to save vacancy";
      toast({ title: "Error", description: msg, variant: "destructive" });
    }
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm("Are you sure you want to delete this vacancy?")) return;
    try {
      await deleteDoc(doc(db, "vacancies", id));
      setVacancies((prev) => prev.filter((item) => item.id !== id));
      toast({ title: "Vacancy removed" });
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Failed to delete vacancy";
      toast({ title: "Error", description: msg, variant: "destructive" });
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h3 className="text-xl font-bold">Careers &amp; Vacancies</h3>
          <p className="text-xs text-muted-foreground">Manage job postings on the /vacancies page.</p>
        </div>
        {!isFormOpen && (
          <Button onClick={() => handleOpenForm()}>
            <Plus className="w-4 h-4 mr-2" /> Add Job Opening
          </Button>
        )}
      </div>

      {isFormOpen ? (
        <form onSubmit={handleSave} className="p-6 border rounded-xl bg-card space-y-4">
          <h4 className="font-bold text-lg">{editingItem ? "Edit Vacancy" : "New Job Opening"}</h4>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="text-xs font-medium text-muted-foreground block mb-1">Job Title *</label>
              <Input value={title} onChange={(e) => setTitle(e.target.value)} required />
            </div>
            <div>
              <label className="text-xs font-medium text-muted-foreground block mb-1">Department *</label>
              <Input value={department} onChange={(e) => setDepartment(e.target.value)} placeholder="Engineering / Design" required />
            </div>
            <div>
              <label className="text-xs font-medium text-muted-foreground block mb-1">Location *</label>
              <Input value={location} onChange={(e) => setLocation(e.target.value)} placeholder="Windhoek, Namibia / Hybrid" required />
            </div>
            <div>
              <label className="text-xs font-medium text-muted-foreground block mb-1">Employment Type</label>
              <Input value={type} onChange={(e) => setType(e.target.value)} placeholder="Full-time / Part-time / Contract" />
            </div>
          </div>

          <div>
            <label className="text-xs font-medium text-muted-foreground block mb-1">Job Summary *</label>
            <Textarea value={summary} onChange={(e) => setSummary(e.target.value)} rows={3} required />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="text-xs font-medium text-muted-foreground block mb-1">Key Responsibilities (One per line)</label>
              <Textarea value={responsibilities} onChange={(e) => setResponsibilities(e.target.value)} rows={4} />
            </div>
            <div>
              <label className="text-xs font-medium text-muted-foreground block mb-1">Requirements (One per line)</label>
              <Textarea value={requirements} onChange={(e) => setRequirements(e.target.value)} rows={4} />
            </div>
          </div>

          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              id="isOpenCheck"
              checked={isOpen}
              onChange={(e) => setIsOpen(e.target.checked)}
              className="h-4 w-4 rounded border-gray-300"
            />
            <label htmlFor="isOpenCheck" className="text-sm font-medium">Position is currently Open &amp; Accepting Applications</label>
          </div>

          <div className="flex justify-end gap-3 pt-3 border-t">
            <Button type="button" variant="outline" onClick={() => setIsFormOpen(false)}>
              Cancel
            </Button>
            <Button type="submit">Save Vacancy</Button>
          </div>
        </form>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {vacancies.length === 0 && !loading && (
            <p className="text-sm text-muted-foreground col-span-2 text-center py-10">No active vacancies posted yet.</p>
          )}
          {vacancies.map((v) => (
            <Card key={v.id} className="p-5 border bg-card flex flex-col justify-between">
              <div>
                <div className="flex justify-between items-start mb-2">
                  <h4 className="font-bold text-lg">{v.title}</h4>
                  <Badge variant={v.isOpen ? "default" : "secondary"}>
                    {v.isOpen ? "Open" : "Closed"}
                  </Badge>
                </div>
                <div className="flex gap-3 text-xs text-muted-foreground mb-3">
                  <span>{v.department}</span>
                  <span>•</span>
                  <span>{v.location}</span>
                  <span>•</span>
                  <span>{v.type}</span>
                </div>
                <p className="text-sm text-foreground/80 line-clamp-3 mb-4">{v.summary}</p>
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t">
                <Button variant="outline" size="sm" onClick={() => handleOpenForm(v)}>
                  <Pencil size={14} />
                </Button>
                {v.id && (
                  <Button variant="destructive" size="sm" onClick={() => handleDelete(v.id!)}>
                    <Trash size={14} />
                  </Button>
                )}
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};

export default VacancyManagement;
