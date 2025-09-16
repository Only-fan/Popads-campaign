export default {
  async fetch(request, env) {
    // Handle TikTok event tracking
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
            event: requestData.event,
            event_name: requestData.event_name,
            event_time: Math.floor(Date.now() / 1000),
            user: requestData.user || {},
            properties: requestData.properties || {},
            context: requestData.context || {},
            partner_name: "Cloudflare_Worker",
            access_token: env.TIKTOK_ACCESS_TOKEN
          })
        });

        // Always redirect to offer link regardless of TikTok response
        return Response.redirect('https://tinyurl.com/Arewa-nono', 302);
        
      } catch (error) {
        // Still redirect even if tracking fails
        return Response.redirect('https://tinyurl.com/Arewa-nono', 302);
      }
    }

    // For GET requests, also redirect to offer link
    return Response.redirect('https://tinyurl.com/Arewa-nono', 302);
  }
}