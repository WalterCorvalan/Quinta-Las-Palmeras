/* ══════════════════════════════════════
   QUINTA LAS PALMERAS — script.js
   ══════════════════════════════════════ */

/* ── SERVICIOS ── */
const SERVICIOS = [
  { id:"sonido",     icon:"🔈", nombre:"Equipo de sonido", precio:0,        pp:false, desc:"Incluido en el espacio" },
  { id:"catering",   icon:"🍽️", nombre:"Catering",        precio_pp:8000,  pp:true,  desc:"Por persona" },
  { id:"barra",      icon:"🍺", nombre:"Barra de bebidas", precio:25000,    pp:false, desc:"Durante el evento" },
  { id:"mozos",      icon:"🤵", nombre:"Mozos",            precio:15000,    pp:false, desc:"Personal de servicio" },
  { id:"dj",         icon:"🎧", nombre:"DJ",               precio:60000,    pp:false, desc:"Con equipo propio" },
  { id:"fotografia", icon:"📸", nombre:"Fotografía",       precio:45000,    pp:false, desc:"Cobertura completa" },
  { id:"decoracion", icon:"🎨", nombre:"Decoración",       precio:30000,    pp:false, desc:"Ambientación temática" }
];

/* ── JUEGOS ── */
const JUEGOS = [
  { id:"metegol",  icon:"⚽", nombre:"Metegol",          precio:8000,  pp:false, desc:"Alquiler por evento" },
  { id:"castillo", icon:"🏰", nombre:"Castillo inflable", precio:15000, pp:false, desc:"Ideal para los nenes" },
  { id:"pool",     icon:"🔵", nombre:"Pool de pelotas",  precio:10000, pp:false, desc:"Para los más chicos" }
];

/* ── EXTRAS ── */
const EXTRAS = [
  { id:"parrilla",    icon:"🍖", nombre:"Parrilla",           precio:0,        pp:false, desc:"Sector equipado" },
  { id:"heladera",    icon:"🧊", nombre:"Heladera",           precio:0,        pp:false, desc:"Incluido" },
  { id:"apoya_torta", icon:"🎂", nombre:"Apoya torta",        precio:0,        pp:false, desc:"Incluido" },
  { id:"shimer",      icon:"✨", nombre:"Shimer",             precio:0,        pp:false, desc:"Panel incluido" },
  { id:"vajilla",     icon:"🍴", nombre:"Vajilla y manteles", precio_pp:2000,  pp:true,  desc:"Por persona" },
  { id:"candybar",    icon:"🍬", nombre:"Candy bar",          precio:10000,    pp:false, desc:"Mesitas para mesa dulce" },
  { id:"chispas",     icon:"🎆", nombre:"Chispas frías",      precio:15000,    pp:false, desc:"Para la entrada" },
  { id:"torta",       icon:"🍰", nombre:"Torta del evento",   precio:18000,    pp:false, desc:"Personalizada" }
];

/* ── CONFIGURACIÓN DE PRECIOS ── */
const CONFIG = {
  wa: "5491159895267",
  precioCopaPp: 800 // Costo adicional por persona si elige copas
};

/* ── ESTADO INICIAL ── */
const E = {
  espacio: 'salon',  
  dia: 'semana',     
  fechaExacta: '',   
  turno: 'dia',      
  personas: 40,
  usaCopas: false,   // false = vasos incluidos, true = copas adicionales
  servicios: new Set(['sonido']),
  juegos:    new Set(),
  extras:    new Set(['parrilla', 'heladera', 'apoya_torta', 'shimer']),
};

function toggleCopas() {
  E.usaCopas = !E.usaCopas;
  const card = document.getElementById('card-copas');
  const icon = document.getElementById('copas-icon');
  const num = document.getElementById('cap-vasos-copas');
  const label = document.getElementById('copas-label');

  if (E.usaCopas) {
    card.classList.add('activo');
    icon.textContent = '🍷';
    num.textContent = `+$${(CONFIG.precioCopaPp * E.personas).toLocaleString('es-AR')}`;
    label.textContent = 'Copas seleccionadas';
  } else {
    card.classList.remove('activo');
    icon.textContent = '🥛';
    num.textContent = 'Incluido';
    label.textContent = 'Vasos (Copas +$800/u)';
  }
  actualizar();
}

