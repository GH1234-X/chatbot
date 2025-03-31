import { apiRequest } from "./queryClient";

interface ChatResponse {
  response: string;
}

export async function generateChatResponse(message: string, userId?: number): Promise<string> {
  try {
    const response = await apiRequest<ChatResponse>("POST", "/api/chat/generate", {
      message,
      userId
    });
    
    const data = await response.json();
    return data.response;
  } catch (error) {
    console.error("Error generating chat response:", error);
    throw new Error("Failed to generate response. Please try again.");
  }
}
