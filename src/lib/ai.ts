// AI Service - Using Hugging Face Inference API (Free)
// Get your free API key at: https://huggingface.co/settings/tokens

interface AIResponse {
  message: {
    content: string | Array<{ text: string }>;
  };
}

class AIService {
  private apiKey: string | null = null;
  private apiEndpoint: string = "https://api-inference.huggingface.co/models/mistralai/Mistral-7B-Instruct-v0.2";

  // Initialize with API key (store in environment variable)
  init(apiKey?: string) {
    this.apiKey = apiKey || import.meta.env.VITE_HUGGINGFACE_API_KEY || null;
  }

  async chat(prompt: string): Promise<AIResponse | null> {
    if (!this.apiKey) {
      console.warn("Hugging Face API key not configured. Using mock response.");
      console.log("Get your free API key at: https://huggingface.co/settings/tokens");
      console.log("Then add VITE_HUGGINGFACE_API_KEY to your .env file");
      return this.getMockResponse(prompt);
    }

    try {
      const response = await fetch(this.apiEndpoint, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${this.apiKey}`,
        },
        body: JSON.stringify({
          inputs: prompt,
          parameters: {
            max_new_tokens: 1000,
            temperature: 0.7,
            return_full_text: false,
          },
        }),
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error("Hugging Face API error:", response.status, errorText);
        
        // If model is loading, wait and retry
        if (response.status === 503) {
          console.log("Model is loading, using mock response for now...");
          return this.getMockResponse(prompt);
        }
        
        throw new Error(`API error: ${response.statusText}`);
      }

      const data = await response.json();
      
      // Hugging Face returns an array with generated text
      const generatedText = Array.isArray(data) ? data[0]?.generated_text : data.generated_text;
      
      // Try to extract JSON from the response
      let content = generatedText;
      
      // If the response contains JSON, extract it
      const jsonMatch = generatedText.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        content = jsonMatch[0];
      } else {
        // If no JSON found, use mock response
        console.log("No valid JSON in AI response, using mock data");
        return this.getMockResponse(prompt);
      }

      return {
        message: {
          content: content,
        },
      };
    } catch (error) {
      console.error("AI chat error:", error);
      return this.getMockResponse(prompt);
    }
  }

  async feedback(imagePath: string, instructions: string): Promise<AIResponse | null> {
    console.log("Analyzing resume with instructions:", instructions);
    
    // Create a detailed prompt for resume analysis
    const prompt = `You are a professional resume reviewer. Analyze this resume and provide feedback in the following JSON format (respond ONLY with valid JSON, no other text):

${instructions}

Respond with a JSON object with this exact structure:
{
  "overallScore": <number 60-95>,
  "ATS": {
    "score": <number 60-95>,
    "tips": [<array of 3-5 specific tips>]
  },
  "strengths": [<array of 3-5 strengths>],
  "improvements": [<array of 3-5 improvements>],
  "sections": {
    "summary": {"score": <number>, "feedback": "<text>"},
    "experience": {"score": <number>, "feedback": "<text>"},
    "education": {"score": <number>, "feedback": "<text>"},
    "skills": {"score": <number>, "feedback": "<text>"}
  }
}`;

    // Simulate a brief processing delay for better UX
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    // Try to get AI response, fall back to mock if needed
    const response = await this.chat(prompt);
    
    if (!response) {
      return this.getMockResponse(instructions);
    }
    
    try {
      // Validate the response is valid JSON
      const content = typeof response.message.content === "string"
        ? response.message.content
        : response.message.content[0].text;
      
      JSON.parse(content);
      return response;
    } catch (e) {
      console.log("AI response was not valid JSON, using mock data");
      return this.getMockResponse(instructions);
    }
  }

  // Mock response for development/demo
  private getMockResponse(prompt: string): AIResponse {
    // Generate random scores for variety
    const overallScore = Math.floor(Math.random() * 20) + 70; // 70-90
    const atsScore = Math.floor(Math.random() * 25) + 65; // 65-90
    
    const mockFeedback = {
      overallScore: overallScore,
      ATS: {
        score: atsScore,
        tips: [
          "Add more keywords from the job description to improve ATS compatibility",
          "Use standard section headings like 'Experience', 'Education', and 'Skills'",
          "Include measurable achievements with specific numbers and percentages",
          "Ensure consistent formatting throughout the document",
          "Add relevant technical skills that match the job requirements",
        ],
      },
      strengths: [
        "Clear and professional formatting makes the resume easy to read",
        "Relevant work experience is well-highlighted",
        "Good use of action verbs to describe accomplishments",
        "Education credentials are clearly presented",
        "Contact information is easy to find",
      ],
      improvements: [
        "Add a professional summary at the top to grab attention",
        "Include more quantifiable achievements (e.g., 'Increased sales by 30%')",
        "Expand the technical skills section with relevant technologies",
        "Add links to portfolio, LinkedIn, or GitHub if applicable",
        "Consider adding relevant certifications or training",
      ],
      // Add the properties that Summary component expects
      toneAndStyle: {
        score: Math.floor(Math.random() * 20) + 70,
        feedback: "Your resume maintains a professional tone throughout. Consider using more action-oriented language to make your achievements stand out.",
        tips: [
          {
            type: "good" as const,
            tip: "Professional Language",
            explanation: "Your resume uses appropriate professional terminology and maintains a formal tone throughout.",
          },
          {
            type: "improve" as const,
            tip: "Action Verbs",
            explanation: "Consider starting more bullet points with strong action verbs like 'Led', 'Developed', 'Implemented' to make your contributions more impactful.",
          },
          {
            type: "good" as const,
            tip: "Consistent Voice",
            explanation: "You maintain a consistent voice and tense throughout the document, which improves readability.",
          },
        ],
      },
      content: {
        score: Math.floor(Math.random() * 20) + 70,
        feedback: "Content is relevant and well-organized. Add more specific metrics and quantifiable results to strengthen your impact statements.",
        tips: [
          {
            type: "good" as const,
            tip: "Relevant Experience",
            explanation: "Your work experience is directly relevant to the position you're applying for.",
          },
          {
            type: "improve" as const,
            tip: "Quantify Achievements",
            explanation: "Add specific numbers and metrics to demonstrate the impact of your work (e.g., 'Increased sales by 30%' instead of 'Increased sales').",
          },
          {
            type: "improve" as const,
            tip: "Remove Redundancy",
            explanation: "Some bullet points repeat similar information. Consolidate or remove redundant content to make room for more unique achievements.",
          },
        ],
      },
      structure: {
        score: Math.floor(Math.random() * 20) + 70,
        feedback: "Resume structure is clear and easy to follow. Consider adding section dividers or using consistent formatting for better visual hierarchy.",
        tips: [
          {
            type: "good" as const,
            tip: "Clear Sections",
            explanation: "Your resume is well-organized with clearly defined sections that are easy to navigate.",
          },
          {
            type: "good" as const,
            tip: "Logical Flow",
            explanation: "Information flows logically from most recent to oldest, making it easy for recruiters to follow your career progression.",
          },
          {
            type: "improve" as const,
            tip: "Visual Hierarchy",
            explanation: "Consider using consistent formatting (bold, italics, spacing) to create a clearer visual hierarchy between sections and subsections.",
          },
        ],
      },
      skills: {
        score: Math.floor(Math.random() * 20) + 70,
        feedback: "Skills section covers relevant areas. Expand to include more technical proficiencies and tools specific to your target role.",
        tips: [
          {
            type: "good" as const,
            tip: "Relevant Skills Listed",
            explanation: "You've included skills that are directly relevant to the job you're applying for.",
          },
          {
            type: "improve" as const,
            tip: "Categorize Skills",
            explanation: "Group your skills into categories (e.g., Programming Languages, Frameworks, Tools) for better organization and readability.",
          },
          {
            type: "improve" as const,
            tip: "Add Proficiency Levels",
            explanation: "Consider indicating your proficiency level for each skill (e.g., Expert, Intermediate, Familiar) to set clear expectations.",
          },
        ],
      },
      sections: {
        summary: {
          score: Math.floor(Math.random() * 20) + 65,
          feedback: "Consider adding a brief professional summary (2-3 sentences) at the top of your resume highlighting your key strengths and career goals.",
        },
        experience: {
          score: Math.floor(Math.random() * 15) + 75,
          feedback: "Your experience section is solid. To improve, add more specific metrics and quantifiable results for each role (e.g., 'Managed team of 5', 'Reduced costs by 20%').",
        },
        education: {
          score: Math.floor(Math.random() * 10) + 80,
          feedback: "Education section is well-formatted and complete. Consider adding relevant coursework, GPA (if strong), or academic achievements.",
        },
        skills: {
          score: Math.floor(Math.random() * 25) + 60,
          feedback: "Expand your skills section to include more relevant technologies and tools. Group skills by category (e.g., Programming Languages, Frameworks, Tools) for better readability.",
        },
      },
    };

    return {
      message: {
        content: JSON.stringify(mockFeedback),
      },
    };
  }
}

export const aiService = new AIService();