/* ══════════════════════════
   BANNER PROMO DINÁMICO
   ══════════════════════════ */
function actualizarBannerPromo() {
  const basePromo = 1200000;
  const costoPersonasExtra = (60 - 40) * 25000;
  const djPrecio = SERVICIOS.find(s => s.id === 'dj').precio;
  const fotoPrecio = SERVICIOS.find(s => s.id === 'fotografia').precio;
  
  const totalReal = basePromo + costoPersonasExtra + djPrecio + fotoPrecio; 
  const descuentoPromo = 5000;
  const totalPromo = totalReal - descuentoPromo;
  
  const anticipo = basePromo;
  const resto = totalPromo - anticipo;
  const cuotas = Math.round(resto / 3);
  
  const antEl = document.querySelector('.promo-anticipo');
  const cuotasEl = document.querySelector('.promo-cuotas');
  if(antEl) antEl.innerHTML = `Anticipo <strong>$${anticipo.toLocaleString('es-AR')}</strong>`;
  if(cuotasEl) cuotasEl.innerHTML = `+ 3 cuotas de <strong>$${cuotas.toLocaleString('es-AR')}</strong>`;
}


/* ══════════════════════════
   GALERÍA — filtros por espacio
   ══════════════════════════ */
function initFiltros() {
  document.querySelectorAll('.filtro').forEach(btn => {
    btn.addEventListener('click', () => {
      document.querySelectorAll('.filtro').forEach(b => b.classList.remove('activo'));
      btn.classList.add('activo');
      const f = btn.dataset.filtro;
      document.querySelectorAll('.galeria-item').forEach(item => {
        const espacio = item.dataset.espacio;
        item.classList.toggle('oculto', f !== 'todo' && espacio !== f);
      });
    });
  });
}

/* ══════════════════════════
   COTIZADOR DINÁMICO
   ══════════════════════════ */

function setEspacio(tipo) {
  E.espacio = tipo;
  document.getElementById('opc-salon').classList.toggle('activo', tipo === 'salon');
  document.getElementById('opc-quinta').classList.toggle('activo', tipo === 'quinta');
  actualizar();
}

function setDia(tipo) {
  E.dia = tipo;
  document.getElementById('opc-semana').classList.toggle('activo', tipo === 'semana');
  document.getElementById('opc-finde').classList.toggle('activo', tipo === 'finde');
  actualizar();
}

function setFecha() {
  E.fechaExacta = document.getElementById('fecha-exacta').value;
  actualizar();
}

function setTurno(tipo) {
  E.turno = tipo;
  document.getElementById('turno-dia').classList.toggle('activo', tipo === 'dia');
  document.getElementById('turno-noche').classList.toggle('activo', tipo === 'noche');
  actualizar();
}

function renderOpciones(items, gridId, setKey) {
  const grid = document.getElementById(gridId);
  if (!grid) return;
  grid.innerHTML = items.map(item => {
    let p = "";
    if (item.precio === 0 && !item.pp) {
      p = "Incluido";
    } else {
      p = item.pp 
        ? `$${(item.precio_pp * E.personas).toLocaleString('es-AR')} (×${E.personas})`
        : `$${(item.precio || 0).toLocaleString('es-AR')}`;
    }

    return `
      <div class="opc-card ${E[setKey].has(item.id) ? 'activo' : ''}"
           onclick="toggleOpc('${item.id}','${setKey}','${gridId}')">
        <div class="opc-check">✓</div>
        <span class="opc-icon">${item.icon}</span>
        <div class="opc-nombre">${item.nombre}</div>
        <div class="opc-precio">${p}</div>
        <div class="opc-desc">${item.desc}</div>
      </div>
    `;
  }).join('');
}

