/* ══════════════════════════════════════
   QUINTA LAS PALMERAS — script.js
   ══════════════════════════════════════ */

/* ── CONFIGURACIÓN DE PRECIOS Y OPCIONES ── */
const CONFIG = {
  wa: "5491159895267",
  precioCopaPp: 800, // Costo adicional por persona si elige copas
};

const LIMITES = {
  salon: { min: 25, max: 65, dia: 10000, noche: 15000 },
  quinta: { min: 40, max: 150, dia: 20000, noche: 25000 },
};

const CATERING = [
  {
    id: "catering_formal",
    icon: "🍽️",
    nombre: "Catering Formal",
    precio_pp: 8000,
    pp: true,
    desc: "Entrada, plato y postre",
  },
  {
    id: "pizza_libre",
    icon: "🍕",
    nombre: "Pizza Libre",
    precio_pp: 4500,
    pp: true,
    desc: "Variedad de pizzas",
  },
  {
    id: "pernil",
    icon: "🍖",
    nombre: "Pernil de Cerdo",
    precio: 65000,
    pp: false,
    desc: "Para 40 personas con panes",
  },
  {
    id: "mesa_dulce",
    icon: "🧁",
    nombre: "Mesa Dulce",
    precio_pp: 2500,
    pp: true,
    desc: "Variedad de tartas",
  },
];

const BARRA = [
  {
    id: "barra_premium",
    icon: "🍹",
    nombre: "Barra Premium",
    precio: 45000,
    pp: false,
    desc: "Tragos con alcohol libre",
  },
  {
    id: "barra_soft",
    icon: "🥤",
    nombre: "Barra Soft",
    precio: 25000,
    pp: false,
    desc: "Gaseosas, agua y jugos",
  },
  {
    id: "cerveza",
    icon: "🍺",
    nombre: "Cerveza Tirada",
    precio: 35000,
    pp: false,
    desc: "Barril de 30 litros",
  },
];

const MUSICA_PERSONAL = [
  {
    id: "dj",
    icon: "🎧",
    nombre: "DJ",
    precio: 550000,
    pp: false,
    desc: "Varía según turno",
  },
  {
    id: "fotografia",
    icon: "📸",
    nombre: "Fotógrafo",
    precio: 450000,
    pp: false,
    desc: "Cobertura del evento",
  },
  {
    id: "mozos",
    icon: "🤵",
    nombre: "Mozos",
    precio: 0,
    pp: false,
    desc: "Cada 20 p. 1 mozo",
  },
  {
    id: "parrillero",
    icon: "🍖",
    nombre: "Parrillero",
    precio: 90000,
    pp: false,
    desc: "Asador profesional",
  },
];

const JUEGOS_COMUNES = [
  {
    id: "metegol",
    icon: "⚽",
    nombre: "Metegol",
    precio: 15000,
    pp: false,
    desc: "Alquiler por evento",
  },
];

const JUEGOS_QUINTA = [
  {
    id: "pelotero_acuatico",
    icon: "💦",
    nombre: "Pelotero Acuático",
    precio: 120000,
    pp: false,
    desc: "Ideal para el verano",
  },
  {
    id: "pool",
    icon: "🔵",
    nombre: "Pool de pelotas",
    precio: 35000,
    pp: false,
    desc: "Para los más chicos",
  },
];

const EXTRAS = [
  {
    id: "parrilla",
    icon: "🔥",
    nombre: "Sector Parrilla",
    precio: 0,
    pp: false,
    desc: "Sector equipado",
  },
  {
    id: "heladera",
    icon: "🧊",
    nombre: "Heladera",
    precio: 0,
    pp: false,
    desc: "Incluido",
  },
  {
    id: "apoya_torta",
    icon: "🎂",
    nombre: "Apoya torta",
    precio: 0,
    pp: false,
    desc: "Incluido",
  },
  {
    id: "shimer",
    icon: "✨",
    nombre: "Panel Shimer",
    precio: 80000,
    pp: false,
    desc: "Fondo decorativo",
  },
  {
    id: "candybar",
    icon: "🍬",
    nombre: "Candy bar",
    precio: 35000,
    pp: false,
    desc: "Mesitas para mesa dulce",
  },
  {
    id: "chispas",
    icon: "🎆",
    nombre: "Chispas frías",
    precio: 65000,
    pp: false,
    desc: "Por unidad",
  },
  {
    id: "torta",
    icon: "🍰",
    nombre: "Torta del evento",
    precio: 80000,
    pp: false,
    desc: "Personalizada",
  },
];

