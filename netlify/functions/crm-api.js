const crypto = require('crypto');

async function getStore() {
  const { getStore } = await import('@netlify/blobs');
  return getStore('whatsapp');
}

function authorized(event) {
  const pass = process.env.CRM_PASSWORD;
  const given = event.headers['x-crm-password'] || '';
  if (!pass) return false;
  const a = Buffer.from(given);
  const b = Buffer.from(pass);
  return a.length === b.length && crypto.timingSafeEqual(a, b);
}

const json = (statusCode, obj) => ({
  statusCode,
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify(obj)
});

exports.handler = async (event) => {
  if (!authorized(event)) return json(401, { error: 'No autorizado' });

  const store = await getStore();
  const phone = (event.queryStringParameters || {}).phone;

  try {
    // Listar conversaciones o abrir una
    if (event.httpMethod === 'GET') {
      if (phone) return json(200, (await store.get(phone, { type: 'json' })) || null);
      const { blobs } = await store.list();
      const convs = (await Promise.all(blobs.map((b) => store.get(b.key, { type: 'json' }))))
        .filter(Boolean)
        .map((c) => ({
          phone: c.phone,
          name: c.name,
          status: c.status,
          updated: c.updated,
          last: c.messages[c.messages.length - 1]?.text || ''
        }))
        .sort((a, b) => b.updated - a.updated);
      return json(200, convs);
    }

    if (event.httpMethod === 'POST') {
      const { phone: to, message, status } = JSON.parse(event.body || '{}');
      const conv = to && (await store.get(to, { type: 'json' }));
      if (!conv) return json(404, { error: 'Conversación no encontrada' });

      if (status) conv.status = status; // 'bot' | 'asesor' | 'cerrado'

      if (message) {
        const res = await fetch(`https://graph.facebook.com/v21.0/${process.env.WHATSAPP_PHONE_ID}/messages`, {
          method: 'POST',
          headers: {
            Authorization: `Bearer ${process.env.WHATSAPP_TOKEN}`,
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({ messaging_product: 'whatsapp', to, type: 'text', text: { body: message } })
        });
        if (!res.ok) return json(502, { error: await res.text() });
        conv.messages.push({ dir: 'out', text: message, ts: Date.now() });
        conv.status = 'asesor';
      }
      conv.updated = Date.now();
      await store.setJSON(to, conv);
      return json(200, conv);
    }
    return json(405, { error: 'Method Not Allowed' });
  } catch (err) {
    console.error('crm error', err);
    return json(500, { error: err.message });
  }
};
