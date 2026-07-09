/* ══════════════════════════════════════
   QUINTA LAS PALMERAS — script.js
   ══════════════════════════════════════ */

/* ── CONFIGURACIÓN DE PRECIOS ── */
const CONFIG = {
  wa: "5491159895267",
  alquiler: 1200000,
  seguro:    50000,
};

/* ── FECHAS DISPONIBLES ──
   Para actualizar: cambiar ocupado: true/false
   Para agregar fecha nueva: copiar un objeto { dia, num, mes, ocupado }
   ──────────────────────── */
const FECHAS = [
  { dia:"Sáb", num:"12", mes:"Jul", ocupado:false },
  { dia:"Dom", num:"13", mes:"Jul", ocupado:true  },
  { dia:"Sáb", num:"19", mes:"Jul", ocupado:false },
  { dia:"Dom", num:"20", mes:"Jul", ocupado:false },
  { dia:"Sáb", num:"26", mes:"Jul", ocupado:true  },
  { dia:"Dom", num:"27", mes:"Jul", ocupado:false },
  { dia:"Sáb", num:"2",  mes:"Ago", ocupado:false },
  { dia:"Dom", num:"3",  mes:"Ago", ocupado:false },
  { dia:"Sáb", num:"9",  mes:"Ago", ocupado:false },
  { dia:"Dom", num:"10", mes:"Ago", ocupado:true  },
];

/* ── SERVICIOS ── */
const SERVICIOS = [
  { id:"catering",   icon:"🍽️", nombre:"Catering",        precio_pp:8000,  pp:true,  desc:"Por persona" },
  { id:"barra",      icon:"🍺", nombre:"Barra de bebidas", precio:25000,    pp:false, desc:"Durante el evento" },
  { id:"mozos",      icon:"🤵", nombre:"Mozos",            precio:15000,    pp:false, desc:"Personal de servicio" },
  { id:"dj",         icon:"🎧", nombre:"DJ",               precio:60000,    pp:false, desc:"Con equipo de sonido" },
  { id:"fotografia", icon:"📸", nombre:"Fotografía",       precio:45000,    pp:false, desc:"Cobertura completa" },
  { id:"decoracion", icon:"🎨", nombre:"Decoración",       precio:30000,    pp:false, desc:"Ambientación temática" },
];

/* ── JUEGOS ── */
const JUEGOS = [
  { id:"metegol",  icon:"⚽", nombre:"Metegol",          precio:8000,  pp:false, desc:"Alquiler por evento" },
  { id:"castillo", icon:"🏰", nombre:"Castillo inflable", precio:15000, pp:false, desc:"Ideal para los nenes" },
  { id:"pool",     icon:"🔵", nombre:"Pool de pelotas",  precio:10000, pp:false, desc:"Para los más chicos" },
];

/* ── EXTRAS ── */
const EXTRAS = [
  { id:"vajilla",  icon:"🍴", nombre:"Vajilla y manteles", precio_pp:2000, pp:true,  desc:"Por persona" },
  { id:"candybar", icon:"🍬", nombre:"Candy bar",          precio:10000,  pp:false, desc:"Mesitas para mesa dulce" },
  { id:"chispas",  icon:"✨", nombre:"Chispas frías",      precio:15000,  pp:false, desc:"Para la entrada" },
  { id:"torta",    icon:"🎂", nombre:"Torta del evento",   precio:18000,  pp:false, desc:"Personalizada" },
];

/* ── ESTADO ── */
const E = {
  personas: 40,
  fecha: null,
  servicios: new Set(),
  juegos:    new Set(),
  extras:    new Set(),
};

/* ══════════════════════════
   CARRUSELES (espacios)
   ══════════════════════════ */
const carouselState = {};
function moveCarousel(trackId, dir) {
  const track = document.getElementById(trackId);
  if (!track) return;
  if (carouselState[trackId] === undefined) carouselState[trackId] = 0;
  const slides = track.querySelectorAll('img');
  if (slides.length <= 1) return;
  carouselState[trackId] = (carouselState[trackId] + dir + slides.length) % slides.length;
  track.style.transform = `translateX(${carouselState[trackId] * -100}%)`;
}

/* ══════════════════════════
   GALERÍA — filtros
   ══════════════════════════ */
function initFiltros() {
  document.querySelectorAll('.filtro').forEach(btn => {
    btn.addEventListener('click', () => {
      document.querySelectorAll('.filtro').forEach(b => b.classList.remove('activo'));
      btn.classList.add('activo');
      const f = btn.dataset.filtro;
      document.querySelectorAll('.galeria-item').forEach(item => {
        const tipo = item.dataset.tipo;
        item.classList.toggle('oculto', f !== 'todo' && tipo !== f);
      });
    });
  });
}

/* ══════════════════════════
   COTIZADOR
   ══════════════════════════ */

/* Fechas */
function renderFechas() {
  const grid = document.getElementById('fechas-grid');
  if (!grid) return;
  grid.innerHTML = FECHAS.map((f, i) => `
    <div class="fecha-card ${f.ocupado ? 'ocupado' : ''}"
         onclick="${f.ocupado ? '' : `elegirFecha(${i})`}">
      <div class="fecha-check">✓</div>
      <div class="fecha-dia">${f.dia}</div>
      <div class="fecha-num">${f.num}</div>
      <div class="fecha-mes">${f.mes}</div>
      <span class="fecha-badge ${f.ocupado ? 'ocupado' : 'libre'}">${f.ocupado ? 'Reservado' : 'Disponible'}</span>
    </div>
  `).join('');
}

