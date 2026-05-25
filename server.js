const express = require("express");
const app = express();
app.use(express.json());

// FIX: fetch compatible en cualquier Node
const fetch = (...args) =>
  import("node-fetch").then(({ default: fetch }) => fetch(...args));

const CLAUDE_API_KEY = process.env.CLAUDE_API_KEY;

app.post("/chat", async (req, res) => {
    const { message, history } = req.body;

    if (!message) {
        return res.status(400).json({ error: "No message provided" });
    }

    const messages = Array.isArray(history) ? [...history] : [];
    messages.push({ role: "user", content: message });

    try {
        const response = await fetch("https://api.anthropic.com/v1/messages", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "x-api-key": CLAUDE_API_KEY,
                "anthropic-version": "2023-06-01"
            },
            body: JSON.stringify({
                model: "claude-sonnet-4-20250514",
                max_tokens: 300,
                system: "Sos una IA dentro de Roblox. Respondé corto, amigable y en español. Nunca rompas el personaje.",
                messages: messages
            })
        });

        const data = await response.json();

        const reply =
            data?.content?.[0]?.text ||
            "No pude responder.";

        const updatedHistory = [
            ...messages,
            { role: "assistant", content: reply }
        ].slice(-10);

        return res.json({
            reply,
            messages: updatedHistory
        });

    } catch (err) {
        console.log(err);
        return res.status(500).json({ error: "Error contactando Claude" });
    }
});

app.listen(3000, () => console.log("Proxy corriendo en puerto 3000"));
