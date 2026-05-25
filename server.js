// server.js
const express = require("express");
const app = express();
app.use(express.json());

const CLAUDE_API_KEY = process.env.CLAUDE_API_KEY; // Variable de entorno, nunca hardcodeada

app.post("/chat", async (req, res) => {
    const { message, history } = req.body;

    if (!message) return res.status(400).json({ error: "No message provided" });

    // Construir historial de mensajes
    const messages = history || [];
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
                system: "Sos un asistente dentro de un juego de Roblox. Respondé siempre en español, de forma corta y amigable. Nunca rompas el personaje.",
                messages: messages
            })
        });

        const data = await response.json();
        const reply = data.content[0].text;

        res.json({ reply, messages: [...messages, { role: "assistant", content: reply }] });

    } catch (err) {
        res.status(500).json({ error: "Error contactando Claude" });
    }
});

app.listen(3000, () => console.log("Proxy corriendo en puerto 3000"));
