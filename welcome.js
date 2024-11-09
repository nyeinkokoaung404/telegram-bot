const TELEGRAM_API = ENV_BOT_API; // API URL
const BOT_TOKEN = ENV_BOT_TOKEN; // Your bot token
const WEBHOOK_URL = ENV_WEBHOOK_URL; // Your provided webhook URL

// Function to set the webhook URL
async function setWebhook() {
    const webhookUrl = `${TELEGRAM_API}${BOT_TOKEN}/setWebhook`;

    const response = await fetch(webhookUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
            url: WEBHOOK_URL
        })
    });

    const result = await response.json();
    if (result.ok) {
        console.log('Webhook set successfully:', result);
    } else {
        console.error('Failed to set webhook:', result);
    }
}

async function handleRequest(request) {
 
  const telegramApiUrl = `${TELEGRAM_API}${BOT_TOKEN}/`;

  if (request.method === 'POST') {
    const requestBody = await request.json();

    if (requestBody.message && requestBody.message.new_chat_members) {
      const chatId = requestBody.message.chat.id;
      const welcomePhotoUrl = 'https://iam404.serv00.net/welcome.png';
      const caption = `မင်္ဂလာပါ...🫶,\n@${requestBody.message.new_chat_members.map(member => member.username || member.first_name).join(', ')}!\nGroup လေးကိုရောက်လာတဲ့အတွက် ကျေးဇူးတင်ပါတယ်!\nWe're glad to have you here.`;

      await fetch(`${telegramApiUrl}sendPhoto`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          chat_id: chatId,
          photo: welcomePhotoUrl,
          caption: caption
        })
      });
    }

    return new Response('OK', { status: 200 });
  } else {
    return new Response('Method Not Allowed', { status: 405 });
  }
}
// Main entry point for the Cloudflare Worker
addEventListener('fetch', event => {
    event.respondWith((async () => {
        await setWebhook(); // Set webhook once during first request
        return handleRequest(event.request);
    })());
});
