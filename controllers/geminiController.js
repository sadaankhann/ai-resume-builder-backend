import OpenAI from "openai";


const geminiController = async (req, res) => {

    const client = new OpenAI({
        apiKey: process.env.GROQ_API_KEY,
        baseURL: "https://api.groq.com/openai/v1",
    });

    const response = await client.responses.create({
        model: "openai/gpt-oss-20b",
        input: `Repharse and enhance this and and make a 60 words paragraph using it, Dont add other things just give me one signal response of it, Because what you will give to me I will straight going to give it to the user without doing anuthing on it : ${req.body.formData}`,
    });

    return res.status(200).json({
        success: true,
        response: response.output_text
    })

}

export default geminiController