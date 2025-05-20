import { getSupabaseUser } from '@/lib/getSupabaseUser';
import { supabase } from "../../../../lib/supabaseClient";

export async function GET(request) {
    const user = await getSupabaseUser();
    if (!user) return new Response(JSON.stringify({ error: "Unauthorized" }), { status: 401 });

    const { searchParams } = new URL(request.url);
    const session_id = searchParams.get('session_id');

    // Optional: Check session ownership
    const { data: session } = await supabase
        .from('chat_sessions')
        .select('id')
        .eq('id', session_id)
        .eq('user_id', user.id);

    if (!session || session.length === 0) {
        return new Response(JSON.stringify({ error: "Session not found or not yours" }), { status: 403 });
    }

    const { data, error } = await supabase
        .from('chat_messages')
        .select('*')
        .eq('session_id', session_id)
        .order('created_at', { ascending: true });

    if (error) return new Response(JSON.stringify({ error: error.message }), { status: 500 });

    return new Response(JSON.stringify({ data }), { status: 200 });
}
