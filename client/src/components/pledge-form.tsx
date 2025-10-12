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
import { TreePine, DollarSign } from "lucide-react";
import { useMutation } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";

const pledgeSchema = z.object({
  amount: z.string().min(1, "Amount is required").refine((val) => !isNaN(Number(val)) && Number(val) > 0, {
    message: "Amount must be greater than 0",
  }),
  treesCount: z.string().optional(),
  message: z.string().max(500, "Message must be 500 characters or less").optional(),
});

interface PledgeFormProps {
  projectId: string;
  projectName: string;
  onSuccess: () => void;
}

export function PledgeForm({ projectId, projectName, onSuccess }: PledgeFormProps) {
  const [step, setStep] = useState(1);
  const { toast } = useToast();

  const form = useForm({
    resolver: zodResolver(pledgeSchema),
    defaultValues: {
      amount: "",
      treesCount: "",
      message: "",
    },
  });

  const amount = form.watch("amount");
  const estimatedTrees = amount ? Math.floor(Number(amount) / 5) : 0;

  const pledgeMutation = useMutation({
    mutationFn: async (data: z.infer<typeof pledgeSchema>) => {
      return apiRequest("POST", "/api/pledges", {
        projectId,
        amount: data.amount,
        treesCount: data.treesCount || estimatedTrees.toString(),
        message: data.message,
      });
    },
    onSuccess: () => {
      toast({
        title: "Pledge successful!",
        description: "Thank you for supporting environmental conservation.",
      });
      onSuccess();
    },
    onError: () => {
      toast({
        title: "Pledge failed",
        description: "Something went wrong. Please try again.",
        variant: "destructive",
      });
    },
  });

  const handleSubmit = async (data: z.infer<typeof pledgeSchema>) => {
    pledgeMutation.mutate(data);
  };

  const handleNext = async () => {
    const fields = step === 1 ? ["amount"] : [];
    const isValid = await form.trigger(fields as any);
    if (isValid) {
      setStep(step + 1);
    }
  };

  return (
    <div className="max-w-4xl mx-auto">
      {/* Progress indicator */}
      <div className="flex items-center justify-center mb-8">
        <div className="flex items-center gap-2">
          {[1, 2, 3].map((s) => (
            <div key={s} className="flex items-center">
              <div
                className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                  s === step
                    ? "bg-primary text-primary-foreground"
                    : s < step
                    ? "bg-primary/20 text-primary"
                    : "bg-muted text-muted-foreground"
                }`}
              >
                {s}
              </div>
              {s < 3 && (
                <div
                  className={`w-12 h-1 ${
                    s < step ? "bg-primary/20" : "bg-muted"
                  }`}
                />
              )}
            </div>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle>
                {step === 1 && "Choose Your Contribution"}
                {step === 2 && "Add Details (Optional)"}
                {step === 3 && "Confirm Your Pledge"}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <Form {...form}>
                <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
                  {step === 1 && (
                    <>
                      <FormField
                        control={form.control}
                        name="amount"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Pledge Amount ($)</FormLabel>
                            <FormControl>
                              <div className="relative">
                                <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                                <Input
                                  {...field}
                                  type="number"
                                  placeholder="0.00"
                                  className="pl-9"
                                  data-testid="input-pledge-amount"
                                />
                              </div>
                            </FormControl>
                            <FormDescription>
                              Every $5 plants approximately one tree
                            </FormDescription>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <div className="flex gap-2">
                        {[25, 50, 100, 250].map((preset) => (
                          <Button
                            key={preset}
                            type="button"
                            variant="outline"
                            size="sm"
                            onClick={() => form.setValue("amount", preset.toString())}
                            data-testid={`button-preset-${preset}`}
                          >
                            ${preset}
                          </Button>
                        ))}
                      </div>
                    </>
                  )}

                  {step === 2 && (
                    <>
                      <FormField
                        control={form.control}
                        name="treesCount"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Number of Trees (Optional)</FormLabel>
                            <FormControl>
                              <Input
                                {...field}
                                type="number"
                                placeholder={estimatedTrees.toString()}
                                data-testid="input-trees-count"
                              />
                            </FormControl>
                            <FormDescription>
                              Leave blank to use estimated count
                            </FormDescription>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="message"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Personal Message (Optional)</FormLabel>
                            <FormControl>
                              <Textarea
                                {...field}
                                placeholder="Share why this project matters to you..."
                                className="min-h-24"
                                data-testid="input-pledge-message"
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </>
                  )}

                  {step === 3 && (
                    <div className="space-y-4">
                      <div className="p-4 rounded-md bg-muted space-y-3">
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Project</span>
                          <span className="font-medium">{projectName}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Amount</span>
                          <span className="font-medium">${amount}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Estimated Trees</span>
                          <span className="font-medium">{estimatedTrees} trees</span>
                        </div>
                      </div>
                      <p className="text-sm text-muted-foreground">
                        This is a mock pledge flow. In a production environment, payment processing would be integrated here.
                      </p>
                    </div>
                  )}

                  <div className="flex gap-3">
                    {step > 1 && (
                      <Button
                        type="button"
                        variant="outline"
                        onClick={() => setStep(step - 1)}
                        data-testid="button-pledge-back"
                      >
                        Back
                      </Button>
                    )}
                    {step < 3 ? (
                      <Button
                        type="button"
                        onClick={handleNext}
                        className="flex-1"
                        data-testid="button-pledge-next"
                      >
                        Next
                      </Button>
                    ) : (
                      <Button
                        type="submit"
                        className="flex-1"
                        disabled={pledgeMutation.isPending}
                        data-testid="button-pledge-submit"
                      >
                        {pledgeMutation.isPending ? "Processing..." : "Confirm Pledge"}
                      </Button>
                    )}
                  </div>
                </form>
              </Form>
            </CardContent>
          </Card>
        </div>

        {/* Summary sidebar */}
        <div>
          <Card className="sticky top-20">
            <CardHeader>
              <CardTitle className="text-lg">Impact Summary</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center gap-3 p-3 rounded-md bg-primary/10">
                <TreePine className="h-8 w-8 text-primary" />
                <div>
                  <div className="text-2xl font-bold text-primary">{estimatedTrees}</div>
                  <div className="text-sm text-muted-foreground">Trees to Plant</div>
                </div>
              </div>
              <div className="text-sm text-muted-foreground">
                Your contribution will help restore natural ecosystems and combat climate change.
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
