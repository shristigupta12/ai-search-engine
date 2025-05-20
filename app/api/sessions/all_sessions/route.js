import { supabase } from "../../../../lib/supabaseClient";
import { getSupabaseUser } from "@/lib/getSupabaseUser";

export async function GET() {
    const user = await getSupabaseUser();
    if (!user) return new Response(JSON.stringify({ error: "Unauthorized" }), { status: 401 });

    const {data, error} = await supabase
    .from('chat_sessions')
    .select('*')
    .eq('user_id', user.id)
    .order('created_at', {descending: true});

    if(error) return new Response(JSON.stringify({error: error.message}), {status: 500});

    return new Response(JSON.stringify({data}), {status: 200});
}