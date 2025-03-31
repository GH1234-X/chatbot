import { apiRequest } from "./queryClient";

export type ChatRole = "user" | "assistant" | "system";

export interface ChatMessage {
  role: ChatRole;
  content: string;
}

export interface ChatResponse {
  id: string;
  choices: {
    index: number;
    message: {
      role: string;
      content: string;
    };
    finish_reason: string;
  }[];
}

export const getChatCompletion = async (messages: ChatMessage[]): Promise<ChatResponse> => {
  try {
    const response = await apiRequest("POST", "/api/chat/completion", { messages });
    return await response.json();
  } catch (error) {
    console.error("Error getting chat completion:", error);
    throw error;
  }
};

// Helper function to prepare chat history
export const prepareChatMessages = (messages: ChatMessage[]): ChatMessage[] => {
  // Add system message at the beginning if it doesn't exist
  if (messages.length === 0 || messages[0].role !== "system") {
    return [
      {
        role: "system",
        content: "You are GujaratEduBot, a specialized admission assistant for Gujarat colleges in India. You help students with Gujarat university admission requirements, entrance exams like GUJCET, scholarship information specific to Gujarat, and college cutoffs for Gujarat institutions. Always focus your responses on Gujarat-specific educational information. Be helpful, concise, and accurate."
      },
      ...messages
    ];
  }
  return messages;
};
