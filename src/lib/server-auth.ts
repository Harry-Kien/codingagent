import type { User } from "@supabase/supabase-js";
import { getSupabaseAdminClient } from "@/lib/supabase-server";

export async function getRequestUser(request: Request): Promise<User | null> {
  const token = bearerToken(request);
  const client = getSupabaseAdminClient();
  if (!token || !client) return null;

  const { data, error } = await client.auth.getUser(token);
  if (error) return null;
  return data.user ?? null;
}

function bearerToken(request: Request) {
  const value = request.headers.get("authorization");
  if (!value?.toLowerCase().startsWith("bearer ")) return "";
  return value.slice("bearer ".length).trim();
}
