"use server";

import { generateStudyPlan, type StudyPlanInput } from "@/ai/flows/personalized-study-plan";
import { z } from "zod";

const StudyPlanFormSchema = z.object({
    subjects: z.string().min(3, "Please enter at least one subject."),
    availableTime: z.string().min(5, "Please describe your available time."),
    learningPreferences: z.string().min(5, "Please describe your learning preferences.")
});

export async function generateStudyPlanAction(prevState: any, formData: FormData) {
  const validatedFields = StudyPlanFormSchema.safeParse({
    subjects: formData.get('subjects'),
    availableTime: formData.get('availableTime'),
    learningPreferences: formData.get('learningPreferences'),
  });

  if (!validatedFields.success) {
    return {
      studyPlan: null,
      error: "Please check the form for errors.",
      fieldErrors: validatedFields.error.flatten().fieldErrors,
    };
  }

  try {
    const result = await generateStudyPlan(validatedFields.data as StudyPlanInput);
    return {
      studyPlan: result.studyPlan,
      error: null,
      fieldErrors: {},
    };
  } catch (error) {
    console.error("Error generating study plan:", error);
    return {
      studyPlan: null,
      error: "There was an issue with the AI. Please try again.",
      fieldErrors: {},
    };
  }
}
