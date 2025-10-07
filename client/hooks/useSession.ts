import { useState, useEffect } from "react";

const generateId = () => {
  return Math.random().toString(36).substring(2, 10);
};

export const useSession = () => {
  const [sessionId, setSessionId] = useState<string | null>(null);

  useEffect(() => {
    let storedId = localStorage.getItem("user_session_id");
    if (!storedId) {
      storedId = generateId();
      localStorage.setItem("user_session_id", storedId);
    }
    setSessionId(storedId);
  }, []);

  return sessionId;
};
