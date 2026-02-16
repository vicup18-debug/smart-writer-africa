import { NextResponse } from 'next/server';
import { GoogleGenerativeAI } from "@google/generative-ai";

export async function POST(req: Request) {
    // 1. Log that the request was received
    console.log("--- AI Outline Request Started ---");

    try {
        // 2. Check if API Key exists
        const apiKey = process.env.GEMINI_API_KEY;
        if (!apiKey) {
            console.error("ERROR: GEMINI_API_KEY is missing from .env.local");
            return NextResponse.json({ error: "API Key Missing" }, { status: 500 });
        }

        const { topic, faculty, level } = await req.json();
        console.log(`Topic: ${topic} | Faculty: ${faculty}`);

        const genAI = new GoogleGenerativeAI(apiKey);
        const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

        // 3. Precise Prompt to ensure valid JSON
        const prompt = `You are a Senior Research Architect. 
    Create a professional 5-section report outline for a ${level} in the field of ${faculty}.
    Topic: ${topic}
    
    IMPORTANT: Return ONLY a raw JSON object. No markdown, no backticks, no preamble.
    Structure:
    {
      "sections": [
        {
          "title": "Section Title",
          "logic_note": "A strategy note on why this section is important",
          "technical_keywords": ["keyword1", "keyword2", "keyword3"]
        }
      ]
    }`;

        const result = await model.generateContent(prompt);
        const response = await result.response;
        let text = response.text();

        // 4. Log the raw AI response for debugging
        console.log("Raw AI Response received");

        // 5. Clean the JSON (Removes ```json ... ``` if the AI includes it)
        const cleanedJson = text.replace(/```json|```/g, "").trim();

        const parsedData = JSON.parse(cleanedJson);
        console.log("Success: JSON parsed correctly");

        return NextResponse.json(parsedData);

    } catch (error: any) {
        // 6. Detailed Error Logging
        console.error("DETAILED SERVER ERROR:", error.message);
        return NextResponse.json(
            { error: "Failed to generate outline", details: error.message },
            { status: 500 }
        );
    }
}