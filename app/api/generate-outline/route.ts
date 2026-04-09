import { NextResponse } from 'next/server';
import { GoogleGenerativeAI } from "@google/generative-ai";

const sleep = (ms: number) => new Promise(res => setTimeout(res, ms));

// Add this near the top of your files!
export const maxDuration = 60;

export async function POST(req: Request) {
  console.log("--- AI Outline Request Started ---");

  // 1. Check if API Key exists (Moved outside the loop so it only checks once)
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    console.error("ERROR: GEMINI_API_KEY is missing from .env.local");
    return NextResponse.json({ error: "API Key Missing" }, { status: 500 });
  }

  const { topic, faculty, level } = await req.json();
  console.log(`Topic: ${topic} | Faculty: ${faculty}`);

  // Note: I left it as 2.5-flash based on your file, but remember to change 
  // to "gemini-1.5-flash" here if 2.5 is still heavily congested!
  const genAI = new GoogleGenerativeAI(apiKey);
  const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

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

  // --- THE ARCHITECT'S RETRY LOOP STARTS HERE ---
  let retries = 0;

  while (retries < 3) {
    try {
      // 2. Request Content
      const result = await model.generateContent(prompt);
      const response = await result.response;
      let text = response.text();

      console.log(`Raw AI Response received on attempt ${retries + 1}`);

      // 3. Clean the JSON
      const cleanedJson = text.replace(/```json|```/g, "").trim();
      const parsedData = JSON.parse(cleanedJson);

      console.log("Success: JSON parsed correctly");

      // 4. Return data (this automatically breaks the loop and succeeds)
      return NextResponse.json(parsedData);

    } catch (error: any) {
      // 5. Check if the error is a Traffic Block (429) or Overload (503)
      if (error?.status === 429 || error?.status === 503) {
        retries++;
        console.warn(`[API OVERLOADED] Retrying attempt ${retries}...`);

        // Wait 2 seconds, then 4 seconds, then 8 seconds
        await sleep(Math.pow(2, retries) * 1000);
      } else {
        // If it's a JSON parsing error or leaked key, crash normally
        console.error("DETAILED SERVER ERROR:", error.message);
        return NextResponse.json(
          { error: "Failed to generate outline", details: error.message },
          { status: 500 }
        );
      }
    }
  }

  // 6. If we loop 3 times and still fail, tell the frontend gracefully
  console.error("Engine failed after 3 retries due to Google server traffic.");
  return NextResponse.json(
    { error: "The AI servers are currently at maximum capacity. Please try again in a moment." },
    { status: 503 }
  );
}