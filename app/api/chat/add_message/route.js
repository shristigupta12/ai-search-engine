import { supabase } from '@/lib/supabaseClient';

export async function POST(request) {
  try {
    const { message, session_id, role } = await request.json();

    // Validate required fields
    if (!message || !session_id || !role) {
      return new Response(
        JSON.stringify({ error: 'message, session_id, and role are required' }),
        { status: 400 }
      );
    }

    // Insert into chat_messages
    const { data, error } = await supabase
      .from('chat_messages')
      .insert([{ 
        content: message,
        session_id: session_id,
        role: role
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
