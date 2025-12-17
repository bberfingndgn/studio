"use client";

import { useFormState } from "react-dom";
import { generateStudyPlanAction } from "@/lib/actions";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Sparkles, LoaderCircle } from "lucide-react";
import { useEffect } from "react";
import { useToast } from "@/hooks/use-toast";

const initialState = {
  studyPlan: null,
  error: null,
};

function SubmitButton() {
    // This component is not yet supported in the version of React used by Next.js.
    // We will use a workaround with formState.
    return (
        <Button type="submit" size="lg" className="w-full">
            <Sparkles className="mr-2 h-4 w-4" />
            Generate My Plan
        </Button>
    )
}

export default function StudyPlanPage() {
  const [formState, formAction] = useFormState(generateStudyPlanAction, initialState);
  const { toast } = useToast();

   useEffect(() => {
    if (formState.error) {
      toast({
        variant: "destructive",
        title: "Oh no! Something went wrong.",
        description: formState.error,
      });
    }
  }, [formState.error, toast]);

  return (
    <div className="container mx-auto py-8 px-4 flex-1">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-8">
            <h1 className="text-4xl font-bold font-headline text-primary">Personalized Study Plan</h1>
            <p className="text-muted-foreground mt-2 text-lg">
                Let our AI craft the perfect study schedule just for you.
            </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <Card>
                <form action={formAction}>
                    <CardHeader>
                        <CardTitle>Tell us about your needs</CardTitle>
                        <CardDescription>The more details, the better the plan.</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-6">
                        <div className="space-y-2">
                            <Label htmlFor="subjects">Subjects</Label>
                            <Input id="subjects" name="subjects" placeholder="e.g., Math, Science, History" required />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="availableTime">Available Time</Label>
                            <Input id="availableTime" name="availableTime" placeholder="e.g., 2 hours on weekdays, 4 hours on weekends" required />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="learningPreferences">Learning Preferences</Label>
                            <Textarea id="learningPreferences" name="learningPreferences" placeholder="e.g., I like visuals, prefer studying in the morning..." required />
                        </div>
                    </CardContent>
                    <CardFooter>
                         <Button type="submit" size="lg" className="w-full">
                            <Sparkles className="mr-2 h-4 w-4" />
                            Generate My Plan
                        </Button>
                    </CardFooter>
                </form>
            </Card>

            <Card className="flex flex-col">
                <CardHeader>
                    <CardTitle>Your AI-Generated Plan</CardTitle>
                    <CardDescription>Here's your roadmap to success.</CardDescription>
                </CardHeader>
                <CardContent className="flex-1 whitespace-pre-wrap font-mono text-sm bg-muted/50 p-6 rounded-lg overflow-auto">
                    {formState.studyPlan ? (
                        <p>{formState.studyPlan}</p>
                    ) : (
                        <div className="flex items-center justify-center h-full text-muted-foreground">
                            <p>Your plan will appear here...</p>
                        </div>
                    )}
                </CardContent>
            </Card>
        </div>
      </div>
    </div>
  );
}
