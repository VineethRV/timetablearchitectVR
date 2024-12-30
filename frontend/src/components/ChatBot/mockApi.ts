const MOCK_RESPONSES = [
  "I understand your question. Let me help you with that.",
  "That's an interesting point. Here's what I think...",
  "Based on my analysis, I would recommend...",
  "I can help you with that. Here's what you need to know...",
  "Let me provide some more information about that.",
];

export const getMockResponse = async (message: string): Promise<string> => {
  // Simulate API processing time (1-3 seconds)
  const delay = Math.random() * 2000 + 1000;
  await new Promise(resolve => setTimeout(resolve, delay));
  
  // Return a random response
  return MOCK_RESPONSES[Math.floor(Math.random() * MOCK_RESPONSES.length)];
};