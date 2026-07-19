import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI } from "@google/genai";
import dotenv from "dotenv";

dotenv.config();

const app = express();
const PORT = 3000;

app.use(express.json());

// Initialize Gemini Client
const apiKey = process.env.GEMINI_API_KEY;
let ai: GoogleGenAI | null = null;

if (apiKey) {
  ai = new GoogleGenAI({
    apiKey,
    httpOptions: {
      headers: {
        'User-Agent': 'aistudio-build',
      },
    },
  });
}

// Health Check
app.get("/api/health", (req, res) => {
  res.json({ status: "ok", geminiEnabled: !!ai });
});

// Gemini Advisor API
app.post("/api/gemini/advisor", async (req, res) => {
  try {
    const { message, history } = req.body;

    if (!message) {
      res.status(400).json({ error: "Message is required" });
      return;
    }

    if (!ai) {
      res.json({
        text: "The AI Constitutional Advisor is currently in offline demo mode. Please configure your GEMINI_API_KEY in Settings > Secrets to unlock live AI responses. (Demo Response: The 1987 Philippine Constitution is the supreme law of the land. Article II declares that the Philippines is a democratic and republican State where sovereignty resides in the people.)",
        isDemo: true
      });
      return;
    }

    // Prepare system instruction
    const systemInstruction = 
      "You are the SEPOLSCIS AI Constitutional & Political Science Advisor, an expert AI tutor specialized in Philippine Constitutional history, political science, and civic governance. " +
      "You have deep knowledge of the 1899 Malolos Constitution, 1935 Commonwealth, 1943 Japanese Occupation, 1973 Marcos Era, 1986 Freedom Constitution, and the 1987 Present Constitution, as well as general political science principles and local government policies. " +
      "Answer the student's questions with academic rigor, absolute accuracy, and educational clarity. Write in a helpful, friendly, and structured manner. Cite specific Articles or Sections where applicable. " +
      "Keep the explanation scannable using bolding, lists, and clear headers.";

    // Convert history format if present
    const contents = [];
    if (history && Array.isArray(history)) {
      for (const turn of history) {
        contents.push({
          role: turn.role,
          parts: [{ text: turn.text }]
        });
      }
    }
    contents.push({
      role: "user",
      parts: [{ text: message }]
    });

    const response = await ai.models.generateContent({
      model: "gemini-3.5-flash",
      contents,
      config: {
        systemInstruction,
        temperature: 0.7,
      },
    });

    res.json({ text: response.text });
  } catch (error: any) {
    console.error("Gemini Advisor Error:", error);
    res.status(500).json({ error: error.message || "Failed to generate AI response" });
  }
});

// Start Server & Vite Integration
async function startServer() {
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
