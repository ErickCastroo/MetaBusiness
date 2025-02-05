import fetch from 'node-fetch';
import dotenv from 'dotenv';
import cron from 'node-cron';

dotenv.config();

async function sendMessage(to, templateName, languageCode = "en_US", params = []) {
  const url = `https://graph.facebook.com/v21.0/${process.env.BUSINESS_ID}/messages`;
  const accessToken = process.env.ACCESS_TOKEN;

  const message = {
    messaging_product: "whatsapp",
    to: to, // Número de teléfono al que se enviará el mensaje
    type: "template",
    template: {
      name: templateName,
      language: {
        code: languageCode,
      },
      components: [
        {
          type: "body",
          parameters: params.map(param => ({ type: "text", text: param }))
        }
      ]
    },
  };

  try {
    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${accessToken}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(message),
    });

    const data = await response.json();
    if (data.error) {
      console.error("Error en la API de WhatsApp:", data.error);
    } else {
      console.log("Mensaje enviado con éxito:", JSON.stringify(data, null, 2));
    }
  } catch (error) {
    console.error("Error al enviar el mensaje:", error);
  }
}

// Configura el cron job para enviar el mensaje cada 5 minutos
cron.schedule('*/5 * * * *', () => {
  // Aquí puedes personalizar los parámetros que quieras enviar en el mensaje
  sendMessage('(NUMERODEENVIO)', 'oomapas', 'en_US');
});
