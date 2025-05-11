// OpenAI integration for health analysis services

import OpenAI from "openai";

interface OpenAIBloodAnalysisParams {
  text?: string;
  imageUrl?: string;
}

// Initialize OpenAI client
const initializeOpenAI = () => {
  // In a production environment, you would fetch this from environment variables
  // In the browser environment, we can only access localStorage
  const apiKey = localStorage.getItem('OPENAI_API_KEY');
  
  if (!apiKey) {
    throw new Error("OpenAI API key is required. Please set it in your localStorage.");
  }

  return new OpenAI({
    apiKey,
    dangerouslyAllowBrowser: true // Note: In production, use backend calls
  });
};

/**
 * Analyzes blood test results using OpenAI
 */
export const analyzeBloodTestWithOpenAI = async (params: OpenAIBloodAnalysisParams) => {
  console.log("Analyzing blood test with OpenAI", params);
  
  try {
    const openai = initializeOpenAI();
    const { text, imageUrl } = params;
    
    let messages = [];
    
    if (text) {
      // For text input
      messages = [
        {
          role: "system",
          content: createBloodTestSystemPrompt()
        },
        {
          role: "user",
          content: createBloodTestPrompt(text)
        }
      ];
    } else if (imageUrl) {
      // For image input
      messages = [
        {
          role: "system",
          content: createBloodTestSystemPrompt()
        },
        {
          role: "user",
          content: [
            { type: "text", text: "Analyze this blood test results image and provide detailed recommendations:" },
            { type: "image_url", image_url: { url: imageUrl } }
          ]
        }
      ];
    } else {
      throw new Error("Either text or image is required");
    }
    
    // Make API call to OpenAI
    const response = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: messages as any,
      temperature: 0.5,
      max_tokens: 1500,
    });
    
    const aiResponse = response.choices[0].message.content || "";
    
    // Parse the AI response to match our expected format
    // This assumes the AI is instructed to respond in a specific JSON format
    try {
      return JSON.parse(aiResponse);
    } catch (error) {
      console.error("Failed to parse AI response as JSON:", error);
      // Handle the case where AI doesn't return valid JSON
      // For now, return a structured error response
      return {
        markers: [{ name: "Error", value: "Failed to parse AI response", normalRange: "N/A", status: "high", recommendation: "Please try again" }],
        supplements: [],
        generalRecommendation: "There was an issue processing your results. Please try again or contact support."
      };
    }
  } catch (error) {
    console.error("Error analyzing blood test:", error);
    throw error;
  }
};

/**
 * Creates a system prompt for blood test analysis
 */
export const createBloodTestSystemPrompt = () => {
  return `You are a highly qualified medical AI assistant specializing in blood test analysis. 
  Your task is to analyze blood test results, identify abnormalities, and provide personalized recommendations.
  
  Respond ONLY with a JSON object in the following format:
  {
    "markers": [
      {
        "name": "Marker name",
        "value": "Detected value",
        "normalRange": "Normal range",
        "status": "normal|high|low",
        "recommendation": "Specific recommendation for this marker"
      }
    ],
    "supplements": [
      {
        "name": "Supplement name",
        "reason": "Reason for recommendation",
        "dosage": "Recommended dosage"
      }
    ],
    "generalRecommendation": "Overall recommendation based on all markers"
  }
  
  Important guidelines:
  - Be thorough and scientifically accurate in your analysis
  - Identify both concerning markers and positive indicators
  - Provide specific, actionable recommendations for each abnormal marker
  - Suggest appropriate supplements or lifestyle changes based on the specific results
  - Include a comprehensive overall recommendation
  - Consider potential interactions between different markers
  
  Do not include any text outside of this JSON structure.`;
};

/**
 * Creates a prompt for OpenAI based on blood test data
 */
export const createBloodTestPrompt = (text: string) => {
  return `Analyze the following blood test results in detail and provide personalized recommendations:
  
  ${text}
  
  For each abnormal marker:
  1. Identify the specific issue
  2. Explain its health implications
  3. Suggest specific dietary, lifestyle or supplement interventions
  4. Indicate urgency level if appropriate
  
  Also identify any positive markers and provide encouragement.
  
  Remember to respond ONLY in the required JSON format.`;
};

/**
 * Analyzes biological age based on biomarkers
 */
export const analyzeBiologicalAgeWithOpenAI = async (biomarkerData: object) => {
  try {
    const openai = initializeOpenAI();
    
    const messages = [
      {
        role: "system",
        content: createBiologicalAgeSystemPrompt()
      },
      {
        role: "user",
        content: createBiologicalAgePrompt(biomarkerData)
      }
    ];
    
    // Make API call to OpenAI
    const response = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: messages as any,
      temperature: 0.3,
      max_tokens: 1500,
    });
    
    const aiResponse = response.choices[0].message.content || "";
    
    try {
      return JSON.parse(aiResponse);
    } catch (error) {
      console.error("Failed to parse biological age AI response as JSON:", error);
      return {
        biologicalAge: null,
        chronologicalAge: null,
        agingFactors: [],
        recommendations: [],
        detailedAnalysis: "Error processing results. Please try again."
      };
    }
  } catch (error) {
    console.error("Error analyzing biological age:", error);
    throw error;
  }
};

