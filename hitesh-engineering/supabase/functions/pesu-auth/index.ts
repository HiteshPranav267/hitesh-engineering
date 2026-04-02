import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    const payload = await req.json();
    const action = payload.action || "login";
    const srn = payload.srn;

    if (!srn) {
      return new Response(
        JSON.stringify({ error: "Missing SRN credential" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Instantiate Supabase Admin connection using Service Role
    const supabaseUrl = Deno.env.get("SUPABASE_URL") ?? "";
    const supabaseKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? "";
    const supabase = createClient(supabaseUrl, supabaseKey);

    // --- INSTANT REVOCATION CHECK ---
    if (action === "check") {
      const { data: userRecord } = await supabase
        .from("notes_users")
        .select("is_blocked")
        .eq("srn", srn)
        .single();
        
      return new Response(
        JSON.stringify({ blocked: userRecord?.is_blocked ?? true }),
        { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // --- NEW LOGIN AUTHENTICATION ---
    const password = payload.password;
    if (!password) {
        return new Response(JSON.stringify({ error: "Missing password" }), { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } });
    }

    // Call PESU Auth API safely without browser block
    const authResponse = await fetch("https://pesu-auth.onrender.com/authenticate", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username: srn, password, profile: true }),
    });
    
    const data = await authResponse.json();
    
    if (!data.status || !data.profile) {
      return new Response(
        JSON.stringify({ error: data.message || "Invalid credentials." }),
        { status: 401, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const { name, program, branch } = data.profile;

    // Verify User Block List
    const { data: userRecord } = await supabase
      .from("notes_users")
      .select("is_blocked, login_count")
      .eq("srn", srn)
      .single();

    if (userRecord?.is_blocked) {
      return new Response(
        JSON.stringify({ error: "Your access has been blocked. Contact the administrator." }),
        { status: 403, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Upsert User Data
    if (userRecord) {
      await supabase.from("notes_users").update({
        name,
        last_login: new Date().toISOString(),
        login_count: (userRecord.login_count || 0) + 1,
        program,
        branch
      }).eq("srn", srn);
    } else {
      await supabase.from("notes_users").insert([{
        srn,
        name,
        program,
        branch,
        last_login: new Date().toISOString(),
        login_count: 1
      }]);
    }

    // All clear! Returns success payload.
    return new Response(
      JSON.stringify({ success: true, srn, name }),
      { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
    
  } catch (error: any) {
    return new Response(
      JSON.stringify({ error: error.message }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
