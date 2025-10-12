import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { MapPin, TreePine, Sprout, Cloud, Calendar } from "lucide-react";
import type { Project } from "@shared/schema";
import { Link } from "wouter";

interface ProjectDetailModalProps {
  project: Project | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function ProjectDetailModal({
  project,
  open,
  onOpenChange,
}: ProjectDetailModalProps) {
  if (!project) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto" data-testid="modal-project-detail">
        <DialogHeader>
          <DialogTitle className="text-2xl">{project.name}</DialogTitle>
          <DialogDescription className="flex items-center gap-2">
            <MapPin className="h-4 w-4" />
            {project.location}
          </DialogDescription>
        </DialogHeader>

        <div className="grid grid-cols-1 md:grid-cols-5 gap-6">
          {/* Satellite snapshot */}
          <div className="md:col-span-2">
            <div className="aspect-square rounded-md overflow-hidden bg-muted">
              <img
                src={project.imageUrl || `https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?q=80&w=800&auto=format&fit=crop`}
                alt={`${project.name} satellite view`}
                className="w-full h-full object-cover"
              />
            </div>
            <p className="text-xs text-muted-foreground mt-2 text-center">
              Recent satellite imagery
            </p>
          </div>

          {/* Project details */}
          <div className="md:col-span-3">
            <Tabs defaultValue="overview" className="w-full">
              <TabsList className="w-full grid grid-cols-3">
                <TabsTrigger value="overview" data-testid="tab-overview">Overview</TabsTrigger>
                <TabsTrigger value="impact" data-testid="tab-impact">Impact</TabsTrigger>
                <TabsTrigger value="timeline" data-testid="tab-timeline">Timeline</TabsTrigger>
              </TabsList>

              <TabsContent value="overview" className="space-y-4 mt-4">
                <div>
                  <h3 className="font-semibold mb-2">About This Project</h3>
                  <p className="text-sm text-muted-foreground">{project.description}</p>
                </div>

                <div>
                  <h3 className="font-semibold mb-2">Project Type</h3>
                  <Badge variant="secondary">{project.projectType}</Badge>
                </div>

                <div>
                  <h3 className="font-semibold mb-2">Status</h3>
                  <Badge>{project.status}</Badge>
                </div>
              </TabsContent>

              <TabsContent value="impact" className="space-y-4 mt-4">
                <div className="grid grid-cols-2 gap-4">
                  {project.treesPlanted && (
                    <div className="flex items-start gap-3 p-3 rounded-md bg-card">
                      <TreePine className="h-5 w-5 text-primary mt-1" />
                      <div>
                        <div className="text-2xl font-bold">{Number(project.treesPlanted).toLocaleString()}</div>
                        <div className="text-sm text-muted-foreground">Trees Planted</div>
                      </div>
                    </div>
                  )}
                  {project.area && (
                    <div className="flex items-start gap-3 p-3 rounded-md bg-card">
                      <Sprout className="h-5 w-5 text-primary mt-1" />
                      <div>
                        <div className="text-2xl font-bold">{Number(project.area).toLocaleString()} ha</div>
                        <div className="text-sm text-muted-foreground">Area Restored</div>
                      </div>
                    </div>
                  )}
                  {project.co2Offset && (
                    <div className="flex items-start gap-3 p-3 rounded-md bg-card">
                      <Cloud className="h-5 w-5 text-primary mt-1" />
                      <div>
                        <div className="text-2xl font-bold">{Number(project.co2Offset).toLocaleString()} t</div>
                        <div className="text-sm text-muted-foreground">CO₂ Offset</div>
                      </div>
                    </div>
                  )}
                </div>
              </TabsContent>

              <TabsContent value="timeline" className="space-y-4 mt-4">
                {project.startDate && (
                  <div className="flex items-start gap-3">
                    <Calendar className="h-5 w-5 text-primary mt-1" />
                    <div>
                      <div className="font-semibold">Project Started</div>
                      <div className="text-sm text-muted-foreground">
                        {new Date(project.startDate).toLocaleDateString('en-US', {
                          year: 'numeric',
                          month: 'long',
                          day: 'numeric',
                        })}
                      </div>
                    </div>
                  </div>
                )}
                <div className="text-sm text-muted-foreground">
                  Satellite monitoring and NDVI analysis shows progressive environmental recovery in this region.
                </div>
              </TabsContent>
            </Tabs>

            <div className="mt-6 flex gap-3">
              <Link href={`/pledge?project=${project.id}`}>
                <Button className="flex-1" data-testid="button-support-project">
                  Support This Project
                </Button>
              </Link>
              <Button variant="outline" onClick={() => onOpenChange(false)} data-testid="button-close-modal">
                Close
              </Button>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
