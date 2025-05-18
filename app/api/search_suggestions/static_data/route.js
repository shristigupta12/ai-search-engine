import { supabase } from "../../../../lib/supabaseClient";

export async function GET(request) {
    const { searchParams } = new URL(request.url);
    const query = searchParams.get("query") || "";
    if (!query) return new Response(JSON.stringify([]), {status: 200});

    const {data, error} = await supabase 
    .from('search_items')
    .select('title')
    .ilike('title', `%${query}%`)
    .limit(5);

    if(error) return new Response(JSON.stringify({error: error.message}), {status: 500});
    return new Response(JSON.stringify(data), {status: 200});
}