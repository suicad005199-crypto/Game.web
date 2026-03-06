export async function onRequest(context) {
    // 產生隨機訪客 ID
    const guestId = `guest_${Math.random().toString(36).substr(2, 9)}`;

    return new Response(JSON.stringify({
        success: true,
        user: {
            line_uid: guestId,
            display_name: "訪客玩家",
            is_guest: true
        },
        token: "guest_session_active"
    }), { 
        headers: { 
            "Content-Type": "application/json;charset=UTF-8",
            "Access-Control-Allow-Origin": "*" 
        } 
    });
}
