export async function onRequestGet(context) {
  const { env } = context;

  // 1. 取得環境變數 (必須與 Cloudflare Settings 一致)
  const supabaseUrl = env.SUPABASE_URL;
  const supabaseKey = env.SUPABASE_SERVICE_ROLE_KEY;

  // 2. 檢查變數是否存在 (預防 500 錯誤)
  if (!supabaseUrl || !supabaseKey) {
    return new Response(
      JSON.stringify({ error: "Missing environment variables." }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  }

  try {
    // 3. 呼叫 Supabase REST API (查詢 games 資料表)
    // 這裡使用 select=* 並依 sort_order 排序
    const response = await fetch(`${supabaseUrl}/rest/v1/games?select=*&order=sort_order.asc`, {
      method: "GET",
      headers: {
        "apikey": supabaseKey,
        "Authorization": `Bearer ${supabaseKey}`,
        "Content-Type": "application/json"
      }
    });

    if (!response.ok) {
      const errorData = await response.text();
      return new Response(
        JSON.stringify({ error: "Database error", details: errorData }),
        { status: response.status, headers: { "Content-Type": "application/json" } }
      );
    }

    const data = await response.json();

    // 4. 回傳資料給前端
    return new Response(JSON.stringify(data), {
      headers: { 
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": "*" 
      }
    });

  } catch (err) {
    return new Response(
      JSON.stringify({ error: "Server crash", message: err.message }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  }
}
