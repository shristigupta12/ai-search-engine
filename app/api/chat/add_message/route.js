import { getSupabaseUser } from '@/lib/getSupabaseUser';
import { supabase } from '@/lib/supabaseClient';

export async function POST(request) {
    const user = await getSupabaseUser();
    if (!user) return new Response(JSON.stringify({ error: "Unauthorized" }), { status: 401 });

    try {
        const { message, session_id, role } = await request.json();
        if (!message || !session_id || !role) {
            return new Response(JSON.stringify({ error: 'message, session_id, and role are required' }), { status: 400 });
        }

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
            .insert([{ 
                content: message,
                session_id,
                role,
                user_id: user.id
            }])
            .select();

        if (error) {
            return new Response(JSON.stringify({ error: error.message }), { status: 500 });
        }

        return new Response(JSON.stringify(data[0]), { status: 201 });

    } catch (err) {
        return new Response(JSON.stringify({ error: err.message }), { status: 500 });
    }
}
