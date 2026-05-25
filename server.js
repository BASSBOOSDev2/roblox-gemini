const express = require("express")

const app = express()

app.use(express.json())

const GEMINI_API_KEY = process.env.GEMINI_API_KEY

app.get("/", (req, res) => {
    res.send("Servidor funcionando")
})

app.post("/chat", async (req, res) => {

    const message = req.body.message

    if (!message) {
        return res.status(400).json({
            error: "No message"
        })
    }

    try {

        const response = await fetch(
            "https://openrouter.ai/api/v1/chat/completions",
            {
                method: "POST",
                headers: {
                    "Authorization": `Bearer ${GEMINI_API_KEY}`,
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    model: "deepseek/deepseek-chat-v3-0324:free",
                    messages: [
                        {
                            role: "system",
                            content: "Sos una IA dentro de Roblox. Respondé corto, amigable y siempre en español."
                        },
                        {
                            role: "user",
                            content: message
                        }
                    ]
                })
            }
        )

        const data = await response.json()

        console.log(data)

        const reply =
            data.choices?.[0]?.message?.content
            || "No pude responder."

        res.json({
            reply: reply
        })

    } catch (err) {

        console.log(err)

        res.status(500).json({
            error: "Error conectando OpenRouter"
        })
    }
})

const PORT = process.env.PORT || 3000

app.listen(PORT, () => {
    console.log("Servidor iniciado en puerto " + PORT)
})
