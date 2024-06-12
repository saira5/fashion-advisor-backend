require('dotenv').config();

const express = require('express');
const cors = require('cors');
const { OpenAI } = require('openai');
const bodyParser = require('body-parser');

const app = express();
const PORT = process.env.PORT || 5000;
app.use(cors());
app.use(bodyParser.json());

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY 
});

app.post('/api/recommendations', async (req, res) => {
    const profile = req.body;
    try {
        const completion = await openai.completions.create
        ({
            model: "gpt-3.5-turbo",
            messages: [
                {
                  role: "system",
                  content: `You are a fashion advisor.`
                },
                {
                  role: "user",
                  content: `Based on the following profile, suggest an outfit: ${JSON.stringify(profile)}`
                }
              ],
            // prompt: `Based on the following profile, suggest an outfit:\n${JSON.stringify(profile)}`,
            max_tokens: 100,
        });
        res.json({ suggestions: completion.choices[0].text });
    } catch (error) {
        console.error(error);
        res.status(500).send('Error generating recommendations')

    }
});

app.listen(PORT, ()=>{
    console.log(`Server running on port ${PORT}`);
})
