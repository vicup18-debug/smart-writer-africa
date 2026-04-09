import { NextResponse } from 'next/server';
import { GoogleGenerativeAI } from "@google/generative-ai";

const sleep = (ms: number) => new Promise((res) => setTimeout(res, ms));
// Add this near the top of your files!
export const maxDuration = 60;

export async function POST(req: Request) {
  console.log("--- AI Report Generation Started ---");

  // 1. Safe API Key Check
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    console.error("ERROR: GEMINI_API_KEY is missing from .env.local");
    return NextResponse.json({ error: "API Key Missing" }, { status: 500 });
  }

  try {
    const { topic, faculty, standard, fullThesis, outline } = await req.json();

    // 2. Determine the scope: 1 chapter for Sample, 5 for Full
    const scope = fullThesis ? "Chapters 1 to 5" : "Chapter 1 (Introduction) ONLY";

    // 3. Construct formatting rules based on the school 
    const formattingRules = `
          Follow ${standard} academic formatting. 
          Use Times New Roman style structure. 
          Ensure citations follow APA 7th edition (standard for Nigerian universities). 
          Check all facts against real-world data to avoid hallucinations.
        `;

    const genAI = new GoogleGenerativeAI(apiKey);
    // Swapped to 1.5-flash for maximum stability during Syndicate testing
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

    const prompt = `
          You are an Autonomous Academic Architect. Generate a ${scope} for a project titled: "${topic}".
          Faculty: ${faculty}.
          University Guide: ${standard}.
          ${formattingRules}
          
          Structure:
          ${JSON.stringify(outline)}

          IMPORTANT: If this is a sample, provide an incredibly high-quality Chapter 1 to encourage an upgrade. 
        `;

    // --- THE ARCHITECT'S RETRY LOOP STARTS HERE ---
    let retries = 0;

    while (retries < 3) {
      try {
        console.log(`Generating manuscript... Attempt ${retries + 1}`);

        const result = await model.generateContent(prompt);
        const response = await result.response;
        const text = response.text();

        console.log("Success: Manuscript compiled and delivered.");

        // Return data (automatically breaks the loop)
        return NextResponse.json({ fullText: text });

      } catch (error: any) {
        // Check if the error is a Traffic Block (429) or Overload (503)
        if (error?.status === 429 || error?.status === 503) {
          retries++;
          console.warn(`[API OVERLOADED] Retrying attempt ${retries}...`);

          // Wait 2 seconds, then 4 seconds, then 8 seconds
          await sleep(Math.pow(2, retries) * 1000);
        } else {
          // Fatal error (bad prompt, blocked content, etc.)
          console.error("Fatal API Error during generation:", error);
          return NextResponse.json(
            { error: "System error occurred.", details: error.message },
            { status: 500 }
          );
        }
      }
    }

    // If loop finishes 3 retries and still fails
    console.error("Engine failed after 3 retries due to Google server traffic.");
    return NextResponse.json(
      { error: "The AI servers are currently at maximum capacity. Please try again in a moment." },
      { status: 503 }
    );

  } catch (error: any) {
    console.error("DETAILED SERVER ERROR:", error.message);
    return NextResponse.json({ error: "Failed to parse incoming request." }, { status: 500 });
  }
}