function toggleOpc(id, setKey, gridId) {
  E[setKey].has(id) ? E[setKey].delete(id) : E[setKey].add(id);
  renderOpciones(
    setKey === 'servicios' ? SERVICIOS : setKey === 'juegos' ? JUEGOS : EXTRAS,
    gridId, setKey
  );
  actualizar();
}

function initSlider() {
  const slider = document.getElementById('slider-personas');
  if (!slider) return;
  slider.addEventListener('input', () => {
    E.personas = parseInt(slider.value);
    document.getElementById('personas-num').textContent = E.personas;
    document.getElementById('cap-sillas').textContent   = E.personas;
    document.getElementById('cap-mesas').textContent    = Math.ceil(E.personas / 8); // 8 sillas por mesa
    document.getElementById('personas-icon').textContent =
      E.personas <= 20 ? '👨‍👩‍👧' : E.personas <= 50 ? '👨‍👩‍👧‍👦' : '🎉';
    
    // Si las copas están activas, actualizar su precio dinámicamente según la cantidad de personas
    if (E.usaCopas) {
      document.getElementById('cap-vasos-copas').textContent = `+$${(CONFIG.precioCopaPp * E.personas).toLocaleString('es-AR')}`;
    }
    
    renderOpciones(SERVICIOS, 'grid-servicios', 'servicios');
    renderOpciones(EXTRAS,    'grid-extras',    'extras');
    actualizar();
  });
}

/* Calcular lógica principal */
function calcular() {
  let baseAlquiler = 0;
  let nombreAlquiler = '';

  if (E.espacio === 'salon' && E.dia === 'semana') { baseAlquiler = 350000; nombreAlquiler = 'Salón (Día de Semana)'; }
  if (E.espacio === 'salon' && E.dia === 'finde')  { baseAlquiler = 650000; nombreAlquiler = 'Salón (Fin de Semana)'; }
  if (E.espacio === 'quinta' && E.dia === 'semana') { baseAlquiler = 1000000; nombreAlquiler = 'Quinta (Día de Semana)'; }
  if (E.espacio === 'quinta' && E.dia === 'finde')  { baseAlquiler = 1200000; nombreAlquiler = 'Quinta (Fin de Semana)'; }

  let costoPersonasExtra = 0;
  if (E.personas > 40) {
    costoPersonasExtra = (E.personas - 40) * 25000;
  }

  let total = baseAlquiler + costoPersonasExtra;

  let itemsDesglose = [];

  itemsDesglose.push({ nombre: `Alquiler base (${nombreAlquiler})`, precio: baseAlquiler });

  if (costoPersonasExtra > 0) {
    itemsDesglose.push({ nombre: `Adicional por excedente (${E.personas - 40} invitados extra)`, precio: costoPersonasExtra });
  }

  // Sumar adicional de copas si está activo
  if (E.usaCopas) {
    const costoCopas = CONFIG.precioCopaPp * E.personas;
    total += costoCopas;
    itemsDesglose.push({ nombre: `Adicional de copas (${E.personas} pers.)`, precio: costoCopas });
  }

  const addItem = (items, set) => items.forEach(item => {
    if (!set.has(item.id)) return;
    const m = item.pp ? item.precio_pp * E.personas : item.precio;
    total += m;
    itemsDesglose.push({ nombre: item.nombre, precio: m });
  });
  
  addItem(SERVICIOS, E.servicios);
  addItem(JUEGOS,    E.juegos);
  addItem(EXTRAS,    E.extras);
  
  itemsDesglose.sort((a, b) => b.precio - a.precio);

  const lineas = itemsDesglose.map(item => {
    const labelPrecio = item.precio === 0 ? 'Incluido' : `$${item.precio.toLocaleString('es-AR')}`;
    return `✅ ${item.nombre}: ${labelPrecio}`;
  });

  const esPromo = (E.espacio === 'quinta' && E.dia === 'finde' && E.personas === 60 && E.servicios.has('dj') && E.servicios.has('fotografia'));
  if (esPromo) {
    total -= 5000;
    lineas.push(`🎁 Bonificación paquete Todo Incluido: -$5.000`);
  }

  let anticipo = baseAlquiler;
  let resto = total - anticipo;
  let cuotas = resto > 0 ? Math.round(resto / 3) : 0;
  
  return { total, lineas, anticipo, cuotas, resto };
}

