import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });

  try {
    const { topic } = await req.json();
    if (!topic) {
      return new Response(JSON.stringify({ error: "Topic is required" }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    if (!LOVABLE_API_KEY) throw new Error("LOVABLE_API_KEY is not configured");

    const response = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${LOVABLE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-3-flash-preview",
        messages: [
          {
            role: "system",
            content: `You are an encyclopedia article generator. Given a topic, generate a comprehensive, well-structured encyclopedia article. Return a JSON object with the following structure. Do NOT wrap in markdown code blocks.

{
  "title": "The proper title for the article",
  "summary": "A 2-3 sentence overview of the topic",
  "sections": [
    { "heading": "Section Title", "content": "Detailed content for this section, multiple paragraphs allowed" }
  ]
}

Generate 4-6 sections with detailed, factual content. Write in an encyclopedic, neutral tone similar to Wikipedia. Include historical context, key facts, and current relevance.`,
          },
          { role: "user", content: `Write an encyclopedia article about: ${topic}` },
        ],
        tools: [
          {
            type: "function",
            function: {
              name: "generate_article",
              description: "Generate a structured encyclopedia article",
              parameters: {
                type: "object",
                properties: {
                  title: { type: "string" },
                  summary: { type: "string" },
                  sections: {
                    type: "array",
                    items: {
                      type: "object",
                      properties: {
                        heading: { type: "string" },
                        content: { type: "string" },
                      },
                      required: ["heading", "content"],
                    },
                  },
                },
                required: ["title", "summary", "sections"],
              },
            },
          },
        ],
        tool_choice: { type: "function", function: { name: "generate_article" } },
      }),
    });

    if (!response.ok) {
      if (response.status === 429) {
        return new Response(JSON.stringify({ error: "Rate limits exceeded, please try again later." }), {
          status: 429, headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      if (response.status === 402) {
        return new Response(JSON.stringify({ error: "Payment required, please add funds." }), {
          status: 402, headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      const t = await response.text();
      console.error("AI gateway error:", response.status, t);
      return new Response(JSON.stringify({ error: "Failed to generate article" }), {
        status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const data = await response.json();
    const toolCall = data.choices?.[0]?.message?.tool_calls?.[0];
    
    let article;
    if (toolCall?.function?.arguments) {
      article = typeof toolCall.function.arguments === "string"
        ? JSON.parse(toolCall.function.arguments)
        : toolCall.function.arguments;
    } else {
      // Fallback: try parsing content directly
      const content = data.choices?.[0]?.message?.content || "";
      article = JSON.parse(content);
    }

    return new Response(JSON.stringify(article), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (e) {
    console.error("generate-article error:", e);
    return new Response(JSON.stringify({ error: e instanceof Error ? e.message : "Unknown error" }), {
      status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
