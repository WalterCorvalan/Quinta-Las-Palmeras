/* ══════════════════════════════════════
   QUINTA LAS PALMERAS — script.js
   ══════════════════════════════════════ */

/* ── CONFIGURACIÓN DE PRECIOS Y OPCIONES ── */
const CONFIG = {
  wa: "5491159895267",
  precioCopaPp: 800 // Costo adicional por persona si elige copas
};

const CATERING = [
  { id:"catering", icon:"🍽️", nombre:"Catering", precio_pp:8000, pp:true, desc:"Por persona" }
];

const BARRA = [
  { id:"barra", icon:"🍺", nombre:"Barra de bebidas", precio:25000, pp:false, desc:"Durante el evento" }
];

const MUSICA_PERSONAL = [
  { id:"dj", icon:"🎧", nombre:"DJ", precio:550000, pp:false, desc:"Varía según turno" },
  { id:"parlante", icon:"🔊", nombre:"Parlante Bluetooth", precio:0, pp:false, desc:"Audio básico incluido" },
  { id:"mozos", icon:"🤵", nombre:"Mozos", precio:70000, pp:false, desc:"Personal de servicio c/u" },
  { id:"parrillero", icon:"🍖", nombre:"Parrillero", precio:90000, pp:false, desc:"Asador profesional" },
  { id:"combo_dj_foto", icon:"🌟", nombre:"Combo DJ + Fotografía", precio:450000, pp:false, desc:"Paquete especial" }
];

const JUEGOS = [
  { id:"metegol", icon:"⚽", nombre:"Metegol", precio:8000, pp:false, desc:"Alquiler por evento" },
  { id:"castillo", icon:"🏰", nombre:"Castillo inflable", precio:15000, pp:false, desc:"Ideal para los nenes" },
  { id:"pool", icon:"🔵", nombre:"Pool de pelotas", precio:10000, pp:false, desc:"Para los más chicos" }
];

const EXTRAS = [
  { id:"parrilla", icon:"🔥", nombre:"Sector Parrilla", precio:0, pp:false, desc:"Sector equipado" },
  { id:"heladera", icon:"🧊", nombre:"Heladera", precio:0, pp:false, desc:"Incluido" },
  { id:"apoya_torta", icon:"🎂", nombre:"Apoya torta", precio:0, pp:false, desc:"Incluido" },
  { id:"shimer", icon:"✨", nombre:"Shimer", precio:0, pp:false, desc:"Panel incluido" },
  { id:"vajilla", icon:"🍴", nombre:"Vajilla y manteles", precio_pp:2000, pp:true, desc:"Por persona" },
  { id:"candybar", icon:"🍬", nombre:"Candy bar", precio:10000, pp:false, desc:"Mesitas para mesa dulce" },
  { id:"chispas", icon:"🎆", nombre:"Chispas frías", precio:15000, pp:false, desc:"Para la entrada" },
  { id:"torta", icon:"🍰", nombre:"Torta del evento", precio:18000, pp:false, desc:"Personalizada" }
];

/* ── ESTADO INICIAL ── */
const E = {
  espacio: 'salon',  
  dia: 'semana',     
  fechaExacta: '',   
  turno: 'dia',      
  personas: 40,
  usaCopas: false,   
  catering: new Set(),
  barra: new Set(),
  musicaPersonal: new Set(),
  juegos: new Set(),
  extras: new Set(['parrilla', 'heladera', 'apoya_torta', 'shimer']),
};

function getPrecioItem(item) {
  if (item.id === 'dj') {
    return E.turno === 'dia' ? 550000 : 650000;
  }
  return item.precio;
}

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
  // Usamos el combo de DJ y fotografía
  const comboPrecio = MUSICA_PERSONAL.find(s => s.id === 'combo_dj_foto').precio;
  
  const totalReal = basePromo + costoPersonasExtra + comboPrecio; 
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
  renderOpciones(MUSICA_PERSONAL, 'grid-musica-personal', 'musicaPersonal');
  actualizar();
}

