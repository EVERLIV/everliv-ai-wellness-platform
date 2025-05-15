
import { supabase } from "@/integrations/supabase/client";
import { Message, SuggestedQuestion } from "@/components/dashboard/ai-doctor/types";
import { v4 as uuidv4 } from "uuid";
import { User } from '@supabase/supabase-js';
import { toastHelpers } from "@/components/ui/use-toast";

// Cache for user profile data to reduce database queries
const profileCache = new Map<string, any>();

/**
 * Fetches medical context for the current user to enhance AI responses
 */
export async function getUserMedicalContext(user: User | null): Promise<string> {
  if (!user) return "";
  
  try {
    // Check cache first
    if (profileCache.has(user.id)) {
      const cachedProfile = profileCache.get(user.id);
      return formatMedicalContext(cachedProfile);
    }
    
    // Fetch user profile data
    const { data: profile, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', user.id)
      .single();
    
    if (error) {
      console.error("Error fetching user medical context:", error);
      return "";
    }
    
    // Cache the profile data
    profileCache.set(user.id, profile);
    
    return formatMedicalContext(profile);
  } catch (error) {
    console.error("Error in getUserMedicalContext:", error);
    return "";
  }
}

/**
 * Formats user profile data into a medical context string for AI
 */
function formatMedicalContext(profile: any): string {
  if (!profile) return "";
  
  const parts = [];
  
  if (profile.gender) parts.push(`Gender: ${profile.gender}`);
  if (profile.age || profile.date_of_birth) {
    const age = profile.age || calculateAge(profile.date_of_birth);
    parts.push(`Age: ${age}`);
  }
  if (profile.height) parts.push(`Height: ${profile.height} cm`);
  if (profile.weight) parts.push(`Weight: ${profile.weight} kg`);
  
  if (profile.medical_conditions && profile.medical_conditions.length > 0) {
    parts.push(`Medical conditions: ${profile.medical_conditions.join(', ')}`);
  }
  
  if (profile.allergies && profile.allergies.length > 0) {
    parts.push(`Allergies: ${profile.allergies.join(', ')}`);
  }
  
  if (profile.medications && profile.medications.length > 0) {
    parts.push(`Current medications: ${profile.medications.join(', ')}`);
  }
  
  return parts.join('. ');
}

/**
 * Calculate age from date of birth
 */
function calculateAge(dateOfBirth: string): number {
  if (!dateOfBirth) return 0;
  
  const birthDate = new Date(dateOfBirth);
  const today = new Date();
  let age = today.getFullYear() - birthDate.getFullYear();
  const monthDifference = today.getMonth() - birthDate.getMonth();
  
  if (monthDifference < 0 || (monthDifference === 0 && today.getDate() < birthDate.getDate())) {
    age--;
  }
  
  return age;
}

/**
 * Process a user message and generate AI doctor response
 */
export async function processAIDoctorMessage(
  message: string, 
  user: User | null, 
  conversationHistory: Message[]
): Promise<Message> {
  try {
    // Get medical context
    const medicalContext = await getUserMedicalContext(user);
    
    // Prepare conversation history for the AI
    const formattedHistory = conversationHistory.map(msg => ({
      role: msg.role,
      content: msg.content
    }));
    
    // Call OpenAI service
    const response = await fetch('/api/ai-doctor', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        message,
        medicalContext,
        conversationHistory: formattedHistory
      })
    });
    
    if (!response.ok) {
      throw new Error(`Error: ${response.status}`);
    }
    
    const data = await response.json();
    
    return {
      id: uuidv4(),
      role: "assistant",
      content: data.response,
      timestamp: new Date()
    };
  } catch (error) {
    console.error("Error calling AI Doctor service:", error);
    toastHelpers.error("Не удалось получить ответ от ИИ-доктора. Пожалуйста, попробуйте позже.");
    
    return {
      id: uuidv4(),
      role: "assistant",
      content: "Извините, я не смог обработать ваш запрос. Пожалуйста, попробуйте позже или обратитесь в службу поддержки.",
      timestamp: new Date()
    };
  }
}

/**
 * Get suggested questions based on user profile and conversation
 */
export function getSuggestedQuestions(profile: any): SuggestedQuestion[] {
  const questions: SuggestedQuestion[] = [
    {
      text: "Как улучшить мой сон?",
      icon: <span>{"sleep"}</span>
    },
    {
      text: "Какие добавки мне стоит принимать?",
      icon: <span>{"pill"}</span>
    },
    {
      text: "Как снизить стресс?",
      icon: <span>{"yoga"}</span>
    }
  ];
  
  // Add personalized questions based on profile
  if (profile?.medical_conditions?.includes('гипертония')) {
    questions.push({
      text: "Как мне контролировать артериальное давление?",
      icon: <span>{"heart"}</span>
    });
  }
  
  if (profile?.medical_conditions?.includes('диабет')) {
    questions.push({
      text: "Какая диета рекомендуется при диабете?",
      icon: <span>{"apple"}</span>
    });
  }
  
  return questions;
}