/**
 * Creates a system prompt for biological age analysis
 */
export const createBiologicalAgeSystemPrompt = () => {
  return `You are an expert AI specializing in biological age assessment and longevity medicine. 
  Your task is to analyze biomarkers and health data to estimate biological age and provide longevity recommendations.
  
  Respond ONLY with a JSON object in the following format:
  {
    "biologicalAge": number,
    "chronologicalAge": number,
    "ageDifference": number,
    "agingFactors": [
      {
        "factor": "Factor name",
        "impact": "high|medium|low",
        "description": "How this factor affects biological age"
      }
    ],
    "recommendations": [
      {
        "category": "diet|exercise|sleep|supplements|lifestyle",
        "recommendation": "Specific recommendation",
        "priority": "high|medium|low"
      }
    ],
    "detailedAnalysis": "Overall analysis explaining biological age calculation and key insights"
  }
  
  Important guidelines:
  - Be scientifically accurate in your assessments
  - Base your analysis on established biological age calculation methodologies
  - Provide personalized, actionable recommendations
  - Prioritize evidence-based interventions
  - Consider interactions between different biomarkers
  
  Do not include any text outside of this JSON structure.`;
};

/**
 * Creates a biological age analysis prompt
 */
export const createBiologicalAgePrompt = (biomarkerData: object) => {
  return `Analyze the following biomarker data to estimate biological age and provide comprehensive longevity recommendations:
  
  ${JSON.stringify(biomarkerData)}
  
  In your analysis:
  1. Calculate estimated biological age based on these biomarkers
  2. Compare to chronological age
  3. Identify key factors accelerating or decelerating aging
  4. Provide specific, personalized interventions to optimize longevity
  5. Prioritize recommendations by potential impact
  
  Remember to respond ONLY in the required JSON format.`;
};

/**
 * Performs comprehensive health analysis
 */
export const performComprehensiveAnalysisWithOpenAI = async (healthData: object) => {
  try {
    const openai = initializeOpenAI();
    
    const messages = [
      {
        role: "system",
        content: createComprehensiveAnalysisSystemPrompt()
      },
      {
        role: "user",
        content: createComprehensiveAnalysisPrompt(healthData)
      }
    ];
    
    // Make API call to OpenAI
    const response = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: messages as any,
      temperature: 0.4,
      max_tokens: 2000,
    });
    
    const aiResponse = response.choices[0].message.content || "";
    
    try {
      return JSON.parse(aiResponse);
    } catch (error) {
      console.error("Failed to parse comprehensive analysis AI response as JSON:", error);
      return {
        healthScore: 0,
        keyConcerns: [],
        strengths: [],
        recommendations: [],
        detailedAnalysis: "Error processing results. Please try again."
      };
    }
  } catch (error) {
    console.error("Error performing comprehensive analysis:", error);
    throw error;
  }
};

/**
 * Creates a system prompt for comprehensive health analysis
 */
export const createComprehensiveAnalysisSystemPrompt = () => {
  return `You are a holistic health AI expert specializing in comprehensive health assessment. 
  Your task is to analyze various health metrics and provide an integrated health analysis.
  
  Respond ONLY with a JSON object in the following format:
  {
    "healthScore": number (0-100),
    "keyConcerns": [
      {
        "area": "Area of concern",
        "severity": "critical|high|medium|low",
        "description": "Detailed description of the concern"
      }
    ],
    "strengths": [
      {
        "area": "Health strength",
        "description": "Description of this health strength"
      }
    ],
    "systemAnalysis": [
      {
        "system": "cardiovascular|metabolic|immune|hormonal|neurological|etc",
        "status": "optimal|good|fair|poor|critical",
        "markers": [
          {
            "name": "Marker name",
            "value": "Value",
            "interpretation": "Interpretation of this specific marker"
          }
        ],
        "recommendations": [
          "Specific recommendation for this system"
        ]
      }
    ],
    "integratedRecommendations": [
      {
        "category": "nutrition|exercise|sleep|stress|supplements|medical|lifestyle",
        "recommendation": "Specific integrated recommendation",
        "priority": "high|medium|low",
        "timeframe": "immediate|short-term|long-term"
      }
    ],
    "detailedAnalysis": "Overall integrated analysis explaining connections between systems and key insights"
  }
  
  Important guidelines:
  - Provide a truly integrated analysis that looks at relationships between different health systems
  - Consider how issues in one system may affect others
  - Be comprehensive but prioritize the most important findings
  - Make evidence-based recommendations
  - Personalize the analysis based on all available data
  
  Do not include any text outside of this JSON structure.`;
};

/**
 * Creates a comprehensive analysis prompt
 */
export const createComprehensiveAnalysisPrompt = (healthData: object) => {
  return `Perform a comprehensive health analysis based on the following health data:
  
  ${JSON.stringify(healthData)}
  
  In your analysis:
  1. Evaluate overall health status with a numerical score
  2. Identify key health concerns and their severity
  3. Highlight health strengths and positive indicators
  4. Analyze each body system separately
  5. Provide integrated recommendations that address multiple issues simultaneously
  6. Consider interactions between different systems and markers
  7. Prioritize recommendations by impact and urgency
  
  Remember to respond ONLY in the required JSON format.`;
};