/* ── ESTADO INICIAL ── */
function crearEstadoEspacio(personas) {
  return {
    dia: "semana",
    fechaExacta: "",
    turno: "dia",
    personas,
    usaCopas: false,
    catering: new Set(),
    barra: new Set(),
    musicaPersonal: new Set(),
    juegos: new Set(),
    extras: new Set(["parrilla", "heladera", "apoya_torta"]),
  };
}

const E = {
  activo: "salon",
  salon: crearEstadoEspacio(LIMITES.salon.min),
  quinta: crearEstadoEspacio(LIMITES.quinta.min),
};

function juegosDe(espacio) {
  return espacio === "quinta"
    ? JUEGOS_COMUNES.concat(JUEGOS_QUINTA)
    : JUEGOS_COMUNES;
}

function getPrecioItem(item, espacio) {
  const st = E[espacio];
  if (item.id === "dj") {
    return st.turno === "dia" ? 550000 : 650000;
  }
  if (item.id === "mozos") {
    const cantidadMozos = Math.ceil(st.personas / 20); // Redondea para arriba: 50/20 = 2.5 -> 3 mozos
    return cantidadMozos * 70000;
  }
  return item.precio;
}

function toggleCopas(espacio) {
  const st = E[espacio];
  st.usaCopas = !st.usaCopas;
  E.activo = espacio;
  const card = document.getElementById(`card-copas-${espacio}`);
  const icon = document.getElementById(`copas-icon-${espacio}`);
  const num = document.getElementById(`cap-vasos-copas-${espacio}`);
  const label = document.getElementById(`copas-label-${espacio}`);

  if (st.usaCopas) {
    card.classList.add("activo");
    icon.textContent = "🍷";
    num.textContent = `+$${(CONFIG.precioCopaPp * st.personas).toLocaleString("es-AR")}`;
    label.textContent = "Copas seleccionadas";
  } else {
    card.classList.remove("activo");
    icon.textContent = "🥛";
    num.textContent = "Incluido";
    label.textContent = "Vasos (Copas +$800/u)";
  }
  actualizar();
}

/* ══════════════════════════
   GALERÍA — filtros por espacio
   ══════════════════════════ */

function aplicarFiltroGaleria(f) {
  const items = document.querySelectorAll(".galeria-item[data-espacio]");
  if (f !== "todo") {
    items.forEach((item) =>
      item.classList.toggle("oculto", item.dataset.espacio !== f),
    );
    return;
  }
  items.forEach((item) => item.classList.add("oculto"));
  const grupos = {};
  items.forEach((item) => {
    const espacio = item.dataset.espacio;
    (grupos[espacio] = grupos[espacio] || []).push(item);
  });
  const CANTIDAD_POR_ESPACIO_EN_TODO = 2;
  Object.entries(grupos).forEach(([espacio, arr]) => {
    const mezclado = [...arr].sort(() => Math.random() - 0.5);
    mezclado
      .slice(0, CANTIDAD_POR_ESPACIO_EN_TODO)
      .forEach((item) => item.classList.remove("oculto"));
  });
}

/* ══════════════════════════
   GALERÍA — Mezclar fotos al azar
   ══════════════════════════ */
function randomizarGaleria() {
  const grid = document.getElementById("galeria-grid");
  if (!grid) return;

  // 1. Obtenemos todos los elementos de la galería
  const items = Array.from(grid.querySelectorAll(".galeria-item"));

  // 2. Mezclamos solo las imágenes de la galería
  const imagenes = items;

  // 4. Mezclamos las imágenes de forma aleatoria (Algoritmo de Fisher-Yates)
  for (let i = imagenes.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [imagenes[i], imagenes[j]] = [imagenes[j], imagenes[i]];
  }

  // 3. Vaciamos la grilla
  grid.innerHTML = "";

  // 4. Agregamos todos los elementos de nuevo al HTML
  imagenes.forEach((item) => grid.appendChild(item));
}

function initFiltros() {
  document.querySelectorAll(".filtro").forEach((btn) => {
    btn.addEventListener("click", () => {
      document
        .querySelectorAll(".filtro")
        .forEach((b) => b.classList.remove("activo"));
      btn.classList.add("activo");
      aplicarFiltroGaleria(btn.dataset.filtro);
    });
  });
  aplicarFiltroGaleria("todo");
}

