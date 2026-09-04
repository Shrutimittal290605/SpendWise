import axios from "axios";
import Transaction from "../models/TransactionModel.js";
import User from "../models/UserSchema.js";

export const getInsightsController = async (req, res) => {
  try {
    const { userId, question } = req.body;

    if (!userId) {
      return res.status(400).json({ success: false, message: "userId is required" });
    }

    const user = await User.findById(userId);
    if (!user) {
      return res.status(400).json({ success: false, message: "User not found" });
    }

    const transactions = await Transaction.find({ user: userId })
      .sort({ date: -1 })
      .limit(100);

    if (!transactions.length) {
      return res.status(200).json({
        success: true,
        answer: "You don't have any transactions yet — add a few to get AI insights!",
      });
    }

    const transactionText = transactions
      .map(
        (t) =>
          `${new Date(t.date).toISOString().split("T")[0]} | ${t.transactionType} | ${t.category} | ₹${t.amount}`
      )
      .join("\n");

    const prompt = question
      ? `You are a helpful financial assistant. Here is the user's transaction data:\n${transactionText}\n\nAnswer this question concisely and helpfully: "${question}"`
      : `You are a helpful financial assistant. Here is the user's transaction data:\n${transactionText}\n\nGive a short, friendly summary (3-4 sentences) of their spending patterns, any notable trends, and one practical money-saving tip.`;

    const geminiRes = await axios.post(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-3.6-flash:generateContent?key=${process.env.GEMINI_API_KEY}`,
      { contents: [{ parts: [{ text: prompt }] }] }
    );

    const answer =
      geminiRes.data?.candidates?.[0]?.content?.parts?.[0]?.text ||
      "Sorry, I couldn't generate insights right now.";

    return res.status(200).json({ success: true, answer });
  } catch (err) {
    console.error("Insights error:", err.response?.data || err.message);
    return res.status(500).json({
      success: false,
      answer: "Something went wrong while generating insights.",
    });
  }
};