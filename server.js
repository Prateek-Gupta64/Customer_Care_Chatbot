import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

dotenv.config();
const __dirname = path.dirname(fileURLToPath(import.meta.url));
const KEY = process.env.GEMINI_API_KEY;
const MODEL = process.env.GEMINI_MODEL || "gemini-2.5-flash";
const PORT = process.env.PORT || 3000;
if (!KEY) { console.error("Missing GEMINI_API_KEY in .env"); process.exit(1); }

// Load every .md/.txt file from /knowledge once at startup
const kDir = path.join(__dirname, "..", "knowledge");
const knowledge = fs.readdirSync(kDir)
  .filter(f => /\.(md|txt)$/i.test(f))
  .map(f => `### ${f}\n${fs.readFileSync(path.join(kDir, f), "utf8")}`)
  .join("\n\n");

const SYSTEM = `You are the customer care assistant for the company described in the knowledge base below.
   Rules:
   - Answer using the knowledge base. Never invent policies, prices, vouchers, order statuses or phone numbers.
   - Be friendly and conversational. If the question is unclear, ask one short follow-up question instead of redirecting.
   - Give the answer first. Mention the support email/phone only when you truly cannot help, and only once per conversation.
   - Write in plain text without markdown, bold, asterisks or bullet symbols.
   - Reply in the same language the customer uses (English, Hindi or Hinglish).
   - Never ask for passwords, OTPs or full card numbers.

KNOWLEDGE BASE:
${knowledge}`;

const app = express();
app.use(cors());              // lets the HTML file (opened from disk) call this server
app.use(express.json({ limit: "50kb" }));

// Simple rate limit: 20 requests / minute / IP
const hits = new Map();
app.use("/chat", (req, res, next) => {
  const now = Date.now(), ip = req.ip;
  const recent = (hits.get(ip) || []).filter(t => now - t < 60000);
  if (recent.length >= 20) return res.status(429).json({ error: "Too many messages. Please wait a minute." });
  recent.push(now); hits.set(ip, recent); next();
});

app.get("/health", (_, res) => res.json({ ok: true }));

app.post("/chat", async (req, res) => {
  try {
    const msgs = (req.body.messages || []).slice(-20).map(m => ({
      role: m.role === "model" ? "model" : "user",
      parts: [{ text: String(m.text || "").slice(0, 2000) }]
    }));
    if (!msgs.length || msgs[msgs.length - 1].role !== "user")
      return res.status(400).json({ error: "Last message must be from the user." });

    const r = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/${MODEL}:generateContent`, {
      method: "POST",
      headers: { "Content-Type": "application/json", "x-goog-api-key": KEY },
      body: JSON.stringify({ system_instruction: { parts: [{ text: SYSTEM }] }, contents: msgs })
    });
    const data = await r.json();
    if (!r.ok) { console.error(data); return res.status(502).json({ error: "AI service error." }); }
    const reply = data.candidates?.[0]?.content?.parts?.map(p => p.text || "").join("") || "Sorry, I couldn't answer that.";
    res.json({ reply });
  } catch (e) {
    console.error(e); res.status(500).json({ error: "Server error." });
  }
});

app.listen(PORT, () => console.log(`Chatbot backend running on http://localhost:${PORT}`));
