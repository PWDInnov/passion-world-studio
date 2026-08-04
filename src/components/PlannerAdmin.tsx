
import { useState, useEffect } from 'react';
import { db } from "@/firebase";
import { collection, doc, getDoc, setDoc, updateDoc } from "firebase/firestore";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "sonner";
import { v4 as uuidv4 } from 'uuid';

const PlannerAdmin = () => {
    const [config, setConfig] = useState(null);
    const [newFeature, setNewFeature] = useState({ id: '', name: '', price: 0, description: '' });
    const [newWebsiteType, setNewWebsiteType] = useState({ id: '', name: '', price: 0 });

    const docRef = doc(db, "projectPlanner", "config");

    useEffect(() => {
        const fetchConfig = async () => {
            const docSnap = await getDoc(docRef);
            if (docSnap.exists()) {
                setConfig(docSnap.data());
            } else {
                // If no config exists, create a default one
                const defaultConfig = {
                    websiteType: {},
                    features: {},
                    pages: { price: 50 },
                    design: { template: 0, custom: 1000 },
                };
                await setDoc(docRef, defaultConfig);
                setConfig(defaultConfig);
                toast.info("Created a default project planner configuration.");
            }
        };
        fetchConfig();
    }, []);

    const handleUpdate = async () => {
        if (!config) return;
        try {
            await updateDoc(docRef, config);
            toast.success("Project planner configuration updated successfully!");
        } catch (error) {
            toast.error("Error updating configuration:", error.message);
        }
    };

    const handleAddFeature = () => {
        if (!newFeature.name || newFeature.price <= 0) {
            toast.warning("Please provide a valid name and price for the new feature.");
            return;
        }
        const featureId = newFeature.name.toLowerCase().replace(/\s+/g, '_');
        const updatedConfig = {
            ...config,
            features: {
                ...config.features,
                [featureId]: { ...newFeature, id: featureId },
            },
        };
        setConfig(updatedConfig);
        setNewFeature({ id: '', name: '', price: 0, description: '' });
    };
    
    const handleAddWebsiteType = () => {
        if (!newWebsiteType.name || newWebsiteType.price <= 0) {
            toast.warning("Please provide a valid name and price for the new website type.");
            return;
        }
        const typeId = newWebsiteType.name.toLowerCase().replace(/\s+/g, '_');
        const updatedConfig = {
            ...config,
            websiteType: {
                ...config.websiteType,
                [typeId]: { ...newWebsiteType, id: typeId },
            },
        };
        setConfig(updatedConfig);
        setNewWebsiteType({ id: '', name: '', price: 0 });
    };

    if (!config) {
        return <div>Loading configuration...</div>;
    }

    return (
        <Card>
            <CardHeader>
                <CardTitle>Project Planner Management</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
                {/* Website Types Management */}
                <div>
                    <h3 className="font-semibold mb-2">Website Types</h3>
                    <div className="space-y-2">
                        {Object.entries(config.websiteType).map(([id, type]) => (
                            <div key={id} className="flex items-center gap-2 p-2 border rounded-md">
                                <Input value={type.name} onChange={(e) => setConfig({ ...config, websiteType: { ...config.websiteType, [id]: { ...type, name: e.target.value } } })} placeholder="Type Name" />
                                <Input type="number" value={type.price} onChange={(e) => setConfig({ ...config, websiteType: { ...config.websiteType, [id]: { ...type, price: Number(e.target.value) } } })} placeholder="Price" />
                            </div>
                        ))}
                    </div>
                    <div className="flex items-center gap-2 mt-4 p-2 border rounded-md border-dashed">
                        <Input value={newWebsiteType.name} onChange={(e) => setNewWebsiteType({ ...newWebsiteType, name: e.target.value })} placeholder="New Website Type" />
                        <Input type="number" value={newWebsiteType.price} onChange={(e) => setNewWebsiteType({ ...newWebsiteType, price: Number(e.target.value) })} placeholder="Price" />
                        <Button onClick={handleAddWebsiteType}>Add</Button>
                    </div>
                </div>

                {/* Features Management */}
                <div>
                    <h3 className="font-semibold mb-2">Features</h3>
                    <div className="space-y-2">
                        {Object.entries(config.features).map(([id, feature]) => (
                             <div key={id} className="flex items-center gap-2 p-2 border rounded-md">
                                <Input value={feature.name} onChange={(e) => setConfig({ ...config, features: { ...config.features, [id]: { ...feature, name: e.target.value } } })} placeholder="Feature Name" />
                                <Input type="number" value={feature.price} onChange={(e) => setConfig({ ...config, features: { ...config.features, [id]: { ...feature, price: Number(e.target.value) } } })} placeholder="Price" />
                                <Input value={feature.description} onChange={(e) => setConfig({ ...config, features: { ...config.features, [id]: { ...feature, description: e.target.value } } })} placeholder="Description" />
                            </div>
                        ))}
                    </div>
                    <div className="flex items-center gap-2 mt-4 p-2 border rounded-md border-dashed">
                        <Input value={newFeature.name} onChange={(e) => setNewFeature({ ...newFeature, name: e.target.value })} placeholder="New Feature Name" />
                        <Input type="number" value={newFeature.price} onChange={(e) => setNewFeature({ ...newFeature, price: Number(e.target.value) })} placeholder="Price" />
                        <Input value={newFeature.description} onChange={(e) => setNewFeature({ ...newFeature, description: e.target.value })} placeholder="Description" />
                        <Button onClick={handleAddFeature}>Add</Button>
                    </div>
                </div>
                
                <Button onClick={handleUpdate} className="w-full">Save Changes</Button>
            </CardContent>
        </Card>
    );
};

export default PlannerAdmin;
