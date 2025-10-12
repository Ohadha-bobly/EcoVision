import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { MapContainer, TileLayer, Marker } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import type { Project } from "@shared/schema";
import { useMutation } from "@tanstack/react-query";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";

// Fix default marker icon
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
  iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
  shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
});

const projectFormSchema = z.object({
  name: z.string().min(3, "Name must be at least 3 characters"),
  description: z.string().min(10, "Description must be at least 10 characters"),
  location: z.string().min(3, "Location is required"),
  latitude: z.string().refine((val) => !isNaN(Number(val)) && Number(val) >= -90 && Number(val) <= 90, {
    message: "Latitude must be between -90 and 90",
  }),
  longitude: z.string().refine((val) => !isNaN(Number(val)) && Number(val) >= -180 && Number(val) <= 180, {
    message: "Longitude must be between -180 and 180",
  }),
  projectType: z.string().min(1, "Project type is required"),
  area: z.string().optional(),
  treesPlanted: z.string().optional(),
  co2Offset: z.string().optional(),
  imageUrl: z.string().url("Must be a valid URL").optional().or(z.literal("")),
  status: z.string().default("active"),
});

interface AdminProjectFormProps {
  project?: Project;
  onSuccess: () => void;
  onCancel: () => void;
}

export function AdminProjectForm({ project, onSuccess, onCancel }: AdminProjectFormProps) {
  const { toast } = useToast();

  const form = useForm({
    resolver: zodResolver(projectFormSchema),
    defaultValues: {
      name: project?.name || "",
      description: project?.description || "",
      location: project?.location || "",
      latitude: project?.latitude?.toString() || "0",
      longitude: project?.longitude?.toString() || "0",
      projectType: project?.projectType || "",
      area: project?.area?.toString() || "",
      treesPlanted: project?.treesPlanted?.toString() || "",
      co2Offset: project?.co2Offset?.toString() || "",
      imageUrl: project?.imageUrl || "",
      status: project?.status || "active",
    },
  });

  const createMutation = useMutation({
    mutationFn: async (data: z.infer<typeof projectFormSchema>) => {
      return apiRequest("POST", "/api/projects", data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/projects"] });
      toast({
        title: "Project created!",
        description: "The conservation project has been added successfully.",
      });
      onSuccess();
    },
    onError: () => {
      toast({
        title: "Failed to create project",
        description: "Something went wrong. Please try again.",
        variant: "destructive",
      });
    },
  });

  const updateMutation = useMutation({
    mutationFn: async (data: z.infer<typeof projectFormSchema>) => {
      return apiRequest("PATCH", `/api/projects/${project?.id}`, data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/projects"] });
      toast({
        title: "Project updated!",
        description: "The conservation project has been updated successfully.",
      });
      onSuccess();
    },
    onError: () => {
      toast({
        title: "Failed to update project",
        description: "Something went wrong. Please try again.",
        variant: "destructive",
      });
    },
  });

  const handleSubmit = async (data: z.infer<typeof projectFormSchema>) => {
    if (project) {
      updateMutation.mutate(data);
    } else {
      createMutation.mutate(data);
    }
  };

  const isLoading = createMutation.isPending || updateMutation.isPending;
  const lat = Number(form.watch("latitude")) || 0;
  const lng = Number(form.watch("longitude")) || 0;

  return (
    <Card>
      <CardHeader>
        <CardTitle>{project ? "Edit Project" : "Create New Project"}</CardTitle>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Project Name</FormLabel>
                    <FormControl>
                      <Input {...field} placeholder="Amazon Reforestation" data-testid="input-project-name" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="location"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Location</FormLabel>
                    <FormControl>
                      <Input {...field} placeholder="Brazil, South America" data-testid="input-project-location" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Description</FormLabel>
                  <FormControl>
                    <Textarea
                      {...field}
                      placeholder="Describe the conservation project..."
                      className="min-h-24"
                      data-testid="input-project-description"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="projectType"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Project Type</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger data-testid="select-project-type">
                          <SelectValue placeholder="Select type" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="reforestation">Reforestation</SelectItem>
                        <SelectItem value="conservation">Conservation</SelectItem>
                        <SelectItem value="restoration">Restoration</SelectItem>
                        <SelectItem value="afforestation">Afforestation</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="status"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Status</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger data-testid="select-project-status">
                          <SelectValue placeholder="Select status" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="active">Active</SelectItem>
                        <SelectItem value="completed">Completed</SelectItem>
                        <SelectItem value="planned">Planned</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="latitude"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Latitude</FormLabel>
                    <FormControl>
                      <Input {...field} type="number" step="any" placeholder="0.000000" data-testid="input-project-latitude" />
                    </FormControl>
                    <FormDescription>Click on the map to set location</FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="longitude"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Longitude</FormLabel>
                    <FormControl>
                      <Input {...field} type="number" step="any" placeholder="0.000000" data-testid="input-project-longitude" />
                    </FormControl>
                    <FormDescription>Click on the map to set location</FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="space-y-2">
              <FormLabel>Project Location Preview</FormLabel>
              <div className="h-64 rounded-md overflow-hidden border">
                <MapContainer
                  center={[lat, lng]}
                  zoom={lat === 0 && lng === 0 ? 2 : 6}
                  className="h-full w-full"
                  key={`${lat}-${lng}`}
                >
                  <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
                  {(lat !== 0 || lng !== 0) && (
                    <Marker position={[lat, lng]} />
                  )}
                </MapContainer>
              </div>
              <p className="text-sm text-muted-foreground">
                Enter latitude and longitude coordinates or use an external map tool to find coordinates
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <FormField
                control={form.control}
                name="area"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Area (hectares)</FormLabel>
                    <FormControl>
                      <Input {...field} type="number" step="0.01" placeholder="0.00" data-testid="input-project-area" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="treesPlanted"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Trees Planted</FormLabel>
                    <FormControl>
                      <Input {...field} type="number" placeholder="0" data-testid="input-project-trees" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="co2Offset"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>CO₂ Offset (tons)</FormLabel>
                    <FormControl>
                      <Input {...field} type="number" step="0.01" placeholder="0.00" data-testid="input-project-co2" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="imageUrl"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Image URL (Optional)</FormLabel>
                  <FormControl>
                    <Input {...field} placeholder="https://example.com/image.jpg" data-testid="input-project-image" />
                  </FormControl>
                  <FormDescription>
                    URL to a representative image of the project
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="flex gap-3">
              <Button
                type="button"
                variant="outline"
                onClick={onCancel}
                data-testid="button-cancel-project"
              >
                Cancel
              </Button>
              <Button
                type="submit"
                className="flex-1"
                disabled={isLoading}
                data-testid="button-submit-project"
              >
                {isLoading ? "Saving..." : project ? "Update Project" : "Create Project"}
              </Button>
            </div>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
