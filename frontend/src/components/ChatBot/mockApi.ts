import { BACKEND_URL } from "../../../config";
import { Message } from "./types";
import axios from "axios";

export const getMockResponse = async (message: string): Promise<Message> => {
  const msgs = [
    {
      role: "user",
      content: message,
    },
  ];

  const { data } = await axios.post(BACKEND_URL + "/chatbot/chat", {
    msgs,
  });

  const res = data.msgs[0];
  return {
    ...res,
    id: Math.random().toString(36).substring(7),
    timestamp: new Date(),
  };
};