/* ══════════════════════════
   COTIZADOR DINÁMICO
   ══════════════════════════ */

function avanzarPaso(elActual) {
  const contenedor = elActual.closest(".cot-pasos");
  if (!contenedor) return;
  const pasos = Array.from(contenedor.querySelectorAll(".cot-paso"));
  const idx = pasos.indexOf(elActual.closest(".cot-paso"));
  const siguiente = pasos[idx + 1];
  if (siguiente) {
    setTimeout(
      () => siguiente.scrollIntoView({ behavior: "smooth", block: "start" }),
      300,
    );
  }
}

function elegirEspacio(espacio) {
  E.activo = espacio;
  document
    .getElementById("btn-elegir-salon")
    .classList.toggle("activo", espacio === "salon");
  document
    .getElementById("btn-elegir-quinta")
    .classList.toggle("activo", espacio === "quinta");
  document
    .getElementById("bloque-salon")
    .classList.toggle("oculto", espacio !== "salon");
  document
    .getElementById("bloque-quinta")
    .classList.toggle("oculto", espacio !== "quinta");
  actualizar();
  document
    .getElementById(`bloque-${espacio}`)
    .scrollIntoView({ behavior: "smooth", block: "start" });
}

function ajustarSliderAlEspacio(espacio) {
  const lim = LIMITES[espacio];
  const st = E[espacio];
  const slider = document.getElementById(`slider-personas-${espacio}`);
  if (!slider) return;
  slider.value = st.personas;
  document.getElementById(`personas-num-${espacio}`).textContent = st.personas;
  document.getElementById(`cap-sillas-${espacio}`).textContent = st.personas;
  document.getElementById(`cap-mesas-${espacio}`).textContent = Math.ceil(
    st.personas / 8,
  );
}

function setDia(tipo, espacio) {
  E[espacio].dia = tipo;
  E.activo = espacio;
  document
    .getElementById(`opc-semana-${espacio}`)
    .classList.toggle("activo", tipo === "semana");
  document
    .getElementById(`opc-finde-${espacio}`)
    .classList.toggle("activo", tipo === "finde");
  actualizar();
  try {
    avanzarPaso(document.getElementById(`opc-semana-${espacio}`));
  } catch (e) {
    console.warn(e);
  }
}

function setFecha(espacio) {
  E[espacio].fechaExacta = document.getElementById(
    `fecha-exacta-${espacio}`,
  ).value;
  E.activo = espacio;
  actualizar();
  try {
    avanzarPaso(document.getElementById(`fecha-exacta-${espacio}`));
  } catch (e) {
    console.warn(e);
  }
}

function setTurno(tipo, espacio) {
  E[espacio].turno = tipo;
  E.activo = espacio;
  document
    .getElementById(`turno-dia-${espacio}`)
    .classList.toggle("activo", tipo === "dia");
  document
    .getElementById(`turno-noche-${espacio}`)
    .classList.toggle("activo", tipo === "noche");
  renderOpciones(
    MUSICA_PERSONAL,
    `grid-musica-personal-${espacio}`,
    "musicaPersonal",
    espacio,
  );
  actualizar();
  try {
    avanzarPaso(document.getElementById(`turno-dia-${espacio}`));
  } catch (e) {
    console.warn(e);
  }
}

function renderOpciones(items, gridId, setKey, espacio) {
  const grid = document.getElementById(gridId);
  if (!grid) return;
  const st = E[espacio];
  const comboActivo =
    setKey === "musicaPersonal" &&
    st.musicaPersonal.has("dj") &&
    st.musicaPersonal.has("fotografia");
  grid.innerHTML =
    items
      .map((item) => {
        let p = "";
        const precioReal = getPrecioItem(item, espacio);
        if (precioReal === 0 && !item.pp) {
          p = "Incluido";
        } else {
          p = item.pp
            ? `$${(item.precio_pp * st.personas).toLocaleString("es-AR")} (×${st.personas})`
            : `$${precioReal.toLocaleString("es-AR")}`;
        }

        return `
      <div class="opc-card ${st[setKey].has(item.id) ? "activo" : ""} ${
        comboActivo && (item.id === "dj" || item.id === "fotografia")
          ? "combo-activo"
          : ""
      }"
            onclick="toggleOpc('${item.id}','${setKey}','${gridId}','${espacio}')">
        <div class="opc-check">✓</div>
        <span class="opc-icon">${item.icon}</span>
        <div class="opc-nombre">${item.nombre}</div>
        <div class="opc-precio">${p}</div>
        <div class="opc-desc">${item.desc}</div>
      </div>
    `;
      })
      .join("") +
    (comboActivo
      ? `<div class="combo-aviso" role="status">
          <strong>🎉 Combo DJ + Fotógrafo aplicado</strong>
          <span>Juntos te queda en <b>$850.000</b></span>
        </div>`
      : "");
}

