
import { supabase } from "@/integrations/supabase/client";
import { secureLogger } from "@/utils/secureLogger";
import { InputSanitizer } from "@/utils/inputSanitizer";

interface SecureAIRequest {
  prompt: string;
  context?: string;
  model?: string;
  temperature?: number;
  maxTokens?: number;
}

interface SecureAIResponse {
  content: string;
  tokens_used?: number;
  model_used?: string;
}

/**
 * Secure OpenAI service that only uses Edge Functions
 * This ensures API keys are never exposed to the client
 */
export class SecureOpenAIService {
  /**
   * Make a secure AI request through Edge Functions
   */
  static async makeRequest(
    functionName: string,
    request: SecureAIRequest,
    userId?: string
  ): Promise<SecureAIResponse> {
    // Validate and sanitize input
    const sanitizedPrompt = InputSanitizer.sanitizeText(request.prompt, 10000);
    const sanitizedContext = request.context 
      ? InputSanitizer.sanitizeText(request.context, 10000) 
      : undefined;

    if (!sanitizedPrompt.trim()) {
      throw new Error('Prompt cannot be empty');
    }

    // Check rate limiting
    const rateLimit = InputSanitizer.checkRateLimit(
      userId || 'anonymous',
      'ai_request',
      10, // 10 requests per minute
      60 * 1000
    );

    if (!rateLimit.allowed) {
      throw new Error(`Rate limit exceeded. Try again in ${Math.ceil((rateLimit.resetTime - Date.now()) / 1000)} seconds`);
    }

    secureLogger.info('Making secure AI request', {
      user_id: userId,
      function_name: functionName,
      prompt_length: sanitizedPrompt.length,
      has_context: !!sanitizedContext
    });

    try {
      const { data, error } = await supabase.functions.invoke(functionName, {
        body: {
          prompt: sanitizedPrompt,
          context: sanitizedContext,
          model: request.model || 'gpt-4.1-2025-04-14',
          temperature: Math.min(Math.max(request.temperature || 0.3, 0), 2),
          maxTokens: Math.min(request.maxTokens || 1000, 4000)
        }
      });

      if (error) {
        secureLogger.error('Edge function error', {
          user_id: userId,
          function_name: functionName,
          error: error.message
        });
        throw new Error(error.message || 'AI request failed');
      }

      if (!data?.content) {
        secureLogger.error('Invalid AI response', {
          user_id: userId,
          function_name: functionName,
          data
        });
        throw new Error('Invalid response from AI service');
      }

      // Sanitize the response
      const sanitizedContent = InputSanitizer.sanitizeAIResponse(data.content);

      secureLogger.info('AI request completed successfully', {
        user_id: userId,
        function_name: functionName,
        response_length: sanitizedContent.length,
        tokens_used: data.tokens_used
      });

      return {
        content: sanitizedContent,
        tokens_used: data.tokens_used,
        model_used: data.model_used
      };
    } catch (error) {
      secureLogger.error('AI request failed', {
        user_id: userId,
        function_name: functionName,
        error: (error as Error).message
      });
      throw error;
    }
  }

  /**
   * Analyze medical data securely
   */
  static async analyzeMedicalData(
    prompt: string,
    userId: string,
    context?: string
  ): Promise<SecureAIResponse> {
    return this.makeRequest('ai-medical-analysis', {
      prompt,
      context,
      model: 'gpt-4.1-2025-04-14',
      temperature: 0.2
    }, userId);
  }

  /**
   * Chat with AI doctor securely
   */
  static async chatWithAIDoctor(
    message: string,
    userId: string,
    chatHistory?: string
  ): Promise<SecureAIResponse> {
    return this.makeRequest('ai-doctor-chat', {
      prompt: message,
      context: chatHistory,
      temperature: 0.3
    }, userId);
  }

  /**
   * Generate health analytics securely
   */
  static async generateHealthAnalytics(
    healthData: string,
    userId: string
  ): Promise<SecureAIResponse> {
    return this.makeRequest('generate-health-analytics', {
      prompt: healthData,
      model: 'gpt-4.1-2025-04-14',
      temperature: 0.1
    }, userId);
  }
}
