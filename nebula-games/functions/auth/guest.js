export async function onRequest() {
    const guest = {
        id: `guest_${Math.random().toString(36).substr(2, 9)}`,
        display_name: "訪客玩家",
        is_guest: true
    };
    return new Response(JSON.stringify(guest), { headers: { "Content-Type": "application/json" } });
}
