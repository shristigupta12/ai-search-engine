import { getSupabaseUser } from "@/lib/getSupabaseUser";
import { supabase } from "../../../../lib/supabaseClient";

export async function POST(request) {
    const user = await getSupabaseUser();
    if (!user) return new Response(JSON.stringify({ error: "Unauthorized" }), { status: 401 });
    try{
        const {session_id, title, text_prompt} = await request.json();

        const {data: sessionData, error: sessionError} = await supabase
        .from('chat_sessions')
        .insert({
            id: session_id, 
            title: title,
            initial_prompt: text_prompt,
            user_id: user.id
        })
        .select();

        if(sessionError) return new Response(JSON.stringify({error: sessionError.message}), {status: 500});

        const {data: chatData, error: chatError} = await supabase
        .from('chat_messages')
        .insert({
            session_id: session_id,
            content: text_prompt,
            role: 'user',
            user_id: user.id
        })
        .select();

        if(chatError) return new Response(JSON.stringify({error: chatError.message}), {status: 500});

        return new Response(JSON.stringify({
            session: sessionData[0],
            chat: chatData[0]
        }), {status: 200});
        } catch (error) {
            return new Response(JSON.stringify({error: error.message}), {status: 500});
        }
}