
import { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { Info } from 'lucide-react';
import { projectPlannerConfig as defaultConfig, ProjectPlannerConfig } from '@/data/projectPlannerConfig';

// Define the structure for each step in the planner
interface Step {
  id: string;
  title: string;
  component: React.FC<any>;
}

// Pass the config to each step
const WebsiteTypeStep = ({ data, setData, config }) => (
  <div>
    <h3 className="text-xl font-semibold mb-4">What type of website do you need?</h3>
    <RadioGroup
      value={data.websiteType}
      onValueChange={(value) => setData({ ...data, websiteType: value })}
      className="grid grid-cols-2 gap-4"
    >
      {Object.entries(config.websiteType).map(([key, { name, price }]) => (
        <Label
          key={key}
          htmlFor={key}
          className={`border rounded-lg p-4 cursor-pointer transition-all ${
            data.websiteType === key ? 'border-primary shadow-lg' : 'hover:border-gray-300'
          }`}
        >
          <div className="flex items-center justify-between">
            <span className="font-bold">{name}</span>
            <RadioGroupItem value={key} id={key} />
          </div>
          <p className="text-sm text-muted-foreground mt-2">Starts at ${price}</p>
        </Label>
      ))}
    </RadioGroup>
  </div>
);

const PagesStep = ({ data, setData, config }) => (
  <div>
    <h3 className="text-xl font-semibold mb-4">How many pages will your website have?</h3>
    <div className="flex items-center gap-4">
      <Input
        type="number"
        min="1"
        value={data.pages}
        onChange={(e) => setData({ ...data, pages: parseInt(e.target.value, 10) })}
        className="w-24"
      />
      <p className="text-muted-foreground">pages x ${config.pages.price_per_page}/page</p>
    </div>
  </div>
);

const FeaturesStep = ({ data, setData, config }) => (
  <div>
    <h3 className="text-xl font-semibold mb-4">What features would you like to include?</h3>
    <div className="grid grid-cols-2 gap-4">
      {Object.entries(config.features).map(([key, { name, price, description }]) => (
        <Label
          key={key}
          className={`border rounded-lg p-4 cursor-pointer transition-all flex items-start gap-4 ${
            data.features.includes(key) ? 'border-primary' : ''
          }`}
        >
          <Checkbox
            checked={data.features.includes(key)}
            onCheckedChange={(checked) => {
              const newFeatures = checked
                ? [...data.features, key]
                : data.features.filter((f) => f !== key);
              setData({ ...data, features: newFeatures });
            }}
          />
          <div className="flex-grow">
            <div className="flex items-center justify-between">
                <span className="font-bold">{name}</span>
                <Tooltip>
                    <TooltipTrigger asChild>
                        <Info size={16} className="text-muted-foreground cursor-help" />
                    </TooltipTrigger>
                    <TooltipContent>
                        <p className="max-w-xs">{description}</p>
                    </TooltipContent>
                </Tooltip>
            </div>
            <p className="text-sm text-muted-foreground">+${price}</p>
          </div>
        </Label>
      ))}
    </div>
  </div>
);

const DesignStep = ({ data, setData, config }) => (
    <div>
        <h3 className="text-xl font-semibold mb-4">What's your design preference?</h3>
        <Select value={data.design} onValueChange={(value) => setData({ ...data, design: value })}>
            <SelectTrigger>
                <SelectValue placeholder="Select a design approach" />
            </SelectTrigger>
            <SelectContent>
                {Object.entries(config.design).map(([key, { name, price }]) => (
                    <SelectItem key={key} value={key}>{name} - {price > 0 ? `(+$${price})` : '(Included)'}</SelectItem>
                ))}
            </SelectContent>
        </Select>
    </div>
);

const SummaryStep = ({ data, estimate, reset, config }) => (
    <div>
        <h3 className="text-2xl font-bold mb-4 text-center">Your Project Estimate</h3>
        <Card className="mb-6">
            <CardContent className="p-6">
                <div className="space-y-4">
                    <div className="flex justify-between">
                        <span className="text-muted-foreground">Website Type:</span>
                        <span className="font-semibold">{config.websiteType[data.websiteType]?.name}</span>
                    </div>
                    <div className="flex justify-between">
                        <span className="text-muted-foreground">Number of Pages:</span>
                        <span className="font-semibold">{data.pages}</span>
                    </div>
                    <div className="flex justify-between">
                        <span className="text-muted-foreground">Design:</span>
                        <span className="font-semibold">{config.design[data.design]?.name}</span>
                    </div>
                    {data.features.length > 0 && (
                        <div className="pt-4 border-t">
                            <h4 className="font-semibold mb-2">Selected Features:</h4>
                            <ul className="list-disc list-inside space-y-1">
                                {data.features.map(f => <li key={f}>{config.features[f]?.name}</li>)}
                            </ul>
                        </div>
                    )}
                </div>
            </CardContent>
        </Card>

        <div className="text-center bg-secondary/30 p-6 rounded-lg">
            <p className="text-lg">Total Estimated Cost</p>
            <p className="text-4xl font-extrabold text-primary">${estimate}</p>
            <p className="text-xs text-muted-foreground mt-2">This is a non-binding estimate. Prices may vary.</p>
        </div>

        <div className="text-center mt-8">
            <Button onClick={reset}>Start Over</Button>
        </div>
    </div>
);


const ProjectPlanner = ({ config: initialConfig = defaultConfig }) => {
    const [step, setStep] = useState(0);
    // Use the keys from the config to set the initial state
    const [formData, setFormData] = useState({
        websiteType: Object.keys(initialConfig.websiteType)[0],
        pages: 5,
        features: [],
        design: Object.keys(initialConfig.design)[0],
    });

    const steps: Step[] = [
        { id: 'websiteType', title: 'Website Type', component: WebsiteTypeStep },
        { id: 'pages', title: 'Pages', component: PagesStep },
        { id: 'features', title: 'Features', component: FeaturesStep },
        { id: 'design', title: 'Design', component: DesignStep },
        { id: 'summary', title: 'Summary', component: SummaryStep },
    ];

    const CurrentStepComponent = steps[step].component;

    const calculateEstimate = () => {
        let total = 0;
        total += initialConfig.websiteType[formData.websiteType]?.price || 0;
        total += (formData.pages - 1) * initialConfig.pages.price_per_page;
        formData.features.forEach(f => {
            total += initialConfig.features[f]?.price || 0;
        });
        total += initialConfig.design[formData.design]?.price || 0;
        return total;
    };    

    const estimate = calculateEstimate();

    const handleNext = () => setStep(prev => Math.min(prev + 1, steps.length - 1));
    const handleBack = () => setStep(prev => Math.max(prev - 1, 0));
    
    const resetPlanner = () => {
        setFormData({
            websiteType: Object.keys(initialConfig.websiteType)[0],
            pages: 5,
            features: [],
            design: Object.keys(initialConfig.design)[0],
        });
        setStep(0);
    };

    const progress = (step / (steps.length - 2)) * 100;

    return (
        <section className="py-20">
            <div className="container mx-auto px-4 max-w-3xl">
                <Card className="shadow-2xl">
                    <CardHeader>
                        <CardTitle className="text-3xl font-bold text-center">Website Project Planner</CardTitle>
                        <p className="text-muted-foreground text-center">Build your project and get an instant estimate.</p>
                    </CardHeader>
                    <CardContent>
                        {step < steps.length - 1 && (
                            <div className="mb-8">
                                <Progress value={progress} />
                                <p className="text-center text-sm mt-2 text-muted-foreground">Step {step + 1} of {steps.length -1}: {steps[step].title}</p>
                            </div>
                        )}
                        
                        <div className="min-h-[200px]">
                            <CurrentStepComponent 
                                data={formData} 
                                setData={setFormData}
                                estimate={estimate}
                                reset={resetPlanner}
                                config={initialConfig} // Pass the config down
                            />
                        </div>

                        {step < steps.length - 1 && (
                            <div className="flex justify-between mt-8">
                                <Button variant="outline" onClick={handleBack} disabled={step === 0}>
                                    Back
                                </Button>
                                <Button onClick={handleNext}>
                                    {step === steps.length - 2 ? 'See My Estimate' : 'Next'}
                                </Button>
                            </div>
                        )}
                    </CardContent>
                </Card>
            </div>
        </section>
    );
};

export default ProjectPlanner;
