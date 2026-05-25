const express = require("express")

const app = express()

app.use(express.json())

app.get("/", (req, res) => {
    res.send("Servidor funcionando")
})

const GEMINI_API_KEY = process.env.GEMINI_API_KEY

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

        console.log(data)

        const reply =
            data.candidates?.[0]?.content?.parts?.[0]?.text
            || "No pude responder."

        res.json({
            reply: reply
        })

    } catch (err) {

        console.log(err)

        res.status(500).json({
            error: "Error conectando Gemini"
        })
    }
})

app.get("/", (req, res) => {
    res.send("Servidor funcionando")
})

const PORT = process.env.PORT || 3000

app.listen(PORT, () => {
    console.log("Servidor iniciado en puerto " + PORT)
})
