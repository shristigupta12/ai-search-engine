import { supabase } from "../../../../lib/supabaseClient";

export async function GET(request) {
    const {data, error} = await supabase
    .from('chat_sessions')
    .select('*')
    .order('created_at', {descending: true});

    if(error) return new Response(JSON.stringify({error: error.message}), {status: 500});

    return new Response(JSON.stringify({data}), {status: 200});
}