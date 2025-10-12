import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Header } from "@/components/header";
import { InteractiveMap } from "@/components/interactive-map";
import { ProjectDetailModal } from "@/components/project-detail-modal";
import { AuthDialog } from "@/components/auth-dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Search, Filter } from "lucide-react";
import type { Project } from "@shared/schema";

export default function MapPage() {
  const [authOpen, setAuthOpen] = useState(false);
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [typeFilter, setTypeFilter] = useState<string>("all");
  const [statusFilter, setStatusFilter] = useState<string>("all");

  const { data: projects = [], isLoading } = useQuery<Project[]>({
    queryKey: ["/api/projects"],
  });

  const filteredProjects = projects.filter((project) => {
    const matchesSearch = project.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      project.location.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesType = typeFilter === "all" || project.projectType === typeFilter;
    const matchesStatus = statusFilter === "all" || project.status === statusFilter;
    return matchesSearch && matchesType && matchesStatus;
  });

  return (
    <div className="min-h-screen bg-background">
      <Header onAuthClick={() => setAuthOpen(true)} />

      <div className="relative">
        {/* Search and Filter Bar */}
        <div className="absolute top-4 left-4 z-[1000] w-96 max-w-[calc(100%-2rem)]">
          <Card className="p-4 space-y-3 bg-background/95 backdrop-blur-sm">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search projects or locations..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-9"
                data-testid="input-search-projects"
              />
            </div>

            <div className="flex gap-2">
              <Select value={typeFilter} onValueChange={setTypeFilter}>
                <SelectTrigger className="flex-1" data-testid="select-filter-type">
                  <SelectValue placeholder="Type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Types</SelectItem>
                  <SelectItem value="reforestation">Reforestation</SelectItem>
                  <SelectItem value="conservation">Conservation</SelectItem>
                  <SelectItem value="restoration">Restoration</SelectItem>
                  <SelectItem value="afforestation">Afforestation</SelectItem>
                </SelectContent>
              </Select>

              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="flex-1" data-testid="select-filter-status">
                  <SelectValue placeholder="Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="active">Active</SelectItem>
                  <SelectItem value="completed">Completed</SelectItem>
                  <SelectItem value="planned">Planned</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {(searchQuery || typeFilter !== "all" || statusFilter !== "all") && (
              <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  setSearchQuery("");
                  setTypeFilter("all");
                  setStatusFilter("all");
                }}
                className="w-full"
                data-testid="button-clear-filters"
              >
                Clear Filters
              </Button>
            )}

            <div className="text-sm text-muted-foreground">
              Showing {filteredProjects.length} of {projects.length} projects
            </div>
          </Card>
        </div>

        {/* Map */}
        {isLoading ? (
          <div className="h-[calc(100vh-4rem)] flex items-center justify-center">
            <p className="text-muted-foreground">Loading map...</p>
          </div>
        ) : (
          <InteractiveMap
            projects={filteredProjects}
            onProjectClick={setSelectedProject}
          />
        )}
      </div>

      <ProjectDetailModal
        project={selectedProject}
        open={!!selectedProject}
        onOpenChange={(open) => !open && setSelectedProject(null)}
      />

      <AuthDialog open={authOpen} onOpenChange={setAuthOpen} />
    </div>
  );
}
