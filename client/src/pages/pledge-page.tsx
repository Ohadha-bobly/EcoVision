import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { useLocation } from "wouter";
import { Header } from "@/components/header";
import { PledgeForm } from "@/components/pledge-form";
import { AuthDialog } from "@/components/auth-dialog";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CheckCircle2 } from "lucide-react";
import type { Project } from "@shared/schema";

export default function PledgePage() {
  const [authOpen, setAuthOpen] = useState(false);
  const [pledgeSuccess, setPledgeSuccess] = useState(false);
  const [, setLocation] = useLocation();

  // Get project ID from URL query params
  const urlParams = new URLSearchParams(window.location.search);
  const projectId = urlParams.get("project");

  const { data: project, isLoading } = useQuery<Project>({
    queryKey: ["/api/projects", projectId],
    enabled: !!projectId,
  });

  if (pledgeSuccess) {
    return (
      <div className="min-h-screen bg-background">
        <Header onAuthClick={() => setAuthOpen(true)} />

        <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <Card className="text-center">
            <CardHeader>
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-primary/10 mx-auto mb-4">
                <CheckCircle2 className="h-8 w-8 text-primary" />
              </div>
              <CardTitle className="text-2xl">Thank You for Your Pledge!</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-muted-foreground">
                Your contribution will make a real difference in restoring our planet's forests.
                You'll receive updates on the project's progress via email.
              </p>
              <div className="flex flex-col sm:flex-row gap-3 justify-center">
                <Button onClick={() => setLocation("/projects")} data-testid="button-view-projects">
                  View More Projects
                </Button>
                <Button variant="outline" onClick={() => setLocation("/")} data-testid="button-back-home">
                  Back to Home
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>

        <AuthDialog open={authOpen} onOpenChange={setAuthOpen} />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Header onAuthClick={() => setAuthOpen(true)} />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-foreground mb-4">Make Your Pledge</h1>
          <p className="text-lg text-muted-foreground">
            Support environmental conservation and track your impact
          </p>
        </div>

        {isLoading ? (
          <div className="text-center py-12">
            <p className="text-muted-foreground">Loading project details...</p>
          </div>
        ) : !project && projectId ? (
          <div className="text-center py-12">
            <p className="text-muted-foreground">Project not found</p>
            <Button onClick={() => setLocation("/projects")} className="mt-4" data-testid="button-browse-projects">
              Browse All Projects
            </Button>
          </div>
        ) : (
          <PledgeForm
            projectId={projectId || ""}
            projectName={project?.name || "General Conservation Fund"}
            onSuccess={() => setPledgeSuccess(true)}
          />
        )}
      </div>

      <AuthDialog open={authOpen} onOpenChange={setAuthOpen} />
    </div>
  );
}