function renderOpciones(items, gridId, setKey) {
  const grid = document.getElementById(gridId);
  if (!grid) return;
  grid.innerHTML = items.map(item => {
    let p = "";
    const precioReal = getPrecioItem(item);
    if (precioReal === 0 && !item.pp) {
      p = "Incluido";
    } else {
      p = item.pp 
        ? `$${(item.precio_pp * E.personas).toLocaleString('es-AR')} (×${E.personas})`
        : `$${precioReal.toLocaleString('es-AR')}`;
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
  
  let dataset = CATERING;
  if (setKey === 'barra') dataset = BARRA;
  else if (setKey === 'musicaPersonal') dataset = MUSICA_PERSONAL;
  else if (setKey === 'juegos') dataset = JUEGOS;
  else if (setKey === 'extras') dataset = EXTRAS;

  renderOpciones(dataset, gridId, setKey);
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
    
    // Recargar todas las grillas que dependen del slider de personas
    renderOpciones(CATERING, 'grid-catering', 'catering');
    renderOpciones(BARRA, 'grid-barra', 'barra');
    renderOpciones(MUSICA_PERSONAL, 'grid-musica-personal', 'musicaPersonal');
    renderOpciones(JUEGOS, 'grid-juegos', 'juegos');
    renderOpciones(EXTRAS, 'grid-extras', 'extras');
    actualizar();
  });
}

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

  if (E.usaCopas) {
    const costoCopas = 800 * E.personas;
    total += costoCopas;
    itemsDesglose.push({ nombre: `Adicional de copas (${E.personas} pers.)`, precio: costoCopas });
  }

  const addItems = (items, set) => items.forEach(item => {
    if (!set.has(item.id)) return;
    const precioUnit = getPrecioItem(item);
    const m = item.pp ? item.precio_pp * E.personas : precioUnit;
    total += m;
    let nombreMostrado = item.nombre;
    if (item.id === 'dj') {
      nombreMostrado += E.turno === 'dia' ? ' (De Día)' : ' (De Noche)';
    }
    itemsDesglose.push({ nombre: nombreMostrado, precio: m });
  });

  addItems(CATERING, E.catering);
  addItems(BARRA, E.barra);
  addItems(MUSICA_PERSONAL, E.musicaPersonal);
  addItems(JUEGOS, E.juegos);
  addItems(EXTRAS, E.extras);
  
  itemsDesglose.sort((a, b) => b.precio - a.precio);

  const lineas = itemsDesglose.map(item => {
    const labelPrecio = item.precio === 0 ? 'Incluido' : `$${item.precio.toLocaleString('es-AR')}`;
    return `✅ ${item.nombre}: ${labelPrecio}`;
  });

  // Paquete Promo Automático
  const esPromo = (E.espacio === 'quinta' && E.dia === 'finde' && E.personas === 60 && E.musicaPersonal.has('combo_dj_foto'));
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

  // Agregamos el combo de dj + fotografía
  E.musicaPersonal = new Set(['combo_dj_foto', 'parlante']);
  E.juegos    = new Set();
  E.extras    = new Set(['parrilla', 'heladera', 'apoya_torta', 'shimer']);
  E.catering  = new Set();
  E.barra     = new Set();
  
  renderOpciones(CATERING, 'grid-catering', 'catering');
  renderOpciones(BARRA, 'grid-barra', 'barra');
  renderOpciones(MUSICA_PERSONAL, 'grid-musica-personal', 'musicaPersonal');
  renderOpciones(JUEGOS,    'grid-juegos',    'juegos');
  renderOpciones(EXTRAS,    'grid-extras',    'extras');
  actualizar();
  
  document.getElementById('cotizador')?.scrollIntoView({ behavior:'smooth' });
}

document.addEventListener('DOMContentLoaded', () => {
  actualizarBannerPromo();
  initFiltros();
  renderOpciones(CATERING, 'grid-catering', 'catering');
  renderOpciones(BARRA, 'grid-barra', 'barra');
  renderOpciones(MUSICA_PERSONAL, 'grid-musica-personal', 'musicaPersonal');
  renderOpciones(JUEGOS, 'grid-juegos', 'juegos');
  renderOpciones(EXTRAS, 'grid-extras', 'extras');
  initSlider();
  actualizar();
});

async function pagarConMercadoPago() {
  const { anticipo } = calcular(); 
  
  const btnPagar = document.getElementById('btn-pagar');
  const contenidoOriginal = btnPagar.innerHTML;
  
  btnPagar.innerHTML = '⏳ Generando pago...';
  btnPagar.disabled = true;
  btnPagar.style.opacity = '0.7'; 
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

  function restaurarBoton() {
    btnPagar.innerHTML = contenidoOriginal;
    btnPagar.disabled = false;
    btnPagar.style.opacity = '1';
    btnPagar.style.cursor = 'pointer';
  }
}