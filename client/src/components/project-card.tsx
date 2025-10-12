import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { MapPin, TreePine, Sprout } from "lucide-react";
import type { Project } from "@shared/schema";

interface ProjectCardProps {
  project: Project;
  onViewDetails: (project: Project) => void;
}

export function ProjectCard({ project, onViewDetails }: ProjectCardProps) {
  return (
    <Card className="overflow-hidden hover-elevate" data-testid={`card-project-${project.id}`}>
      <div className="aspect-video relative overflow-hidden">
        <img
          src={project.imageUrl || `https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?q=80&w=800&auto=format&fit=crop`}
          alt={project.name}
          className="w-full h-full object-cover"
        />
        <Badge className="absolute top-3 right-3" data-testid={`badge-status-${project.id}`}>
          {project.status}
        </Badge>
      </div>
      
      <CardHeader className="space-y-2">
        <h3 className="text-xl font-semibold text-foreground line-clamp-1" data-testid={`text-project-name-${project.id}`}>
          {project.name}
        </h3>
        <div className="flex items-center gap-1 text-sm text-muted-foreground">
          <MapPin className="h-4 w-4" />
          <span className="line-clamp-1">{project.location}</span>
        </div>
      </CardHeader>

      <CardContent>
        <p className="text-sm text-muted-foreground line-clamp-2 mb-4">
          {project.description}
        </p>
        
        <div className="grid grid-cols-2 gap-3">
          {project.treesPlanted && (
            <div className="flex items-center gap-2">
              <TreePine className="h-4 w-4 text-primary" />
              <div>
                <div className="text-sm font-semibold">{Number(project.treesPlanted).toLocaleString()}</div>
                <div className="text-xs text-muted-foreground">Trees</div>
              </div>
            </div>
          )}
          {project.area && (
            <div className="flex items-center gap-2">
              <Sprout className="h-4 w-4 text-primary" />
              <div>
                <div className="text-sm font-semibold">{Number(project.area).toLocaleString()} ha</div>
                <div className="text-xs text-muted-foreground">Area</div>
              </div>
            </div>
          )}
        </div>
      </CardContent>

      <CardFooter>
        <Button
          className="w-full"
          variant="outline"
          onClick={() => onViewDetails(project)}
          data-testid={`button-view-details-${project.id}`}
        >
          View Details
        </Button>
      </CardFooter>
    </Card>
  );
}
