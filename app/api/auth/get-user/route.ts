import { getSupabaseUser } from "@/lib/getSupabaseUser";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    console.log("Fetching user from Supabase...");
    const user = await getSupabaseUser();
    console.log("User from Supabase:", user);
    return NextResponse.json({ user });
  } catch (error) {
    console.error("Error fetching user:", error);
    return NextResponse.json({ error: "Failed to get user" }, { status: 500 });
  }
} 