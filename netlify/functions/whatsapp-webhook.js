const GRAPH = 'https://graph.facebook.com/v21.0';

async function getStore() {
  const { getStore } = await import('@netlify/blobs');
  return getStore('whatsapp');
}

async function sendWA(payload) {
  const res = await fetch(`${GRAPH}/${process.env.WHATSAPP_PHONE_ID}/messages`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${process.env.WHATSAPP_TOKEN}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ messaging_product: 'whatsapp', ...payload })
  });
  if (!res.ok) console.error('WhatsApp send error', res.status, await res.text());
  return res.ok;
}

const text = (to, body) => ({ to, type: 'text', text: { body } });

const buttons = (to, body, list) => ({
  to,
  type: 'interactive',
  interactive: {
    type: 'button',
    body: { text: body },
    action: {
      buttons: list.map(([id, title]) => ({ type: 'reply', reply: { id, title } }))
    }
  }
});

const BIENVENIDA = '¡Hola! 👋 Bienvenido/a a *Quinta Las Palmeras* 🌴\n¿En qué te podemos ayudar?';
const BOTONES = [['paquetes', 'Paquetes y precios'], ['asesor', 'Hablar con asesor']];

const PAQUETES =
  '*Alquiler por persona*\n' +
  '🏠 Salón (25 a 65 personas): $10.000 día / $15.000 noche\n' +
  '🌴 Quinta (40 a 150 personas): $15.000 día / $20.000 noche\n' +
  'Fin de semana: +10%.\n\n' +
  'Armá tu presupuesto con catering, barra y extras en la web y enviánoslo por acá.';

const ASESOR = 'Perfecto, en breve un asesor te responde por este chat. 🙌';

async function saveMessage(store, phone, name, dir, body) {
  const conv = (await store.get(phone, { type: 'json' })) || {
    phone, name: '', messages: [], status: 'bot'
  };
  if (name) conv.name = name;
  conv.messages.push({ dir, text: body, ts: Date.now() });
  conv.updated = Date.now();
  return { conv, save: () => store.setJSON(phone, conv) };
}

async function handleMessage(store, msg, name) {
  const phone = msg.from;
  let incoming = '';
  let choice = null;

  if (msg.type === 'text') incoming = msg.text.body;
  else if (msg.type === 'interactive') {
    choice = msg.interactive.button_reply?.id;
    incoming = msg.interactive.button_reply?.title || '';
  } else incoming = `[${msg.type}]`;

  const { conv, save } = await saveMessage(store, phone, name, 'in', incoming);

  // Si ya lo atiende un asesor, el bot no interviene
  if (conv.status === 'asesor' && !choice) return save();

  let reply = null;
  let out = '';
  if (choice === 'paquetes') {
    out = PAQUETES;
    reply = () => sendWA(text(phone, out));
  } else if (choice === 'asesor') {
    conv.status = 'asesor';
    out = ASESOR;
    reply = () => sendWA(text(phone, out));
  } else {
    out = BIENVENIDA;
    reply = () => sendWA(buttons(phone, out, BOTONES));
  }

  const ok = await reply();
  if (ok) conv.messages.push({ dir: 'out', text: out, ts: Date.now() });
  await save();
}

exports.handler = async (event) => {
  // Verificación del webhook (Meta hace GET)
  if (event.httpMethod === 'GET') {
    const q = event.queryStringParameters || {};
    if (q['hub.mode'] === 'subscribe' && q['hub.verify_token'] === process.env.WHATSAPP_VERIFY_TOKEN) {
      return { statusCode: 200, body: q['hub.challenge'] };
    }
    return { statusCode: 403, body: 'Forbidden' };
  }

  if (event.httpMethod !== 'POST') return { statusCode: 405, body: 'Method Not Allowed' };

  try {
    const body = JSON.parse(event.body || '{}');
    const store = await getStore();
    for (const entry of body.entry || []) {
      for (const change of entry.changes || []) {
        const value = change.value || {};
        const names = {};
        (value.contacts || []).forEach((c) => (names[c.wa_id] = c.profile?.name));
        for (const msg of value.messages || []) {
          await handleMessage(store, msg, names[msg.from]);
        }
      }
    }
  } catch (err) {
    console.error('webhook error', err);
  }
  // Siempre 200 para que Meta no reintente
  return { statusCode: 200, body: 'ok' };
};