function toggleOpc(id, setKey, gridId, espacio) {
  const st = E[espacio];
  E.activo = espacio;
  st[setKey].has(id) ? st[setKey].delete(id) : st[setKey].add(id);

  let dataset = CATERING;
  if (setKey === "barra") dataset = BARRA;
  else if (setKey === "musicaPersonal") dataset = MUSICA_PERSONAL;
  else if (setKey === "juegos") dataset = juegosDe(espacio);
  else if (setKey === "extras") dataset = EXTRAS;

  renderOpciones(dataset, gridId, setKey, espacio);
  actualizar();
}

function initSlider(espacio) {
  const slider = document.getElementById(`slider-personas-${espacio}`);
  if (!slider) return;
  ajustarSliderAlEspacio(espacio);
  slider.addEventListener("input", () => {
    const st = E[espacio];
    st.personas = parseInt(slider.value);
    E.activo = espacio;
    document.getElementById(`personas-num-${espacio}`).textContent =
      st.personas;
    document.getElementById(`cap-sillas-${espacio}`).textContent = st.personas;
    document.getElementById(`cap-mesas-${espacio}`).textContent = Math.ceil(
      st.personas / 8,
    ); // 8 sillas por mesa
    document.getElementById(`personas-icon-${espacio}`).textContent =
      st.personas <= 20 ? "👨‍👩‍👧" : st.personas <= 50 ? "👨‍👩‍👧‍👦" : "🎉";

    if (st.usaCopas) {
      document.getElementById(`cap-vasos-copas-${espacio}`).textContent =
        `+$${(CONFIG.precioCopaPp * st.personas).toLocaleString("es-AR")}`;
    }

    renderOpciones(CATERING, `grid-catering-${espacio}`, "catering", espacio);
    renderOpciones(BARRA, `grid-barra-${espacio}`, "barra", espacio);
    renderOpciones(
      MUSICA_PERSONAL,
      `grid-musica-personal-${espacio}`,
      "musicaPersonal",
      espacio,
    );
    renderOpciones(
      juegosDe(espacio),
      `grid-juegos-${espacio}`,
      "juegos",
      espacio,
    );
    renderOpciones(EXTRAS, `grid-extras-${espacio}`, "extras", espacio);
    actualizar();
  });
}

function calcular() {
  const espacio = E.activo;
  const st = E[espacio];
  const lim = LIMITES[espacio];
  const precioPp = st.turno === "dia" ? lim.dia : lim.noche;
  const nombreEspacio = espacio === "salon" ? "Salón" : "Quinta Completa";
  const turnoNombre = st.turno === "dia" ? "De Día" : "De Noche";
  const baseAlquiler = precioPp * st.personas;
  const nombreAlquiler = `${nombreEspacio} (${turnoNombre}, ${st.personas} pers. × $${precioPp.toLocaleString("es-AR")})`;

  let total = baseAlquiler;
  let itemsDesglose = [];

  itemsDesglose.push({
    nombre: `Alquiler base: ${nombreAlquiler}`,
    precio: baseAlquiler,
  });

  if (st.usaCopas) {
    const costoCopas = CONFIG.precioCopaPp * st.personas;
    total += costoCopas;
    itemsDesglose.push({
      nombre: `Adicional de copas (${st.personas} pers.)`,
      precio: costoCopas,
    });
  }

  const addItems = (items, set) =>
    items.forEach((item) => {
      if (!set.has(item.id)) return;
      const precioUnit = getPrecioItem(item, espacio);
      let m = item.pp ? item.precio_pp * st.personas : precioUnit;

      let nombreMostrado = item.nombre;

      if (item.id === "dj") {
        nombreMostrado += st.turno === "dia" ? " (De Día)" : " (De Noche)";
      } else if (item.id === "mozos") {
        nombreMostrado += ` (${Math.ceil(st.personas / 20)} mozos)`;
      }

      total += m;
      itemsDesglose.push({ nombre: nombreMostrado, precio: m });
    });

  addItems(CATERING, st.catering);
  addItems(BARRA, st.barra);
  addItems(MUSICA_PERSONAL, st.musicaPersonal);
  addItems(juegosDe(espacio), st.juegos);
  addItems(EXTRAS, st.extras);

  itemsDesglose.sort((a, b) => b.precio - a.precio);

  const lineas = itemsDesglose.map((item) => {
    const labelPrecio =
      item.precio === 0
        ? "Incluido"
        : `$${item.precio.toLocaleString("es-AR")}`;
    return `✅ ${item.nombre}: ${labelPrecio}`;
  });

  // --- LÓGICA DE PROMO DJ + FOTÓGRAFO ---
  if (st.musicaPersonal.has("dj") && st.musicaPersonal.has("fotografia")) {
    const precioDJ = st.turno === "dia" ? 550000 : 650000;
    const precioFoto = 450000;
    const descuentoDjFoto = precioDJ + precioFoto - 850000;

    total -= descuentoDjFoto;
    lineas.push(
      `🎁 Promo DJ + Fotógrafo aplicada: -$${descuentoDjFoto.toLocaleString("es-AR")}`,
    );
  }

  let anticipo = baseAlquiler;
  let resto = total - anticipo;
  let cuotas = resto > 0 ? Math.round(resto / 3) : 0;

  return { espacio, total, lineas, anticipo, cuotas, resto };
}

