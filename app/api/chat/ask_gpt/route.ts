import { NextResponse } from 'next/server'

export async function POST(request: Request) {
    const { userInput } = await request.json()

    try {
        const response = await fetch('https://api.openai.com/v1/chat/completions', {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${process.env.OPEN_AI_API_KEY}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                model: 'gpt-4o-mini',
                messages: [
                    {role: 'system', content: 'You are a helpful AI assistant.'},
                    {role: 'user', content: userInput}
                ],
                max_tokens: 300,
                stream: true
            })
        })

        // const data = await response.json();
        // return NextResponse.json({ answer: data.choices[0].message.content });
        return new NextResponse(response.body, {
            headers: {
                'Content-Type': 'text/event-stream',
                'Cache-Control': 'no-cache',
                'Connection': 'keep-alive'
            }
        })
    } catch (error) {
        return NextResponse.json({ error: 'Failed to fetch from OpenAI API', errorMessage: error }, { status: 500 });
    }
}