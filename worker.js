export default {
  async fetch(request, env) {
    // Handle CORS for preflight requests
    if (request.method === 'OPTIONS') {
      return new Response(null, {
        headers: {
          'Access-Control-Allow-Origin': '*',
          'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
          'Access-Control-Allow-Headers': 'Content-Type',
        }
      });
    }

    // Handle TikTok event tracking for POST requests
    if (request.method === 'POST') {
      try {
        const requestData = await request.json();
        
        // Send event to TikTok API
        const tiktokResponse = await fetch('https://business-api.tiktok.com/open_api/v1.3/event/track/', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Access-Token': env.TIKTOK_ACCESS_TOKEN
          },
          body: JSON.stringify({
            event: "ClickButton",
            event_name: "live_video_join_click",
            event_time: Math.floor(Date.now() / 1000),
            user: {},
            properties: {
              content_id: "join_live_video",
              content_name: "Join Live Video Button",
              content_type: "button",
              value: 0.002,
              currency: "USD"
            },
            partner_name: "Cloudflare_Worker",
            access_token: env.TIKTOK_ACCESS_TOKEN
          })
        });

        // Return success response instead of redirecting
        return new Response(JSON.stringify({ success: true }), {
          headers: {
            'Content-Type': 'application/json',
            'Access-Control-Allow-Origin': '*'
          }
        });
        
      } catch (error) {
        // Return error response
        return new Response(JSON.stringify({ success: false, error: error.message }), {
          status: 500,
          headers: {
            'Content-Type': 'application/json',
            'Access-Control-Allow-Origin': '*'
          }
        });
      }
    }

    // For GET requests, redirect to offer link
    return Response.redirect('https://tinyurl.com/Arewa-nono', 302);
  }
              }
