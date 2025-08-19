import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useMutation } from "@tanstack/react-query";
import { Building, ArrowLeft } from "lucide-react";
import { workspaceApi } from "@/lib/api";
import type { CreateWorkspaceData } from "@/types";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Loading } from "@/components/ui/loading";

// Validation schema for workspace creation form
const createWorkspaceSchema = z.object({
  name: z
    .string()
    .min(1, "Workspace name is required")
    .min(3, "Workspace name must be at least 3 characters")
    .max(50, "Workspace name must be less than 50 characters")
    .regex(
      /^[a-zA-Z0-9\s-_]+$/,
      "Workspace name can only contain letters, numbers, spaces, hyphens, and underscores"
    ),
  description: z
    .string()
    .max(200, "Description must be less than 200 characters")
    .optional(),
  slug: z
    .string()
    .min(3, "Workspace slug must be at least 3 characters")
    .max(30, "Workspace slug must be less than 30 characters")
    .regex(
      /^[a-z0-9-]+$/,
      "Slug can only contain lowercase letters, numbers, and hyphens"
    )
    .optional(),
});

type CreateWorkspaceForm = z.infer<typeof createWorkspaceSchema>;

interface CreateWorkspaceProps {
  onWorkspaceCreated: () => void;
  onCancel: () => void;
}

export function CreateWorkspace({
  onWorkspaceCreated,
  onCancel,
}: CreateWorkspaceProps) {
  const [isGeneratingSlug, setIsGeneratingSlug] = useState(false);

  // Form setup with Zod validation
  const {
    register,
    handleSubmit,
    formState: { errors, isValid },
    watch,
    setValue,
    setError,
  } = useForm<CreateWorkspaceForm>({
    resolver: zodResolver(createWorkspaceSchema),
    mode: "onChange",
    defaultValues: {
      name: "",
      description: "",
      slug: "",
    },
  });

  // Auto-generate slug from workspace name
  const generateSlug = (name: string) => {
    return name
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9\s-]/g, "") // Remove special characters
      .replace(/\s+/g, "-") // Replace spaces with hyphens
      .replace(/-+/g, "-") // Replace multiple hyphens with single
      .replace(/^-|-$/g, ""); // Remove leading/trailing hyphens
  };

  // Update slug when name changes (debounced effect would be better in production)
  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const name = e.target.value;
    if (name && !watch("slug")) {
      setIsGeneratingSlug(true);
      const generatedSlug = generateSlug(name);
      setValue("slug", generatedSlug, { shouldValidate: true });
      setTimeout(() => setIsGeneratingSlug(false), 100);
    }
  };

  // Workspace creation mutation with error handling
  const createWorkspaceMutation = useMutation({
    mutationFn: (data: CreateWorkspaceData) =>
      workspaceApi.createWorkspace(data),
    onSuccess: () => {
      onWorkspaceCreated();
    },
    onError: (error: unknown) => {
      // Handle specific API errors
      const apiError = error as {
        data?: { field?: string; message?: string };
        message?: string;
      };
      if (apiError?.data?.field) {
        const field = apiError.data.field as keyof CreateWorkspaceForm;
        setError(field, {
          type: "server",
          message: apiError.data.message || "This field has an error",
        });
      } else {
        // Generic error handling
        setError("name", {
          type: "server",
          message:
            apiError?.message ||
            "Failed to create workspace. Please try again.",
        });
      }
    },
  });

  // Form submission handler
  const onSubmit = (data: CreateWorkspaceForm) => {
    const workspaceData: CreateWorkspaceData = {
      name: data.name.trim(),
      description: data.description?.trim() || undefined,
      slug: data.slug?.trim() || generateSlug(data.name),
    };

    createWorkspaceMutation.mutate(workspaceData);
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="border-b bg-card">
        <div className="container max-w-2xl mx-auto p-6">
          <div className="flex items-center space-x-4">
            <Button
              variant="ghost"
              size="sm"
              onClick={onCancel}
              className="hover:bg-muted"
              aria-label="Go back to workspace selection"
            >
              <ArrowLeft className="w-4 h-4" />
            </Button>
            <div>
              <h1 className="text-2xl font-bold tracking-tight">
                Create New Workspace
              </h1>
              <p className="text-muted-foreground">
                Set up a new workspace for your team collaboration.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Form */}
      <div className="container max-w-2xl mx-auto p-6">
        <Card>
          <CardHeader>
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center">
                <Building className="w-5 h-5 text-primary" />
              </div>
              <CardTitle>Workspace Details</CardTitle>
            </div>
          </CardHeader>

          <CardContent>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
              {/* Workspace Name */}
              <div className="space-y-2">
                <Label htmlFor="name" className="text-sm font-medium">
                  Workspace Name <span className="text-destructive">*</span>
                </Label>
                <Input
                  id="name"
                  {...register("name")}
                  onChange={(e) => {
                    register("name").onChange(e);
                    handleNameChange(e);
                  }}
                  placeholder="Enter workspace name (e.g., Acme Corp, Marketing Team)"
                  className={errors.name ? "border-destructive" : ""}
                  aria-describedby={errors.name ? "name-error" : undefined}
                />
                {errors.name && (
                  <p id="name-error" className="text-sm text-destructive">
                    {errors.name.message}
                  </p>
                )}
              </div>

              {/* Workspace Slug */}
              <div className="space-y-2">
                <Label htmlFor="slug" className="text-sm font-medium">
                  Workspace Slug
                  {isGeneratingSlug && (
                    <span className="ml-2 text-xs text-muted-foreground">
                      (generating...)
                    </span>
                  )}
                </Label>
                <div className="relative">
                  <Input
                    id="slug"
                    {...register("slug")}
                    placeholder="workspace-slug"
                    className={errors.slug ? "border-destructive" : ""}
                    aria-describedby={errors.slug ? "slug-error" : "slug-help"}
                  />
                  {isGeneratingSlug && (
                    <div className="absolute right-3 top-1/2 -translate-y-1/2">
                      <Loading />
                    </div>
                  )}
                </div>
                {errors.slug ? (
                  <p id="slug-error" className="text-sm text-destructive">
                    {errors.slug.message}
                  </p>
                ) : (
                  <p id="slug-help" className="text-sm text-muted-foreground">
                    This will be used in your workspace URL. Auto-generated from
                    name if left empty.
                  </p>
                )}
              </div>

              {/* Description */}
              <div className="space-y-2">
                <Label htmlFor="description" className="text-sm font-medium">
                  Description
                </Label>
                <Input
                  id="description"
                  {...register("description")}
                  placeholder="Brief description of your workspace (optional)"
                  className={errors.description ? "border-destructive" : ""}
                  aria-describedby={
                    errors.description
                      ? "description-error"
                      : "description-help"
                  }
                />
                {errors.description ? (
                  <p
                    id="description-error"
                    className="text-sm text-destructive"
                  >
                    {errors.description.message}
                  </p>
                ) : (
                  <p
                    id="description-help"
                    className="text-sm text-muted-foreground"
                  >
                    Help your team members understand what this workspace is
                    for.
                  </p>
                )}
              </div>

              {/* Action Buttons */}
              <div className="flex items-center justify-end space-x-4 pt-4">
                <Button
                  type="button"
                  variant="outline"
                  onClick={onCancel}
                  disabled={createWorkspaceMutation.isPending}
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  disabled={!isValid || createWorkspaceMutation.isPending}
                  className="min-w-[120px]"
                >
                  {createWorkspaceMutation.isPending ? (
                    <Loading />
                  ) : (
                    "Create Workspace"
                  )}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
