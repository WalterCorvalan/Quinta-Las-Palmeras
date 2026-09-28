const { getStore } = require('@netlify/blobs');

const STORE_NAME = 'crm-chats';
const INDICE_KEY = '_indice';

function store() {
  return getStore(STORE_NAME);
}

async function obtenerIndice() {
  const db = store();
  const indice = await db.get(INDICE_KEY, { type: 'json' });
  return indice || [];
}

async function guardarIndice(telefonos) {
  const db = store();
  await db.setJSON(INDICE_KEY, telefonos);
}

async function obtenerChat(telefono) {
  const db = store();
  const chat = await db.get(telefono, { type: 'json' });
  return chat || null;
}

async function registrarMensaje({ telefono, texto, direccion, nombre }) {
  const db = store();
  const chat = (await obtenerChat(telefono)) || {
    telefono,
    nombre: nombre || null,
    estado: 'nuevo',
    mensajes: []
  };

  if (nombre && !chat.nombre) {
    chat.nombre = nombre;
  }

  chat.mensajes.push({
    texto: texto || '',
    direccion, // 'entrante' | 'saliente'
    fecha: new Date().toISOString()
  });

  // Un mensaje entrante nuevo reabre la conversación
  if (direccion === 'entrante') {
    chat.estado = 'nuevo';
  }

  chat.ultimoMensaje = texto || '';
  chat.ultimaFecha = new Date().toISOString();

  await db.setJSON(telefono, chat);

  const indice = await obtenerIndice();
  if (!indice.includes(telefono)) {
    indice.push(telefono);
    await guardarIndice(indice);
  }

  return chat;
}

async function listarChats() {
  const indice = await obtenerIndice();
  const chats = await Promise.all(indice.map((telefono) => obtenerChat(telefono)));
  return chats
    .filter(Boolean)
    .sort((a, b) => new Date(b.ultimaFecha || 0) - new Date(a.ultimaFecha || 0));
}

async function actualizarEstado(telefono, estado) {
  const chat = await obtenerChat(telefono);
  if (!chat) return null;
  chat.estado = estado;
  const db = store();
  await db.setJSON(telefono, chat);
  return chat;
}

module.exports = {
  registrarMensaje,
  listarChats,
  obtenerChat,
  actualizarEstado
};