function toggleResumen() {
  const r = document.getElementById('cot-resumen');
  if (r) r.classList.toggle('expandido');
}

function actualizar() {
  const { total, lineas, anticipo, cuotas, resto } = calcular();
  const totalFmt = `$${total.toLocaleString('es-AR')}`;
  
  const barEl   = document.getElementById('cot-total-bar');
  const panelEl = document.getElementById('cot-total');
  if (barEl)   barEl.textContent   = totalFmt;
  if (panelEl) panelEl.textContent = totalFmt;

const esp = E.espacio === 'salon' ? 'Salón' : 'Quinta';
  let diaMostrado = E.dia === 'semana' ? 'Día de Sem' : 'Finde';
  
  if (E.fechaExacta) {
    const [year, month, day] = E.fechaExacta.split('-');
    diaMostrado += ` (${day}/${month})`;
  }
  
  const turnoTexto = E.turno === 'dia' ? 'Día (10:30 a 18hs)' : 'Noche (20:30 a 05hs)';
  document.getElementById('cot-detalle').textContent = `${E.personas} pers · ${esp} · ${diaMostrado} · ${turnoTexto}`;

  document.getElementById('cot-detalle').textContent = `${E.personas} pers · ${esp} · ${diaMostrado}`;

  const itemsEl = document.getElementById('cot-resumen-items');
  
  let html = lineas.map(l => {
    const partes = l.replace('✅ ', '').replace('🎁 ', '').split(': ');
    const nombre = partes[0];
    const precio = partes.slice(1).join(': ');
    return `<div class="cot-resumen-row"><span>${nombre}</span><strong>${precio}</strong></div>`;
  }).join('');

  if (resto > 0) {
    html += `
      <div class="cot-resumen-row" style="margin-top:14px; padding-top:12px; border-top:1px dashed rgba(255,255,255,0.4); color:var(--acento);">
        <span style="font-weight:600;">💳 Plan de Pagos</span>
        <div style="text-align:right;">
          <div style="font-size:0.85rem; font-weight:700;">Anticipo $${anticipo.toLocaleString('es-AR')}</div>
          <div style="font-size:0.75rem;">+ 3 cuotas de $${cuotas.toLocaleString('es-AR')}</div>
        </div>
      </div>
    `;
  } else {
    html += `
      <div class="cot-resumen-row" style="margin-top:14px; padding-top:12px; border-top:1px dashed rgba(255,255,255,0.4); color:var(--acento);">
        <span style="font-weight:600;">💳 Pago Único</span>
        <div style="text-align:right;">
          <div style="font-size:0.85rem; font-weight:700;">$${anticipo.toLocaleString('es-AR')}</div>
        </div>
      </div>
    `;
  }

  itemsEl.innerHTML = html;
}

