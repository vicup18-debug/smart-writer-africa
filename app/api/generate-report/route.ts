import { NextResponse } from 'next/server';
import { GoogleGenerativeAI } from "@google/generative-ai";

export async function POST(req: Request) {
    try {
        const { outline, topic, faculty } = await req.json();
        const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);
        const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

        // We send the entire outline so the AI maintains context between sections
        const prompt = `You are an Academic Writer. Use the following outline to write a comprehensive, 2,000-word academic report on "${topic}" for the ${faculty} department.
    
    OUTLINE: ${JSON.stringify(outline)}
    
    INSTRUCTIONS:
    1. Write in a formal, third-person academic tone.
    2. Use LaTeX for any mathematical formulas.
    3. Ensure smooth transitions between sections.
    4. Provide the full text in professional Markdown format.`;

        const result = await model.generateContent(prompt);
        const response = await result.response;
        return NextResponse.json({ fullText: response.text() });
    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}