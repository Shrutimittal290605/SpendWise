import React, { useState } from "react";
import axios from "axios";
import { getInsights } from "../utils/ApiRequest";

const AIChat = ({ user }) => {
  const [question, setQuestion] = useState("");
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);

  const askAI = async (q) => {
    if (!q.trim() || !user?._id) return;
    setMessages((prev) => [...prev, { role: "user", text: q }]);
    setQuestion("");
    setLoading(true);
    try {
      const { data } = await axios.post(getInsights, { userId: user._id, question: q });
      setMessages((prev) => [...prev, { role: "ai", text: data.answer }]);
    } catch (err) {
      setMessages((prev) => [...prev, { role: "ai", text: "Something went wrong. Try again." }]);
    }
    setLoading(false);
  };

  return (
    <div
      className="rounded-4 p-3 p-md-4 mb-4"
      style={{ background: "rgba(255,255,255,0.035)", border: "1px solid rgba(255,255,255,0.07)" }}
    >
      <h4 className="fw-bold mb-1 text-white">💬 Ask SpendWise AI</h4>
      <p className="text-light opacity-50 mb-3 small">Ask about your spending or get a quick summary.</p>

      <div style={{ maxHeight: 250, overflowY: "auto", marginBottom: 12, display: "flex", flexDirection: "column", gap: 8 }}>
        {messages.map((m, i) => (
          <div
            key={i}
            style={{
              alignSelf: m.role === "user" ? "flex-end" : "flex-start",
              background: m.role === "user" ? "rgba(124,92,255,0.25)" : "rgba(255,255,255,0.08)",
              color: "#fff",
              padding: "8px 12px",
              borderRadius: 10,
              maxWidth: "80%",
            }}
          >
            {m.text}
          </div>
        ))}
        {loading && <div className="text-light opacity-50">Thinking...</div>}
      </div>

      <div className="d-flex gap-2 mb-2">
        <button
          className="btn btn-outline-light rounded-3 btn-sm"
          onClick={() => askAI("Give me a summary of my spending")}
        >
          Get Summary
        </button>
      </div>

      <div className="d-flex gap-2">
        <input
          className="form-control"
          style={{ background: "#171b2c", color: "#fff", border: "1px solid rgba(255,255,255,0.1)" }}
          value={question}
          onChange={(e) => setQuestion(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && askAI(question)}
          placeholder="e.g. How much did I spend on Food this month?"
        />
        <button
          className="border-0 rounded-3 px-4 btn"
          style={{ background: "linear-gradient(90deg, #7c5cff, #4da5ff)", color: "#fff" }}
          onClick={() => askAI(question)}
        >
          Send
        </button>
      </div>
    </div>
  );
};

export default AIChat;