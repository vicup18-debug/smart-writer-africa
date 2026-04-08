import { NextResponse } from 'next/server';
import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);

export async function POST(req: Request) {
  try {
    const { topic, faculty, standard, fullThesis, outline } = await req.json();

    // Determine the scope: 1 chapter for Sample, 5 for Full [cite: 19]
    const scope = fullThesis ? "Chapters 1 to 5" : "Chapter 1 (Introduction) ONLY";

    // Construct formatting rules based on the school 
    const formattingRules = `
      Follow ${standard} academic formatting. 
      Use Times New Roman style structure. 
      Ensure citations follow APA 7th edition (standard for Nigerian universities). 
      Check all facts against real-world data to avoid hallucinations. [cite: 11]
    `;

    const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

    const prompt = `
      You are an Autonomous Academic Architect. Generate a ${scope} for a project titled: "${topic}".
      Faculty: ${faculty}.
      University Guide: ${standard}.
      ${formattingRules}
      
      Structure:
      ${JSON.stringify(outline)}

      IMPORTANT: If this is a sample, provide an incredibly high-quality Chapter 1 to encourage an upgrade. [cite: 30]
    `;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();

    return NextResponse.json({ fullText: text });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Failed to generate content" }, { status: 500 });
  }
}