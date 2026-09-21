const respuestasData = require('./bot-respuestas.json');

const VERIFY_TOKEN = process.env.WHATSAPP_VERIFY_TOKEN;
const WHATSAPP_TOKEN = process.env.WHATSAPP_TOKEN;
const PHONE_NUMBER_ID = process.env.WHATSAPP_PHONE_ID;
const GRAPH_URL = `https://graph.facebook.com/v20.0/${PHONE_NUMBER_ID}/messages`;

function normalizar(texto) {
  return (texto || '')
    .toLowerCase()
    .trim()
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '');
}

function buscarRespuesta(textoUsuario) {
  const texto = normalizar(textoUsuario);

  if (texto === 'menu' || texto === 'menú' || texto === 'hola') {
    return null;
  }

  for (const item of respuestasData.respuestas) {
    const coincide = item.palabrasClave.some((palabra) => normalizar(palabra) === texto);
    if (coincide) {
      return item.respuesta;
    }
  }

  return respuestasData.noEntendido;
}

async function enviarMensajeTexto(to, texto) {
  await fetch(GRAPH_URL, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${WHATSAPP_TOKEN}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      messaging_product: 'whatsapp',
      to,
      type: 'text',
      text: { body: texto }
    })
  });
}

async function enviarMenuPrincipal(to) {
  await fetch(GRAPH_URL, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${WHATSAPP_TOKEN}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      messaging_product: 'whatsapp',
      to,
      type: 'interactive',
      interactive: {
        type: 'button',
        body: { text: respuestasData.menuPrincipal.texto },
        action: {
          buttons: respuestasData.menuPrincipal.botones.map((boton) => ({
            type: 'reply',
            reply: { id: boton.id, title: boton.titulo }
          }))
        }
      }
    })
  });
}

exports.handler = async (event) => {
  // Verificación del webhook (Meta la llama una sola vez al configurar)
  if (event.httpMethod === 'GET') {
    const params = event.queryStringParameters || {};
    if (params['hub.mode'] === 'subscribe' && params['hub.verify_token'] === VERIFY_TOKEN) {
      return { statusCode: 200, body: params['hub.challenge'] };
    }
    return { statusCode: 403, body: 'Verificación fallida' };
  }

  if (event.httpMethod !== 'POST') {
    return { statusCode: 405, body: 'Method Not Allowed' };
  }

  try {
    const body = JSON.parse(event.body);
    const cambio = body.entry?.[0]?.changes?.[0]?.value;
    const mensaje = cambio?.messages?.[0];

    if (!mensaje) {
      // Notificaciones de estado (entregado, leído, etc.) no requieren respuesta
      return { statusCode: 200, body: 'OK' };
    }

    const from = mensaje.from;
    const textoUsuario =
      mensaje.type === 'button'
        ? mensaje.button?.text
        : mensaje.type === 'interactive'
        ? mensaje.interactive?.button_reply?.id || mensaje.interactive?.button_reply?.title
        : mensaje.text?.body;

    const respuesta = buscarRespuesta(textoUsuario);

    if (respuesta === null) {
      await enviarMenuPrincipal(from);
    } else {
      await enviarMensajeTexto(from, respuesta);
    }

    return { statusCode: 200, body: 'OK' };
  } catch (error) {
    return { statusCode: 500, body: JSON.stringify({ error: error.message }) };
  }
};
