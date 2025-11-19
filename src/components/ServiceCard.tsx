import { Card, CardContent, CardTitle } from './ui/card';
import { cn } from '@/lib/utils';
import { icons } from 'lucide-react';
import { Service } from '../types';

const ServiceCard = ({ service, className }: { service: Service; className?: string }) => {
  const Icon = service.icon ? icons[service.icon as keyof typeof icons] : null;

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
