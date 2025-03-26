
import { toast } from "sonner";

// Interface for transaction data
interface Transaction {
  id: number;
  date: string;
  description: string;
  amount: number;
  category: string;
}

// Interface for OpenAI analysis results
interface AnalysisResult {
  insights: string[];
  topSpendingCategory: string;
  savingsOpportunities: {
    amount: number;
    description: string;
  }[];
  budgetRecommendations: string[];
}

const OPENAI_API_URL = "https://api.openai.com/v1/chat/completions";

export async function analyzeTransactions(
  transactions: Transaction[],
  apiKey: string
): Promise<AnalysisResult> {
  if (!apiKey) {
    toast.error("OpenAI API key is required");
    throw new Error("OpenAI API key is required");
  }

  try {
    // Prepare the prompt for OpenAI
    const prompt = `
      Analyze these bank transactions and provide financial insights:
      ${JSON.stringify(transactions, null, 2)}
      
      Please provide your analysis in the following JSON format:
      {
        "insights": [List of 4-5 key financial insights based on the data],
        "topSpendingCategory": "The category with highest spending",
        "savingsOpportunities": [
          {
            "amount": estimated savings amount number,
            "description": "Description of how to save this money"
          }
        ],
        "budgetRecommendations": [List of 3-4 specific budget recommendations]
      }
      
      Only return the JSON, no other text.
    `;

    // Make request to OpenAI API
    const response = await fetch(OPENAI_API_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: "gpt-3.5-turbo",
        messages: [
          {
            role: "system",
            content:
              "You are a financial analyst who specializes in analyzing bank transactions. Provide detailed financial insights and recommendations based on the transaction data provided.",
          },
          {
            role: "user",
            content: prompt,
          },
        ],
        temperature: 0.5,
      }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(
        errorData.error?.message || "Error analyzing transactions"
      );
    }

    const data = await response.json();
    const analysisText = data.choices[0]?.message?.content;

    if (!analysisText) {
      throw new Error("No analysis received from OpenAI");
    }

    try {
      // Parse the JSON response
      const analysis = JSON.parse(analysisText);
      return analysis;
    } catch (err) {
      console.error("Failed to parse OpenAI response:", analysisText);
      throw new Error("Failed to parse analysis results");
    }
  } catch (error) {
    console.error("Error analyzing transactions:", error);
    toast.error(
      error instanceof Error 
        ? error.message 
        : "Failed to analyze transactions"
    );
    
    // Return a default analysis
    return {
      insights: ["Could not generate insights due to an error."],
      topSpendingCategory: "",
      savingsOpportunities: [],
      budgetRecommendations: []
    };
  }
}
