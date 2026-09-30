const cfg = require('./bot-respuestas.json');
const { registrarMensaje, actualizarFlujo, contarEnviosUltimaHora } = require('./lib/chats-store');

const WHATSAPP_TOKEN = process.env.WHATSAPP_TOKEN;
const PHONE_NUMBER_ID = process.env.WHATSAPP_PHONE_ID;
const VERIFY_TOKEN = process.env.WHATSAPP_VERIFY_TOKEN;
const GRAPH_URL = `https://graph.facebook.com/v20.0/${PHONE_NUMBER_ID}/messages`;

const ORDEN_PASOS = ['tipo_evento', 'fecha', 'invitados', 'horario', 'servicios'];

function normalizar(texto) {
  return (texto || '')
    .toLowerCase()
    .trim()
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '');
}

async function llamarWhatsApp(payload) {
  await fetch(GRAPH_URL, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${WHATSAPP_TOKEN}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ messaging_product: 'whatsapp', ...payload })
  });
}

async function enviarTexto(to, texto) {
  await llamarWhatsApp({ to, type: 'text', text: { body: texto } });
  await registrarMensaje({ telefono: to, texto, direccion: 'saliente' });
}

async function enviarBotones(to, texto, opciones) {
  await llamarWhatsApp({
    to,
    type: 'interactive',
    interactive: {
      type: 'button',
      body: { text: texto },
      action: {
        buttons: opciones.map((o) => ({ type: 'reply', reply: { id: o.id, title: o.titulo } }))
      }
    }
  });
  await registrarMensaje({ telefono: to, texto, direccion: 'saliente' });
}

async function enviarLista(to, texto, botonLista, opciones) {
  await llamarWhatsApp({
    to,
    type: 'interactive',
    interactive: {
      type: 'list',
      body: { text: texto },
      action: {
        button: botonLista,
        sections: [{ title: 'Opciones', rows: opciones.map((o) => ({ id: o.id, title: o.titulo })) }]
      }
    }
  });
  await registrarMensaje({ telefono: to, texto, direccion: 'saliente' });
}

async function enviarPasoDelFlujo(to, pasoId) {
  const paso = cfg.flujo[pasoId];
  if (paso.tipo === 'lista') {
    await enviarLista(to, paso.texto, paso.botonLista, paso.opciones);
  } else if (paso.tipo === 'botones') {
    await enviarBotones(to, paso.texto, paso.opciones);
  } else {
    await enviarTexto(to, paso.texto);
  }
}

function formatearMoneda(valor) {
  return `$${Math.round(valor).toLocaleString('es-AR')}`;
}

async function enviarResumenFinal(to, datos) {
  const paquete = cfg.paquetes[datos.servicios];
  const precioPersona = datos.horario === 'noche' ? paquete.noche : paquete.dia;
  const invitadosNum = Number(datos.invitados);
  const total = Number.isFinite(invitadosNum) ? precioPersona * invitadosNum : null;

  let texto = `📋 Con esos datos te recomiendo el paquete *${paquete.nombre}*.\n${paquete.descripcion}\n\n💲 Valor por persona (${datos.horario === 'noche' ? 'noche' : 'día'}): ${formatearMoneda(precioPersona)}`;
  if (total) {
    texto += `\n💰 Estimado para ${invitadosNum} invitados: *${formatearMoneda(total)}*`;
  }
  texto += '\n\nEste es un valor aproximado — el presupuesto final te lo confirma un asesor según disponibilidad. ¿Avanzamos?';

  await enviarBotones(to, texto, [
    { id: 'vendedor', titulo: 'Hablar con asesor' },
    { id: 'paquetes', titulo: 'Ver otros paquetes' }
  ]);
}

function extraerRespuestaUsuario(mensaje) {
  if (mensaje.type === 'interactive') {
    const reply = mensaje.interactive?.button_reply || mensaje.interactive?.list_reply;
    return { id: reply?.id, texto: reply?.title || reply?.id };
  }
  if (mensaje.type === 'button') {
    return { id: normalizar(mensaje.button?.text), texto: mensaje.button?.text };
  }
  return { id: null, texto: mensaje.text?.body };
}

