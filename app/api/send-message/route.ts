// import { NextApiRequest, NextApiResponse } from 'next';

// type ApiResponse = {
//   response?: any;
//   error?: string;
// };

// export default async function handler(
//   req: NextApiRequest,
//   res: NextApiResponse<ApiResponse>
// ) {
//   const { message } = req.body;

//   if (typeof message !== 'string' || message.trim() === "") {
//     res.status(400).json({ error: "Invalid message" });
//     return;
//   }

//   try {
//     const response = await fetch('https://api.gemini.com/v1/models/gemini-1.5/generate', {
//       method: 'POST',
//       headers: {
//         'Content-Type': 'application/json',
//         'Authorization': `Bearer ${process.env.NEXT_PUBLIC_API_KEY}`, // Using the API key from the environment variable
//       },
//       body: JSON.stringify({ message }),
//     });

//     if (!response.ok) {
//         console.log(`Error: ${response.status} - ${response.statusText}`);
//       throw new Error('Failed to fetch data');
//     }

//     const data = await response.json();
//     res.status(200).json({ response: data });
//   } catch (error) {
//     res.status(500).json({ error: error instanceof Error ? error.message : 'Unknown error' });
//   }
// }


// ---------------------------------------------------------------------------------------


import { NextRequest, NextResponse } from "next/server";
import { GoogleGenerativeAI } from "@google/generative-ai";

export const runtime = "edge";

export async function POST(req: NextRequest) {
  try {
    const { message } = await req.json();
    if (typeof message !== "string" || message.trim() === "") {
      return NextResponse.json({ error: "Invalid message" }, { status: 400 });
    }

    const genAI = new GoogleGenerativeAI(process.env.NEXT_GEMINI_API_KEY!);
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

    const result = await model.generateContent(message);
    const response = result.response;
    const text = response.text();

    return NextResponse.json({ response: text }, { status: 200 });
  } catch (error) {
    console.error("Error in /api/send-message:", error);
    return NextResponse.json(
      {
        error:
          error instanceof Error ? error.message : "Unknown error occurred",
      },
      { status: 500 }
    );
  }
}