function elegirFecha(i) {
  E.fecha = i;
  document.querySelectorAll('.fecha-card').forEach((el, idx) => {
    el.classList.toggle('activo', idx === i);
  });
  actualizar();
}

/* Opciones */
function renderOpciones(items, gridId, setKey) {
  const grid = document.getElementById(gridId);
  if (!grid) return;
  grid.innerHTML = items.map(item => {
    const p = item.pp
      ? `$${(item.precio_pp * E.personas).toLocaleString('es-AR')} (×${E.personas})`
      : `$${(item.precio || 0).toLocaleString('es-AR')}`;
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

/* Slider personas */
function initSlider() {
  const slider = document.getElementById('slider-personas');
  if (!slider) return;
  slider.addEventListener('input', () => {
    E.personas = parseInt(slider.value);
    document.getElementById('personas-num').textContent = E.personas;
    document.getElementById('cap-sillas').textContent   = E.personas;
    document.getElementById('cap-mesas').textContent    = Math.ceil(E.personas / 8);
    document.getElementById('personas-icon').textContent =
      E.personas <= 20 ? '👨‍👩‍👧' : E.personas <= 50 ? '👨‍👩‍👧‍👦' : '🎉';
    const ok = E.personas <= 100;
    document.getElementById('cap-espacio').textContent       = ok ? '✓' : '⚠️';
    document.getElementById('cap-espacio-label').textContent = ok ? 'dentro del límite' : 'capacidad máxima';
    // Re-render grids con precio actualizado
    renderOpciones(SERVICIOS, 'grid-servicios', 'servicios');
    renderOpciones(EXTRAS,    'grid-extras',    'extras');
    actualizar();
  });
}

/* Calcular */
function calcular() {
  let total = CONFIG.alquiler + CONFIG.seguro;
  const lineas = ['✅ Alquiler de la quinta', '✅ Seguro obligatorio'];
  const addItem = (items, set) => items.forEach(item => {
    if (!set.has(item.id)) return;
    const m = item.pp ? item.precio_pp * E.personas : item.precio;
    total += m;
    lineas.push(`✅ ${item.nombre}: $${m.toLocaleString('es-AR')}`);
  });
  addItem(SERVICIOS, E.servicios);
  addItem(JUEGOS,    E.juegos);
  addItem(EXTRAS,    E.extras);
  return { total, lineas };
}

/* Toggle resumen mobile */
function toggleResumen() {
  const r = document.getElementById('cot-resumen');
  if (r) r.classList.toggle('expandido');
}

/* Actualizar UI */
function actualizar() {
  const { total, lineas } = calcular();
  const totalFmt = `$${total.toLocaleString('es-AR')}`;
  const barEl   = document.getElementById('cot-total-bar');
  const panelEl = document.getElementById('cot-total');
  if (barEl)   barEl.textContent   = totalFmt;
  if (panelEl) panelEl.textContent = totalFmt;

  const f = E.fecha !== null
    ? `${FECHAS[E.fecha].dia} ${FECHAS[E.fecha].num} de ${FECHAS[E.fecha].mes}`
    : 'Sin fecha elegida';
  document.getElementById('cot-detalle').textContent = `${E.personas} personas · ${f}`;

  const itemsEl = document.getElementById('cot-resumen-items');
  const extras = lineas.length - 2;
  if (extras === 0) {
    itemsEl.innerHTML = '<p class="cot-resumen-vacio">Alquiler y seguro incluidos</p>';
  } else {
    itemsEl.innerHTML = lineas.slice(2).map(l => {
      const [nombre, precio] = l.replace('✅ ', '').split(': ');
      return `<div class="cot-resumen-row"><span>${nombre}</span><strong>${precio}</strong></div>`;
    }).join('');
  }
}

/* WhatsApp */
function enviarWA() {
  const { total, lineas } = calcular();
  const f = E.fecha !== null
    ? `${FECHAS[E.fecha].dia} ${FECHAS[E.fecha].num} de ${FECHAS[E.fecha].mes}`
    : 'fecha a confirmar';
  let msg = `🌿 ¡Hola! Armé mi evento en la web de Quinta Las Palmeras.\n\n`;
  msg += `👥 *Personas:* ${E.personas}\n`;
  msg += `📅 *Fecha:* ${f}\n\n`;
  msg += `*Lo que seleccioné:*\n${lineas.join('\n')}\n\n`;
  msg += `💰 *Total estimado: $${total.toLocaleString('es-AR')}*\n\n`;
  msg += `¿Me confirman disponibilidad? ¡Gracias!`;
  window.open(`https://wa.me/${CONFIG.wa}?text=${encodeURIComponent(msg)}`, '_blank');
}

/* Promo: activa el paquete todo incluido */
function activarPromo() {
  E.servicios = new Set(['dj','fotografia']);
  E.juegos    = new Set();
  E.extras    = new Set();
  renderOpciones(SERVICIOS, 'grid-servicios', 'servicios');
  renderOpciones(JUEGOS,    'grid-juegos',    'juegos');
  renderOpciones(EXTRAS,    'grid-extras',    'extras');
  actualizar();
  document.getElementById('cotizador')?.scrollIntoView({ behavior:'smooth' });
}

/* ══════════════════════════
   INIT
   ══════════════════════════ */
document.addEventListener('DOMContentLoaded', () => {
  initFiltros();
  renderFechas();
  renderOpciones(SERVICIOS, 'grid-servicios', 'servicios');
  renderOpciones(JUEGOS,    'grid-juegos',    'juegos');
  renderOpciones(EXTRAS,    'grid-extras',    'extras');
  initSlider();
  actualizar();
});