const { Redis } = require('@upstash/redis');

const redis = Redis.fromEnv();

const PREFIX = 'crm-chats:';
const INDICE_KEY = `${PREFIX}_indice`;

async function obtenerIndice() {
  const indice = await redis.get(INDICE_KEY);
  return indice || [];
}

async function guardarIndice(telefonos) {
  await redis.set(INDICE_KEY, telefonos);
}

async function obtenerChat(telefono) {
  const chat = await redis.get(`${PREFIX}${telefono}`);
  return chat || null;
}

async function registrarMensaje({ telefono, texto, direccion, nombre }) {
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

  await redis.set(`${PREFIX}${telefono}`, chat);

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
  await redis.set(`${PREFIX}${telefono}`, chat);
  return chat;
}

async function actualizarFlujo(telefono, flujo) {
  const chat = await obtenerChat(telefono);
  if (!chat) return null;
  chat.flujo = flujo;
  await redis.set(`${PREFIX}${telefono}`, chat);
  return chat;
}

function contarEnviosUltimaHora(chat) {
  const haceUnaHora = Date.now() - 60 * 60 * 1000;
  return (chat.mensajes || []).filter(
    (m) => m.direccion === 'saliente' && new Date(m.fecha).getTime() > haceUnaHora
  ).length;
}

module.exports = {
  registrarMensaje,
  listarChats,
  obtenerChat,
  actualizarEstado,
  actualizarFlujo,
  contarEnviosUltimaHora
};
