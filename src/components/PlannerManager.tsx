
import { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Trash, PlusCircle } from 'lucide-react';
import { projectPlannerConfig as defaultConfig, ProjectPlannerConfig } from '@/data/projectPlannerConfig';
import { doc, getDoc, setDoc } from "firebase/firestore";
import { db } from "../firebase";
import { useToast } from "@/components/ui/use-toast";

const PlannerManager = () => {
  const [config, setConfig] = useState<ProjectPlannerConfig | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();
  const configDocRef = doc(db, 'configs', 'projectPlanner');

  useEffect(() => {
    const fetchConfig = async () => {
      setIsLoading(true);
      try {
        const docSnap = await getDoc(configDocRef);
        if (docSnap.exists()) {
          setConfig(docSnap.data() as ProjectPlannerConfig);
        } else {
          // If no config in DB, use the default and save it to firestore.
          await setDoc(configDocRef, defaultConfig);
          setConfig(defaultConfig);
          toast({
            title: "Planner Initialized",
            description: "Default planner settings have been saved to the database.",
          });
        }
      } catch (error) {
        console.error("Error fetching config:", error);
        toast({
          title: "Error",
          description: "Could not load planner configuration. Using local defaults.",
          variant: "destructive",
        });
        setConfig(defaultConfig); // Fallback to default
      } finally {
        setIsLoading(false);
      }
    };

    fetchConfig();
  }, []); // Empty dependency array ensures this runs once on mount

  const handleNestedChange = (category, key, field, value) => {
    setConfig(prev => ({
      ...prev,
      [category]: {
        ...prev[category],
        [key]: { ...prev[category][key], [field]: value },
      },
    }));
  };
  
  const handlePagePriceChange = (value) => {
    setConfig(prev => ({ ...prev, pages: { ...prev.pages, price_per_page: value } }));
  };

  const handleAddItem = (category) => {
    const newKey = `item_${Date.now()}`;
    const newItem = category === 'features' 
      ? { name: "New Feature", price: 0, description: "A great new feature." }
      : { name: "New Type", price: 0 };
    setConfig(prev => ({ ...prev, [category]: { ...prev[category], [newKey]: newItem } }));
  };

  const handleRemoveItem = (category, keyToRemove) => {
    const { [keyToRemove]: _, ...rest } = config[category];
    setConfig(prev => ({ ...prev, [category]: rest }));
  };

  const handleSave = async () => {
    setIsSaving(true);
    try {
      await setDoc(configDocRef, config, { merge: true });
      toast({
        title: "Success!",
        description: "Project Planner configuration has been saved.",
      });
    } catch (error) {
      console.error("Failed to save config:", error);
      toast({
        title: "Error",
        description: "Failed to save configuration.",
        variant: "destructive",
      });
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading || !config) {
    return <div className="p-6 text-center">Loading Planner Configuration...</div>;
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Website Types</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {Object.entries(config.websiteType).map(([key, item]) => (
            <div key={key} className="grid grid-cols-[1fr_auto_auto] gap-4 items-center">
              <Input value={item.name} onChange={e => handleNestedChange('websiteType', key, 'name', e.target.value)} />
              <Input type="number" value={item.price} onChange={e => handleNestedChange('websiteType', key, 'price', parseFloat(e.target.value))} className="w-32" />
              <Button variant="destructive" size="icon" onClick={() => handleRemoveItem('websiteType', key)}><Trash size={16} /></Button>
            </div>
          ))}
          <Button onClick={() => handleAddItem('websiteType')}><PlusCircle className="mr-2" size={16}/>Add Type</Button>
        </CardContent>
      </Card>

      <Card>
        <CardHeader><CardTitle>Page Pricing</CardTitle></CardHeader>
        <CardContent className="space-y-2">
            <Label>Price Per Page</Label>
            <Input type="number" value={config.pages.price_per_page} onChange={e => handlePagePriceChange(parseFloat(e.target.value))} className="max-w-xs"/>
        </CardContent>
      </Card>

      <Card>
        <CardHeader><CardTitle>Features</CardTitle></CardHeader>
        <CardContent className="space-y-4">
          {Object.entries(config.features).map(([key, item]) => (
            <div key={key} className="space-y-3 p-4 border rounded-lg bg-muted/20">
                <div className="grid grid-cols-[1fr_auto_auto] gap-4 items-center">
                    <Input placeholder="Feature Name" value={item.name} onChange={e => handleNestedChange('features', key, 'name', e.target.value)} />
                    <Input placeholder="Price" type="number" value={item.price} onChange={e => handleNestedChange('features', key, 'price', parseFloat(e.target.value))} className="w-32" />
                    <Button variant="destructive" size="icon" onClick={() => handleRemoveItem('features', key)}><Trash size={16} /></Button>
                </div>
                <Input placeholder="Description" value={item.description} onChange={e => handleNestedChange('features', key, 'description', e.target.value)} />
            </div>
          ))}
          <Button onClick={() => handleAddItem('features')}><PlusCircle className="mr-2" size={16}/>Add Feature</Button>
        </CardContent>
      </Card>

      <Card>
        <CardHeader><CardTitle>Design Options</CardTitle></CardHeader>
        <CardContent className="space-y-4">
          {Object.entries(config.design).map(([key, item]) => (
            <div key={key} className="grid grid-cols-[1fr_auto] gap-4 items-center">
              <Input value={item.name} onChange={e => handleNestedChange('design', key, 'name', e.target.value)} />
              <Input type="number" value={item.price} onChange={e => handleNestedChange('design', key, 'price', parseFloat(e.target.value))} className="w-32" />
            </div>
          ))}
        </CardContent>
      </Card>

      <div className="flex justify-end mt-8">
        <Button onClick={handleSave} disabled={isSaving || isLoading} size="lg">
          {isSaving ? 'Saving...' : 'Save Changes'}
        </Button>
      </div>
    </div>
  );
};

export default PlannerManager;