function toggleResumen() {
  const r = document.getElementById("cot-resumen");
  const waFloat = document.querySelector(".wa-float");
  const label = document.querySelector(".cot-resumen-bar-toggle");

  if (r) r.classList.toggle("expandido");
  if (waFloat)
    waFloat.style.display = r.classList.contains("expandido") ? "none" : "flex";

  if (label) {
    const abierto = r.classList.contains("expandido");
    label.innerHTML = abierto
      ? 'Seguí armando tu evento <span class="toggle-arrow">▼</span>'
      : 'Ver detalle aquí <span class="toggle-arrow">▲</span>';
  }
}

function actualizar() {
  const { espacio, total, lineas, anticipo, cuotas, resto } = calcular();
  const st = E[espacio];
  const totalFmt = `$${total.toLocaleString("es-AR")}`;

  const barEl = document.getElementById("cot-total-bar");
  const panelEl = document.getElementById("cot-total");
  if (barEl) barEl.textContent = totalFmt;
  if (panelEl) panelEl.textContent = totalFmt;

  const esp = espacio === "salon" ? "Salón" : "Quinta";
  const espacioLabel = document.getElementById("cot-resumen-espacio");
  if (espacioLabel) espacioLabel.textContent = `Tu presupuesto — ${esp}`;

  let diaMostrado = st.dia === "semana" ? "Día de Sem" : "Finde";

  if (st.fechaExacta) {
    const [year, month, day] = st.fechaExacta.split("-");
    diaMostrado += ` (${day}/${month})`;
  }

  const turnoTexto =
    st.turno === "dia" ? "Día (10:30 a 18hs)" : "Noche (20:30 a 05hs)";
  document.getElementById("cot-detalle").textContent =
    `${st.personas} pers · ${esp} · ${diaMostrado} · ${turnoTexto}`;

  const itemsEl = document.getElementById("cot-resumen-items");

  let html = lineas
    .map((l) => {
      const partes = l.replace("✅ ", "").replace("🎁 ", "").split(": ");
      const nombre = partes[0];
      const precio = partes.slice(1).join(": ");
      return `<div class="cot-resumen-row"><span>${nombre}</span><strong>${precio}</strong></div>`;
    })
    .join("");

  if (resto > 0) {
    html += `
      <div class="cot-resumen-row" style="margin-top:14px; padding-top:12px; border-top:1px dashed rgba(255,255,255,0.4); color:var(--acento);">
        <span style="font-weight:600;">💳 Plan de Pagos</span>
        <div style="text-align:right;">
          <div style="font-size:0.85rem; font-weight:700;">Anticipo $${anticipo.toLocaleString("es-AR")}</div>
          <div style="font-size:0.75rem;">+ 3 cuotas de $${cuotas.toLocaleString("es-AR")}</div>
        </div>
      </div>
    `;
  } else {
    html += `
      <div class="cot-resumen-row" style="margin-top:14px; padding-top:12px; border-top:1px dashed rgba(255,255,255,0.4); color:var(--acento);">
        <span style="font-weight:600;">💳 Pago Único</span>
        <div style="text-align:right;">
          <div style="font-size:0.85rem; font-weight:700;">$${anticipo.toLocaleString("es-AR")}</div>
        </div>
      </div>
    `;
  }

  itemsEl.innerHTML = html;
}

