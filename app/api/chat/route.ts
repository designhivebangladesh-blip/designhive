import { NextResponse } from "next/server";

const DESIGN_HIVE_CONTEXT = `
Design Hive is a digital agency specializing in:
- Web Development: Building responsive and high-performance websites.
- Website Creation: End-to-end website design and development.
- Web Design: UI/UX design, wireframing, and prototyping.
- Graphics Design: Logo design, branding, and marketing materials.
- Digital Services: SEO, digital marketing, and content strategy.

Location: Bangladesh (Dhaka).
Contact: info@designhivebangladesh.com
`;

export async function POST(req: Request) {
  try {
    const { message } = await req.json();

    if (!message) {
      return NextResponse.json({ error: "Message is required" }, { status: 400 });
    }

    const lowerMessage = message.toLowerCase();
    let reply = "";

    // Simple keyword-based logic for the prototype
    if (lowerMessage.includes("hello") || lowerMessage.includes("hi")) {
      reply = "Hello! I'm the Design Hive AI assistant. How can I help you today?";
    } else if (lowerMessage.includes("service") || lowerMessage.includes("what do you do")) {
      reply = "We offer a range of digital services including Web Development, Web Design, Graphics Design, and SEO. Which one are you interested in?";
    } else if (lowerMessage.includes("web development") || lowerMessage.includes("website")) {
      reply = "Our web development team crafts high-performance, responsive websites using the latest technologies like Next.js and React. Would you like to see our portfolio or get a quote?";
    } else if (lowerMessage.includes("design") || lowerMessage.includes("graphics")) {
      reply = "We provide professional UI/UX design and graphics design services, including branding and logo creation. Our designs are tailored to elevate your brand.";
    } else if (lowerMessage.includes("contact") || lowerMessage.includes("email") || lowerMessage.includes("phone")) {
      reply = "You can reach us at info@designhivebangladesh.com or visit our contact section on the website to send a message.";
    } else if (lowerMessage.includes("price") || lowerMessage.includes("cost") || lowerMessage.includes("how much")) {
      reply = "Our pricing depends on the project scope. You can check our 'Pricing' section or request a custom quote via the 'Get Quote' button!";
    } else if (lowerMessage.includes("location") || lowerMessage.includes("where")) {
      reply = "Design Hive is based in Dhaka, Bangladesh, but we serve clients globally!";
    } else {
      reply = `That's a great question! Design Hive is a premier digital agency specializing in Web Development, Design, and other digital services. \n\nHere is a bit more about what we do: ${DESIGN_HIVE_CONTEXT}`;
    }

    /* 
    NOTE: To integrate a real AI (like Gemini or OpenAI), you would:
    1. Install the SDK (e.g., @google/generative-ai).
    2. Use your API key from process.env.
    3. Pass DESIGN_HIVE_CONTEXT as a system prompt.
    4. Return the AI-generated response.
    */

    // Simulate a small delay for "AI thinking" feel
    await new Promise((resolve) => setTimeout(resolve, 1000));

    return NextResponse.json({ reply });
  } catch (error) {
    console.error("Chat API error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
