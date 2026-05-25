const express = require("express")

const app = express()

app.use(express.json())

const GEMINI_API_KEY = process.env.GEMINI_API_KEY

app.post("/chat", async (req, res) => {

    const message = req.body.message

    if (!message) {
        return res.status(400).json({
            error: "No message"
        })
    }

    try {

        const response = await fetch(
            `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${GEMINI_API_KEY}`,
            {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    contents: [
                        {
                            parts: [
                                {
                                    text:
`Sos una IA dentro de Roblox.
Respondé corto.
Amigable.
Siempre en español.

Jugador: ${message}`
                                }
                            ]
                        }
                    ]
                })
            }
        )

        const data = await response.json()

        const reply =
            data.candidates?.[0]?.content?.parts?.[0]?.text
            || "No pude responder."

        res.json({
            reply: reply
        })

    } catch (err) {

        console.log(err)

        res.status(500).json({
            error: "Error"
        })
    }
})

app.listen(3000, () => {
    console.log("Servidor iniciado")
})