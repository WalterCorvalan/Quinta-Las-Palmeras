const { listarChats, obtenerChat, actualizarEstado } = require('./lib/chats-store');

const CRM_PASSWORD = process.env.CRM_PASSWORD;

function autenticado(req) {
  const clave = req.headers['x-crm-password'] || req.query?.clave;
  return CRM_PASSWORD && clave === CRM_PASSWORD;
}

module.exports = async (req, res) => {
  if (!autenticado(req)) {
    res.status(401).json({ error: 'No autorizado' });
    return;
  }

  try {
    if (req.method === 'GET') {
      const telefono = req.query?.telefono;

      if (telefono) {
        const chat = await obtenerChat(telefono);
        if (!chat) {
          res.status(404).json({ error: 'Chat no encontrado' });
          return;
        }
        res.status(200).json(chat);
        return;
      }

      const chats = await listarChats();
      res.status(200).json(chats);
      return;
    }

    if (req.method === 'POST') {
      const { telefono, estado } = req.body || {};
      if (!telefono || !estado) {
        res.status(400).json({ error: 'Faltan telefono o estado' });
        return;
      }
      const chat = await actualizarEstado(telefono, estado);
      if (!chat) {
        res.status(404).json({ error: 'Chat no encontrado' });
        return;
      }
      res.status(200).json(chat);
      return;
    }

    res.status(405).send('Method Not Allowed');
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
