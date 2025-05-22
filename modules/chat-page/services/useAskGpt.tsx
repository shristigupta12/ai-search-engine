// import { useMutation } from "@tanstack/react-query"

// type AskInput = { userInput: string }

// export const useAskGpt = () => {
//     return useMutation({
//         mutationFn: async ({ userInput }: AskInput): Promise<string> => {
//             const res = await fetch('/api/chat/ask_gpt', {
//                 method: 'POST',
//                 headers: {
//                     'Content-Type': 'application/json'
//                 },
//                 body: JSON.stringify({userInput})
//             })
//             const data = await res.json();
//             return data.answer;
//         }
//     })
// }

export async function fetchStreamedAIResponse(
    userInput: string,
    onData: (chunk: string) => void,
    onDone: () => void
  ) {
    const response = await fetch('/api/chat/ask_gpt', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ userInput }),
    });
  
    if (!response.body) throw new Error('No response body');
  
    const reader = response.body.getReader();
    const decoder = new TextDecoder('utf-8');
    let done = false;
  
    while (!done) {
      const { value, done: doneReading } = await reader.read();
      done = doneReading;
      if (value) {
        const chunk = decoder.decode(value);
        chunk.split('\n').forEach(line => {
          if (line.startsWith('data: ')) {
            const data = line.replace('data: ', '').trim();
            if (data === '[DONE]') {
              onDone(); // <-- Call when stream is done
              return;
            }
            try {
              const json = JSON.parse(data);
              const content = json.choices?.[0]?.delta?.content;
              if (content) onData(content);
            } catch (e) {
              // ignore non-JSON lines
            }
          }
        });
      }
    }
    // Fallback: call onDone in case [DONE] is not received
    onDone();
  }