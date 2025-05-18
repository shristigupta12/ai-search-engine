import { supabase } from "../../../../lib/supabaseClient";

export async function GET(request) {
    const {searchParams} = new URL(request.url);
    const session_id = searchParams.get('session_id');

    const {data, error} = await supabase
    .from('chat_messages')
    .select('*')
    .eq('session_id', session_id)
    .order('created_at', {ascending: true});

    if(error) return new Response(JSON.stringify({error: error.message}), {status: 500});

    return new Response(JSON.stringify({data}), {status: 200});
}