const { listarChats, obtenerChat, actualizarEstado } = require('./lib/chats-store');

const CRM_PASSWORD = process.env.CRM_PASSWORD;

function autenticado(event) {
  const clave = event.headers['x-crm-password'] || event.queryStringParameters?.clave;
  return CRM_PASSWORD && clave === CRM_PASSWORD;
}

exports.handler = async (event) => {
  if (!autenticado(event)) {
    return { statusCode: 401, body: JSON.stringify({ error: 'No autorizado' }) };
  }

  try {
    if (event.httpMethod === 'GET') {
      const telefono = event.queryStringParameters?.telefono;

      if (telefono) {
        const chat = await obtenerChat(telefono);
        if (!chat) {
          return { statusCode: 404, body: JSON.stringify({ error: 'Chat no encontrado' }) };
        }
        return { statusCode: 200, body: JSON.stringify(chat) };
      }

      const chats = await listarChats();
      return { statusCode: 200, body: JSON.stringify(chats) };
    }

    if (event.httpMethod === 'POST') {
      const { telefono, estado } = JSON.parse(event.body || '{}');
      if (!telefono || !estado) {
        return { statusCode: 400, body: JSON.stringify({ error: 'Faltan telefono o estado' }) };
      }
      const chat = await actualizarEstado(telefono, estado);
      if (!chat) {
        return { statusCode: 404, body: JSON.stringify({ error: 'Chat no encontrado' }) };
      }
      return { statusCode: 200, body: JSON.stringify(chat) };
    }

    return { statusCode: 405, body: 'Method Not Allowed' };
  } catch (error) {
    return { statusCode: 500, body: JSON.stringify({ error: error.message }) };
  }
};
