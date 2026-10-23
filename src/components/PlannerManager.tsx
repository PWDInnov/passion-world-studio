import { useState, useEffect } from "react";
import { doc, getDoc, setDoc } from "firebase/firestore";
import { db } from "@/firebase";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "@/components/ui/use-toast";
import { projectPlannerConfig as defaultConfig, ProjectPlannerConfig } from "@/data/projectPlannerConfig";
import { DollarSign, Save, RefreshCw } from "lucide-react";

const PlannerManager = () => {
  const [config, setConfig] = useState<ProjectPlannerConfig>(defaultConfig);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    const fetchConfig = async () => {
      try {
        setLoading(true);
        const docRef = doc(db, "siteContent", "plannerConfig");
        const snap = await getDoc(docRef);
        if (snap.exists()) {
          setConfig(snap.data() as ProjectPlannerConfig);
        }
      } catch (err: unknown) {
        console.error("Error fetching planner config:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchConfig();
  }, []);

  const handleSave = async () => {
    try {
      setSaving(true);
      await setDoc(doc(db, "siteContent", "plannerConfig"), config);
      toast({ title: "Planner rates and config updated in Firestore!" });
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Failed to save configuration";
      toast({ title: "Error", description: msg, variant: "destructive" });
    } finally {
      setSaving(false);
    }
  };

  const handleResetToDefault = () => {
    if (window.confirm("Reset all rates to defaults?")) {
      setConfig(defaultConfig);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
        <div>
          <h3 className="text-xl font-bold">Interactive Project Planner Rates</h3>
          <p className="text-xs text-muted-foreground">Adjust baseline prices, page rates, and feature add-ons.</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm" onClick={handleResetToDefault}>
            <RefreshCw className="w-3.5 h-3.5 mr-1.5" /> Reset Defaults
          </Button>
          <Button size="sm" onClick={handleSave} disabled={saving}>
            <Save className="w-3.5 h-3.5 mr-1.5" /> {saving ? "Saving..." : "Save Planner Rates"}
          </Button>
        </div>
      </div>

      {/* Pages Pricing */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Per-Page Baseline Rate</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center gap-4 max-w-xs">
            <label className="text-sm font-medium">Price per additional page ($):</label>
            <Input
              type="number"
              value={config.pages?.price_per_page || 50}
              onChange={(e) =>
                setConfig({
                  ...config,
                  pages: { price_per_page: Number(e.target.value) },
                })
              }
              className="w-28"
            />
          </div>
        </CardContent>
      </Card>

      {/* Website Types */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Website Type Starting Prices</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {Object.entries(config.websiteType || {}).map(([key, item]) => (
              <div key={key} className="p-4 border rounded-lg bg-card space-y-2">
                <span className="font-bold text-sm">{item.name}</span>
                <div className="flex items-center gap-2">
                  <span className="text-xs text-muted-foreground">Base Price ($):</span>
                  <Input
                    type="number"
                    value={item.price}
                    onChange={(e) => {
                      const updated = { ...config.websiteType };
                      updated[key] = { ...item, price: Number(e.target.value) };
                      setConfig({ ...config, websiteType: updated });
                    }}
                    className="w-28 h-8 text-sm"
                  />
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Features */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Add-on Feature Costs</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {Object.entries(config.features || {}).map(([key, item]) => (
              <div key={key} className="p-3 border rounded-lg bg-card space-y-1">
                <span className="font-semibold text-xs">{item.name}</span>
                <div className="flex items-center gap-2">
                  <span className="text-xs text-muted-foreground">Price ($):</span>
                  <Input
                    type="number"
                    value={item.price}
                    onChange={(e) => {
                      const updated = { ...config.features };
                      updated[key] = { ...item, price: Number(e.target.value) };
                      setConfig({ ...config, features: updated });
                    }}
                    className="w-24 h-7 text-xs"
                  />
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default PlannerManager;