function buscarRespuestaLibre(textoUsuario) {
  const texto = normalizar(textoUsuario);
  for (const item of cfg.respuestas) {
    if (item.palabrasClave.some((p) => normalizar(p) === texto)) {
      return item.respuesta;
    }
  }
  return null;
}

async function procesarPaso(to, chat, entrada) {
  const pasoActual = chat.flujo.paso;
  const def = cfg.flujo[pasoActual];
  const datos = chat.flujo.datos;

  if (pasoActual === 'invitados') {
    const match = (entrada.texto || '').match(/\d+/);
    if (!match) {
      await enviarTexto(to, def.reintento);
      return;
    }
    datos.invitados = match[0];
  } else if (def.tipo === 'lista' || def.tipo === 'botones') {
    const opcion = def.opciones.find(
      (o) => o.id === entrada.id || normalizar(o.titulo) === normalizar(entrada.texto)
    );
    if (!opcion) {
      await enviarPasoDelFlujo(to, pasoActual);
      return;
    }
    datos[pasoActual] = opcion.id;
  } else {
    datos[pasoActual] = entrada.texto;
  }

  const indiceSiguiente = ORDEN_PASOS.indexOf(pasoActual) + 1;
  if (indiceSiguiente < ORDEN_PASOS.length) {
    const siguientePaso = ORDEN_PASOS[indiceSiguiente];
    await actualizarFlujo(to, { paso: siguientePaso, datos });
    await enviarPasoDelFlujo(to, siguientePaso);
  } else {
    await actualizarFlujo(to, { paso: 'fin', datos });
    await enviarResumenFinal(to, datos);
  }
}

exports.handler = async (event) => {
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
      return { statusCode: 200, body: 'OK' };
    }

    const from = mensaje.from;
    const nombreContacto = cambio?.contacts?.[0]?.profile?.name;
    const entrada = extraerRespuestaUsuario(mensaje);

    const chat = await registrarMensaje({
      telefono: from,
      texto: entrada.texto,
      direccion: 'entrante',
      nombre: nombreContacto
    });

    // Corta de responder si ya se mandaron demasiados mensajes automáticos en la última hora
    const limite = cfg.limiteRespuestasPorHora || 20;
    const enviosPrevios = contarEnviosUltimaHora(chat);
    if (enviosPrevios >= limite) {
      if (enviosPrevios === limite) {
        await enviarTexto(from, cfg.limiteAlcanzado);
      }
      return { statusCode: 200, body: 'OK' };
    }

    const textoNormalizado = normalizar(entrada.texto);
    const esReinicio = !chat.flujo || textoNormalizado === 'menu' || textoNormalizado === 'hola';

    if (esReinicio) {
      const primerPaso = ORDEN_PASOS[0];
      await actualizarFlujo(from, { paso: primerPaso, datos: {} });
      await enviarTexto(from, cfg.saludoInicial);
      await enviarPasoDelFlujo(from, primerPaso);
      return { statusCode: 200, body: 'OK' };
    }

    if (chat.flujo.paso !== 'fin') {
      await procesarPaso(from, chat, entrada);
      return { statusCode: 200, body: 'OK' };
    }

    // Flujo ya completo: responde por palabra clave (paquetes, vendedor, ubicación) o deriva a un asesor
    const idBoton = entrada.id && cfg.respuestas.find((r) => r.id === entrada.id);
    const respuesta = idBoton ? idBoton.respuesta : buscarRespuestaLibre(entrada.texto) || cfg.noEntendido;
    await enviarTexto(from, respuesta);

    return { statusCode: 200, body: 'OK' };
  } catch (error) {
    return { statusCode: 500, body: JSON.stringify({ error: error.message }) };
  }
};
