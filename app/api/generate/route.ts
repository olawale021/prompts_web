import { NextRequest, NextResponse } from 'next/server';
import { prompts } from '@/lib/prompts';

export async function POST(request: NextRequest) {
  try {
    const { promptId, inputs } = await request.json();

    // Validate prompt exists
    const promptConfig = prompts[promptId];
    if (!promptConfig) {
      return NextResponse.json({ error: 'Invalid prompt' }, { status: 400 });
    }

    // Build context from inputs
    const inputContext = Object.entries(inputs)
      .map(([key, value]) => {
        const inputConfig = promptConfig.inputs.find(i => i.id === key);
        return inputConfig ? `${inputConfig.label}: ${value}` : '';
      })
      .filter(Boolean)
      .join('\n');

    // Build full prompt - generate all 3 tones at once
    const fullPrompt = `${inputContext}

${promptConfig.template}

Generate this content in 3 different tones. Format your response EXACTLY like this:

===NEUTRAL===
[Content in a balanced, professional tone]

===FUN===
[Content in a playful, energetic, friendly tone with personality]

===SERIOUS===
[Content in a professional, authoritative, direct tone]`;

    // Call OpenAI
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`,
      },
      body: JSON.stringify({
        model: 'gpt-4o-mini',
        messages: [
          {
            role: 'system',
            content: `You are an Instagram growth expert who has helped 500+ creators grow from 0 to 100k followers.

RULES:
- Be specific and actionable, never vague or generic
- Use real examples and exact wording they can copy-paste
- No fluff, no filler, no "here's why this matters" explanations
- Skip intros like "Sure!" or "Here are..." - just give the content directly
- Every suggestion must be something they can post TODAY
- Write like you're texting a friend, not writing an essay
- If giving multiple options, make each one distinctly different
- Include specific numbers, formats, or structures when relevant
- CRITICAL: If the request asks for a specific number (e.g., "10 ideas", "5 captions"), you MUST provide EXACTLY that number for EACH tone. Never give fewer.
- Always follow the exact format requested with ===NEUTRAL===, ===FUN===, ===SERIOUS=== headers`,
          },
          {
            role: 'user',
            content: fullPrompt,
          },
        ],
        temperature: 0.8,
        max_tokens: 6000,
      }),
    });

    if (!response.ok) {
      const error = await response.json();
      console.error('OpenAI error:', error);
      return NextResponse.json({ error: 'Failed to generate content' }, { status: 500 });
    }

    const data = await response.json();
    const generatedText = data.choices[0]?.message?.content || '';

    // Parse the 3 tones from the response
    const neutralMatch = generatedText.match(/===NEUTRAL===\s*([\s\S]*?)(?====FUN===|$)/);
    const funMatch = generatedText.match(/===FUN===\s*([\s\S]*?)(?====SERIOUS===|$)/);
    const seriousMatch = generatedText.match(/===SERIOUS===\s*([\s\S]*?)$/);

    const results = {
      neutral: neutralMatch ? neutralMatch[1].trim() : generatedText,
      fun: funMatch ? funMatch[1].trim() : generatedText,
      serious: seriousMatch ? seriousMatch[1].trim() : generatedText,
    };

    return NextResponse.json({ results });
  } catch (error) {
    console.error('API error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