function enviarWA() {
  const { espacio, total, lineas, anticipo, cuotas, resto } = calcular();
  const st = E[espacio];
  const esp = espacio === "salon" ? "Salón" : "Quinta Completa";
  const dia = st.dia === "semana" ? "Día de Semana" : "Fin de Semana";

  let msg = `🌿 ¡Hola! Armé mi evento en la web de Quinta Las Palmeras.\n\n`;
  msg += `📍 *Espacio elegido:* ${esp}\n`;
  msg += `📅 *Tipo de día:* ${dia}\n`;

  if (st.fechaExacta) {
    const [year, month, day] = st.fechaExacta.split("-");
    msg += `🗓️ *Fecha exacta:* ${day}/${month}/${year}\n`;
  }

  const turnoMsg =
    st.turno === "dia"
      ? "☀️ Día (10:30 a 18:00 hs)"
      : "🌙 Noche (20:30 a 05:00 hs)";
  msg += `⏰ *Horario:* ${turnoMsg}\n`;
  msg += `👥 *Personas:* ${st.personas}\n\n`;
  msg += `*Detalle del presupuesto:*\n${lineas.join("\n")}\n\n`;
  msg += `💰 *Total estimado: $${total.toLocaleString("es-AR")}*\n`;

  if (resto > 0) {
    msg += `💳 *Plan sugerido:* Anticipo de $${anticipo.toLocaleString("es-AR")} y 3 cuotas de $${cuotas.toLocaleString("es-AR")}\n\n`;
    msg += `✅ *Para bloquear la fecha, podés transferir el anticipo al Alias:* QUINTA.PALMERAS\n\n`;
  } else {
    msg += `✅ *Para bloquear la fecha, podés transferir el total al Alias:* QUINTA.PALMERAS\n\n`;
  }

  msg += `¿Me confirman disponibilidad? ¡Gracias!`;

  window.open(
    `https://wa.me/${CONFIG.wa}?text=${encodeURIComponent(msg)}`,
    "_blank",
  );
}

function renderTodo(espacio) {
  renderOpciones(CATERING, `grid-catering-${espacio}`, "catering", espacio);
  renderOpciones(BARRA, `grid-barra-${espacio}`, "barra", espacio);
  renderOpciones(
    MUSICA_PERSONAL,
    `grid-musica-personal-${espacio}`,
    "musicaPersonal",
    espacio,
  );
  renderOpciones(
    juegosDe(espacio),
    `grid-juegos-${espacio}`,
    "juegos",
    espacio,
  );
  renderOpciones(EXTRAS, `grid-extras-${espacio}`, "extras", espacio);
}

document.addEventListener("DOMContentLoaded", () => {
  randomizarGaleria();
  initFiltros();

  renderTodo("salon");
  renderTodo("quinta");
  initSlider("salon");
  initSlider("quinta");
  document.getElementById("bloque-quinta").classList.add("oculto");
  actualizar();

  // Cerrar el resumen si se toca afuera de él
  document.addEventListener("click", (e) => {
    const resumen = document.getElementById("cot-resumen");
    if (!resumen || !resumen.classList.contains("expandido")) return;

    const clickDentro = resumen.contains(e.target);
    if (!clickDentro) {
      toggleResumen();
    }
  });

  document.querySelectorAll('input[type="date"]').forEach((inputFecha) => {
    const hoy = new Date().toISOString().split("T")[0]; // formato YYYY-MM-DD
    inputFecha.setAttribute("min", hoy);
  });
});

async function pagarConMercadoPago() {
  const { anticipo } = calcular();

  const btnPagar = document.getElementById("btn-pagar");
  const contenidoOriginal = btnPagar.innerHTML;

  btnPagar.innerHTML = "⏳ Generando pago...";
  btnPagar.disabled = true;
  btnPagar.style.opacity = "0.7";
  btnPagar.style.cursor = "not-allowed";

  try {
    const respuesta = await fetch("/.netlify/functions/crear-pago", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        total: anticipo,
        descripcion: "Anticipo - Quinta Las Palmeras",
      }),
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
    btnPagar.style.opacity = "1";
    btnPagar.style.cursor = "pointer";
  }
}