function enviarWA() {
  const { total, lineas, anticipo, cuotas, resto } = calcular();
  const esp = E.espacio === 'salon' ? 'Salón' : 'Quinta Completa';
  const dia = E.dia === 'semana' ? 'Día de Semana' : 'Fin de Semana';
  
  let msg = `🌿 ¡Hola! Armé mi evento en la web de Quinta Las Palmeras.\n\n`;
  msg += `📍 *Espacio elegido:* ${esp}\n`;
  msg += `📅 *Tipo de día:* ${dia}\n`;
  
  if (E.fechaExacta) {
    const [year, month, day] = E.fechaExacta.split('-');
    msg += `🗓️ *Fecha exacta:* ${day}/${month}/${year}\n`;
  }
  
  const turnoMsg = E.turno === 'dia' ? '☀️ Día (10:30 a 18:00 hs)' : '🌙 Noche (20:30 a 05:00 hs)';
  msg += `⏰ *Horario:* ${turnoMsg}\n`;
  msg += `👥 *Personas:* ${E.personas}\n\n`;
  msg += `*Detalle del presupuesto:*\n${lineas.join('\n')}\n\n`;
  msg += `💰 *Total estimado: $${total.toLocaleString('es-AR')}*\n`;
  
  if (resto > 0) {
    msg += `💳 *Plan sugerido:* Anticipo de $${anticipo.toLocaleString('es-AR')} y 3 cuotas de $${cuotas.toLocaleString('es-AR')}\n\n`;
    msg += `✅ *Para bloquear la fecha, podés transferir el anticipo al Alias:* QUINTA.PALMERAS\n\n`;
  } else {
    msg += `✅ *Para bloquear la fecha, podés transferir el total al Alias:* QUINTA.PALMERAS\n\n`;
  }
  
  msg += `¿Me confirman disponibilidad? ¡Gracias!`;
  
  window.open(`https://wa.me/${CONFIG.wa}?text=${encodeURIComponent(msg)}`, '_blank');
}

function activarPromo() {
  setEspacio('quinta');
  setDia('finde');
  
  const slider = document.getElementById('slider-personas');
  if(slider) {
      slider.value = 60;
      slider.dispatchEvent(new Event('input'));
  }

  E.servicios = new Set(['dj','fotografia','sonido']);
  E.juegos    = new Set();
  E.extras    = new Set(['parrilla', 'heladera', 'apoya_torta', 'shimer']);
  
  renderOpciones(SERVICIOS, 'grid-servicios', 'servicios');
  renderOpciones(JUEGOS,    'grid-juegos',    'juegos');
  renderOpciones(EXTRAS,    'grid-extras',    'extras');
  actualizar();
  
  document.getElementById('cotizador')?.scrollIntoView({ behavior:'smooth' });
}

document.addEventListener('DOMContentLoaded', () => {
  actualizarBannerPromo();
  initFiltros();
  renderOpciones(SERVICIOS, 'grid-servicios', 'servicios');
  renderOpciones(JUEGOS,    'grid-juegos',    'juegos');
  renderOpciones(EXTRAS,    'grid-extras',    'extras');
  initSlider();
  actualizar();
});

async function pagarConMercadoPago() {
  const { anticipo } = calcular(); 
  
  // 1. Capturamos el botón
  const btnPagar = document.getElementById('btn-pagar');
  
  // 2. Guardamos su contenido original (para no perder el iconito SVG si falla)
  const contenidoOriginal = btnPagar.innerHTML;
  
  // 3. Lo ponemos en estado de carga y lo bloqueamos
  btnPagar.innerHTML = '⏳ Generando pago...';
  btnPagar.disabled = true;
  btnPagar.style.opacity = '0.7'; // Le bajamos la opacidad para que se vea inactivo
  btnPagar.style.cursor = 'not-allowed';

  try {
    const respuesta = await fetch('/.netlify/functions/crear-pago', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        total: anticipo,
        descripcion: "Anticipo - Quinta Las Palmeras"
      })
    });

    const datos = await respuesta.json();
    
    // Si todo sale bien, lo redirigimos. No hace falta restaurar el botón.
    if (datos.init_point) {
      window.location.href = datos.init_point;
    } else {
      alert("Hubo un error al generar el pago.");
      restaurarBoton();
    }

  } catch (error) {
    console.error(error);
    alert("Error de conexión al procesar el pago.");
    restaurarBoton();
  }

  // Función interna cortita para volver el botón a la normalidad si algo falla
  function restaurarBoton() {
    btnPagar.innerHTML = contenidoOriginal;
    btnPagar.disabled = false;
    btnPagar.style.opacity = '1';
    btnPagar.style.cursor = 'pointer';
  }
}