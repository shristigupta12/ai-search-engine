import { supabase } from "../../../../lib/supabaseClient";

export async function DELETE(request) {
    try {
        const { session_id } = await request.json();

        if (!session_id) {
            return new Response(JSON.stringify({ error: "Session ID is required" }), { status: 400 });
        }

        // First, delete all related chat messages
        const { error: messageDeleteError } = await supabase
            .from('chat_messages')
            .delete()
            .eq('session_id', session_id);

        if (messageDeleteError) {
            return new Response(JSON.stringify({ error: messageDeleteError.message }), { status: 500 });
        }

        // Then delete the session itself
        const { error: sessionDeleteError } = await supabase
            .from('chat_sessions')
            .delete()
            .eq('id', session_id);

        if (sessionDeleteError) {
            return new Response(JSON.stringify({ error: sessionDeleteError.message }), { status: 500 });
        }

        return new Response(JSON.stringify({ message: "Session deleted successfully" }), { status: 200 });

    } catch (error) {
        return new Response(JSON.stringify({ error: error.message }), { status: 500 });
    }
}
