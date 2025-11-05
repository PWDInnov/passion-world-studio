import { Card, CardContent, CardTitle } from './ui/card';
import { cn } from '@/lib/utils';
import * as Icons from 'lucide-react';

const ServiceCard = ({ service, className }) => {
  const Icon = service.icon ? Icons[service.icon] : null;

  return (
    <Card className={cn("hover-lift text-center", className)}>
      <CardContent className="p-8">
        {Icon && (
          <div className="flex justify-center mb-6">
            <Icon className="w-12 h-12 text-primary" />
          </div>
        )}
        <CardTitle className="mb-2">{service.title}</CardTitle>
        <p className="text-sm text-muted-foreground mb-4">{service.subtitle}</p>
        <p className="text-muted-foreground text-sm">
          {service.description}
        </p>
      </CardContent>
    </Card>
  );
};

export default ServiceCard;
