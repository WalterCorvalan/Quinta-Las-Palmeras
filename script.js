/* ══════════════════════════════════════
   QUINTA LAS PALMERAS — script.js
   ══════════════════════════════════════ */

/* ── CONFIGURACIÓN DE PRECIOS Y OPCIONES ── */
const CONFIG = {
  wa: "5491159895267",
  precioCopaPp: 800, // Costo adicional por persona si elige copas
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

const JUEGOS = [
  {
    id: "metegol",
    icon: "⚽",
    nombre: "Metegol",
    precio: 15000,
    pp: false,
    desc: "Alquiler por evento",
  },
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
const E = {
  espacio: "salon",
  dia: "semana",
  fechaExacta: "",
  turno: "dia",
  personas: 40,
  usaCopas: false,
  catering: new Set(),
  barra: new Set(),
  musicaPersonal: new Set(),
  premioGanado: null,
  juegos: new Set(),
  // 👇 Le sacamos 'shimer' para que ya no aparezca tildado y gratis
  extras: new Set(["parrilla", "heladera", "apoya_torta"]),
};

function getPrecioItem(item) {
  if (item.id === "dj") {
    return E.turno === "dia" ? 550000 : 650000;
  }
  if (item.id === "mozos") {
    const cantidadMozos = Math.ceil(E.personas / 20); // Redondea para arriba: 50/20 = 2.5 -> 3 mozos
    return cantidadMozos * 70000;
  }
  return item.precio;
}

function toggleCopas() {
  E.usaCopas = !E.usaCopas;
  const card = document.getElementById("card-copas");
  const icon = document.getElementById("copas-icon");
  const num = document.getElementById("cap-vasos-copas");
  const label = document.getElementById("copas-label");

  if (E.usaCopas) {
    card.classList.add("activo");
    icon.textContent = "🍷";
    num.textContent = `+$${(CONFIG.precioCopaPp * E.personas).toLocaleString("es-AR")}`;
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
   BANNER PROMO DINÁMICO
   ══════════════════════════ */

/* ══════════════════════════
   LÓGICA DE LA RULETA
   ══════════════════════════ */
const premiosRuleta = [
  { id: 'candybar', nombre: 'Candy Bar', index: 0, peso: 12 },
  { id: null,       nombre: '¡Casi! Seguí participando', index: 1, peso: 30 },
  { id: 'shimer',   nombre: 'Panel Shimer', index: 2, peso: 12 },
  { id: 'metegol',  nombre: 'Metegol', index: 3, peso: 16 },
  { id: null,       nombre: '¡Ups! No hay premio', index: 4, peso: 18 },
  { id: 'chispas',  nombre: 'Chispas Frías', index: 5, peso: 12 }
];

function elegirGanadorPonderado() {
  const pesoTotal = premiosRuleta.reduce((acc, p) => acc + p.peso, 0);
  let rand = Math.random() * pesoTotal;
  for (const premio of premiosRuleta) {
    if (rand < premio.peso) return premio;
    rand -= premio.peso;
  }
  return premiosRuleta[premiosRuleta.length - 1]; // fallback
}

let giroActual = 0;

function girarRuleta() {
  // Bloqueo: si ya jugó antes, no dejar girar de nuevo
  if (localStorage.getItem('ruletaJugada')) {
    mostrarPremio(JSON.parse(localStorage.getItem('ruletaPremio')));
    return;
  }

  const btn = document.getElementById('btn-girar');
  btn.disabled = true;
  btn.innerHTML = "Girando...";

  const ruleta = document.getElementById('ruleta');
  const ganador = elegirGanadorPonderado();

  const anguloCentro = ganador.index * 60 + 30;
  const rotacionTarget = 360 - anguloCentro;
  const vueltasExtra = 1800;
  const offsetRestante = rotacionTarget - (giroActual % 360);
  const giroTotal = giroActual + vueltasExtra + (offsetRestante < 0 ? 360 + offsetRestante : offsetRestante);

  giroActual = giroTotal;
  ruleta.style.transform = `rotate(${giroTotal}deg)`;

  setTimeout(() => {
    mostrarPremio(ganador);
    btn.innerHTML = "¡Ruleta Girada!";

    // Guardar resultado para que no pueda volver a jugar
    localStorage.setItem('ruletaJugada', 'true');
    localStorage.setItem('ruletaPremio', JSON.stringify(ganador));
  }, 4000);
}

function initRuletaGuardada() {
  if (!localStorage.getItem('ruletaJugada')) return;

  const ganador = JSON.parse(localStorage.getItem('ruletaPremio'));
  const btn = document.getElementById('btn-girar');

  // Dejamos la rueda apuntando al resultado guardado, sin animación
  const anguloCentro = ganador.index * 60 + 30;
  const ruleta = document.getElementById('ruleta');
  ruleta.style.transition = 'none';
  ruleta.style.transform = `rotate(${360 - anguloCentro}deg)`;

  btn.disabled = true;
  btn.innerHTML = "Ya jugaste 🎉";

  mostrarPremio(ganador);

  // Aplicamos el premio de nuevo al estado E (por si el usuario recargó y perdió el estado)
  if (ganador.id === 'candybar') E.extras.add('candybar');
  if (ganador.id === 'shimer') E.extras.add('shimer');
  if (ganador.id === 'metegol') E.juegos.add('metegol');
  if (ganador.id === 'chispas') E.extras.add('chispas');
  E.premioGanado = ganador;
}

function mostrarPremio(ganador) {
  const resEl = document.getElementById("ruleta-resultado");
  resEl.classList.remove("oculto");

  if (ganador.id) {
    resEl.innerHTML = `🎉 ¡Ganaste <strong>${ganador.nombre} Gratis</strong>! Ya lo sumamos a tu cotización.`;

    // Guardamos el premio y lo marcamos automáticamente en las opciones
    E.premioGanado = ganador;
    if (ganador.id === "candybar") E.extras.add("candybar");
    if (ganador.id === "shimer") E.extras.add("shimer");
    if (ganador.id === "metegol") E.juegos.add("metegol");
    if (ganador.id === "chispas") E.extras.add("chispas");

    // Refrescamos la vista para que el botón muestre "Incluido" o "Gratis"
    renderOpciones(EXTRAS, "grid-extras", "extras");
    renderOpciones(JUEGOS, "grid-juegos", "juegos");
    actualizar();
  } else {
    resEl.innerHTML = `😅 <strong>${ganador.nombre}</strong>. ¡Animate a armar tu evento igual!`;
  }
}

/* ══════════════════════════
   GALERÍA — filtros por espacio
   ══════════════════════════ */
const ultimasElegidas = {};

function aplicarFiltroGaleria(f) {
  const items = document.querySelectorAll(".galeria-item");
  if (f !== "todo") {
    items.forEach((item) =>
      item.classList.toggle("oculto", item.dataset.espacio !== f),
    );
    return;
  }
  items.forEach((item) => item.classList.add("oculto"));
  const grupos = {};
  items.forEach((item) => {
    if (item.classList.contains("es-video")) return;
    const espacio = item.dataset.espacio;
    (grupos[espacio] = grupos[espacio] || []).push(item);
  });
  Object.entries(grupos).forEach(([espacio, arr]) => {
    let candidatos = arr;
    if (arr.length > 1) {
      candidatos = arr.filter((item) => item !== ultimasElegidas[espacio]);
    }
    const elegida = candidatos[Math.floor(Math.random() * candidatos.length)];
    elegida.classList.remove("oculto");
    ultimasElegidas[espacio] = elegida;
  });
  document
    .querySelectorAll(".es-video")
    .forEach((v) => v.classList.remove("oculto"));
}

/* ══════════════════════════
   GALERÍA — Mezclar fotos al azar
   ══════════════════════════ */
function randomizarGaleria() {
  const grid = document.getElementById("galeria-grid");
  if (!grid) return;

  // 1. Obtenemos todos los elementos de la galería
  const items = Array.from(grid.querySelectorAll(".galeria-item"));

  // 2. Buscamos el video y guardamos su posición original (index)
  const videoItem = items.find((item) => item.classList.contains("es-video"));
  const videoIndex = items.indexOf(videoItem);

  // 3. Filtramos para quedarnos solo con las imágenes (excluimos el video)
  let imagenes = items.filter((item) => !item.classList.contains("es-video"));

  // 4. Mezclamos las imágenes de forma aleatoria (Algoritmo de Fisher-Yates)
  for (let i = imagenes.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [imagenes[i], imagenes[j]] = [imagenes[j], imagenes[i]];
  }

  // 5. Vaciamos la grilla
  grid.innerHTML = "";

  // 6. Volvemos a insertar el video en su posición fija dentro del array mezclado
  if (videoItem && videoIndex > -1) {
    imagenes.splice(videoIndex, 0, videoItem);
  }

  // 7. Agregamos todos los elementos de nuevo al HTML
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
  const pasos = Array.from(document.querySelectorAll(".cot-paso"));
  const idx = pasos.indexOf(elActual.closest(".cot-paso"));
  const siguiente = pasos[idx + 1];
  if (siguiente) {
    setTimeout(
      () => siguiente.scrollIntoView({ behavior: "smooth", block: "start" }),
      300,
    );
  }
}

function setEspacio(tipo) {
  E.espacio = tipo;
  document
    .getElementById("opc-salon")
    .classList.toggle("activo", tipo === "salon");
  document
    .getElementById("opc-quinta")
    .classList.toggle("activo", tipo === "quinta");
  actualizar();
  try {
    avanzarPaso(
      document.getElementById(tipo === "salon" ? "opc-salon" : "opc-quinta"),
    );
  } catch (e) {
    console.warn(e);
  }
}

function setDia(tipo) {
  E.dia = tipo;
  document
    .getElementById("opc-semana")
    .classList.toggle("activo", tipo === "semana");
  document
    .getElementById("opc-finde")
    .classList.toggle("activo", tipo === "finde");
  actualizar();
  try {
    avanzarPaso(
      document.getElementById(tipo === "semana" ? "opc-semana" : "opc-finde"),
    );
  } catch (e) {
    console.warn(e);
  }
}

function setFecha() {
  E.fechaExacta = document.getElementById("fecha-exacta").value;
  actualizar();
  try {
    avanzarPaso(document.getElementById("fecha-exacta"));
  } catch (e) {
    console.warn(e);
  }
}

function setTurno(tipo) {
  E.turno = tipo;
  document
    .getElementById("turno-dia")
    .classList.toggle("activo", tipo === "dia");
  document
    .getElementById("turno-noche")
    .classList.toggle("activo", tipo === "noche");
  renderOpciones(MUSICA_PERSONAL, "grid-musica-personal", "musicaPersonal");
  actualizar();
  try {
    avanzarPaso(
      document.getElementById(tipo === "salon" ? "opc-salon" : "opc-quinta"),
    );
  } catch (e) {
    console.warn(e);
  }
}

function renderOpciones(items, gridId, setKey) {
  const grid = document.getElementById(gridId);
  if (!grid) return;
  grid.innerHTML = items
    .map((item) => {
      let p = "";
      const precioReal = getPrecioItem(item);
      if (precioReal === 0 && !item.pp) {
        p = "Incluido";
      } else {
        p = item.pp
          ? `$${(item.precio_pp * E.personas).toLocaleString("es-AR")} (×${E.personas})`
          : `$${precioReal.toLocaleString("es-AR")}`;
      }

      return `
      <div class="opc-card ${E[setKey].has(item.id) ? "activo" : ""}"
            onclick="toggleOpc('${item.id}','${setKey}','${gridId}')">
        <div class="opc-check">✓</div>
        <span class="opc-icon">${item.icon}</span>
        <div class="opc-nombre">${item.nombre}</div>
        <div class="opc-precio">${p}</div>
        <div class="opc-desc">${item.desc}</div>
      </div>
    `;
    })
    .join("");
}

function toggleOpc(id, setKey, gridId) {
  E[setKey].has(id) ? E[setKey].delete(id) : E[setKey].add(id);

  let dataset = CATERING;
  if (setKey === "barra") dataset = BARRA;
  else if (setKey === "musicaPersonal") dataset = MUSICA_PERSONAL;
  else if (setKey === "juegos") dataset = JUEGOS;
  else if (setKey === "extras") dataset = EXTRAS;

  renderOpciones(dataset, gridId, setKey);
  actualizar();
}

function initSlider() {
  const slider = document.getElementById("slider-personas");
  if (!slider) return;
  slider.addEventListener("input", () => {
    E.personas = parseInt(slider.value);
    document.getElementById("personas-num").textContent = E.personas;
    document.getElementById("cap-sillas").textContent = E.personas;
    document.getElementById("cap-mesas").textContent = Math.ceil(
      E.personas / 8,
    ); // 8 sillas por mesa
    document.getElementById("personas-icon").textContent =
      E.personas <= 20 ? "👨‍👩‍👧" : E.personas <= 50 ? "👨‍👩‍👧‍👦" : "🎉";

    // Si las copas están activas, actualizar su precio dinámicamente según la cantidad de personas
    if (E.usaCopas) {
      document.getElementById("cap-vasos-copas").textContent =
        `+$${(CONFIG.precioCopaPp * E.personas).toLocaleString("es-AR")}`;
    }

    // Recargar todas las grillas que dependen del slider de personas
    renderOpciones(CATERING, "grid-catering", "catering");
    renderOpciones(BARRA, "grid-barra", "barra");
    renderOpciones(MUSICA_PERSONAL, "grid-musica-personal", "musicaPersonal");
    renderOpciones(JUEGOS, "grid-juegos", "juegos");
    renderOpciones(EXTRAS, "grid-extras", "extras");
    actualizar();
  });
}

function calcular() {
  let baseAlquiler = 0;
  let nombreAlquiler = "";
  const nombreEspacio = E.espacio === "salon" ? "Salón" : "Quinta Completa";

  // --- PRECIOS PARA SOLO SALÓN ---
  if (E.espacio === "salon") {
    if (E.dia === "semana" && E.turno === "dia") {
      baseAlquiler = 350000;
      nombreAlquiler = `Salón (Día de Sem. - De Día)`;
    }
    if (E.dia === "semana" && E.turno === "noche") {
      baseAlquiler = 450000;
      nombreAlquiler = `Salón (Día de Sem. - De Noche)`;
    }
    if (E.dia === "finde" && E.turno === "dia") {
      baseAlquiler = 550000;
      nombreAlquiler = `Salón (Fin de Sem. - De Día)`;
    }
    if (E.dia === "finde" && E.turno === "noche") {
      baseAlquiler = 650000;
      nombreAlquiler = `Salón (Fin de Sem. - De Noche)`;
    }
  }

  // --- PRECIOS PARA QUINTA COMPLETA ---
  if (E.espacio === "quinta") {
    if (E.dia === "semana" && E.turno === "dia") {
      baseAlquiler = 1000000;
      nombreAlquiler = `Quinta (Día de Sem. - De Día)`;
    }
    if (E.dia === "semana" && E.turno === "noche") {
      baseAlquiler = 1250000;
      nombreAlquiler = `Quinta (Día de Sem. - De Noche)`;
    }
    if (E.dia === "finde" && E.turno === "dia") {
      baseAlquiler = 1350000;
      nombreAlquiler = `Quinta (Fin de Sem. - De Día)`;
    }
    if (E.dia === "finde" && E.turno === "noche") {
      baseAlquiler = 1500000;
      nombreAlquiler = `Quinta (Fin de Sem. - De Noche)`;
    }
  }

  let costoPersonasExtra = 0;
  if (E.personas > 40) {
    costoPersonasExtra = (E.personas - 40) * 25000;
  }

  let total = baseAlquiler + costoPersonasExtra;
  let itemsDesglose = [];

  itemsDesglose.push({
    nombre: `Alquiler base: ${nombreAlquiler}`,
    precio: baseAlquiler,
  });

  if (costoPersonasExtra > 0) {
    itemsDesglose.push({
      nombre: `Adicional por excedente (${E.personas - 40} invitados extra)`,
      precio: costoPersonasExtra,
    });
  }

  if (E.usaCopas) {
    const costoCopas = CONFIG.precioCopaPp * E.personas;
    total += costoCopas;
    itemsDesglose.push({
      nombre: `Adicional de copas (${E.personas} pers.)`,
      precio: costoCopas,
    });
  }

  const addItems = (items, set) =>
    items.forEach((item) => {
      if (!set.has(item.id)) return;
      const precioUnit = getPrecioItem(item);
      let m = item.pp ? item.precio_pp * E.personas : precioUnit;

      let nombreMostrado = item.nombre;

      // APLICAR DESCUENTO DE LA RULETA (Con validación segura)
      if (E.premioGanado !== null && E.premioGanado.id === item.id) {
        m = 0; // Lo hace gratis
        nombreMostrado += " (🎁 GRATIS por Ruleta)";
      } else if (item.id === "dj") {
        nombreMostrado += E.turno === "dia" ? " (De Día)" : " (De Noche)";
      } else if (item.id === "mozos") {
        nombreMostrado += ` (${Math.ceil(E.personas / 20)} mozos)`;
      }

      total += m;
      itemsDesglose.push({ nombre: nombreMostrado, precio: m });
    });

  addItems(CATERING, E.catering);
  addItems(BARRA, E.barra);
  addItems(MUSICA_PERSONAL, E.musicaPersonal);
  addItems(JUEGOS, E.juegos);
  addItems(EXTRAS, E.extras);

  itemsDesglose.sort((a, b) => b.precio - a.precio);

  const lineas = itemsDesglose.map((item) => {
    const labelPrecio =
      item.precio === 0
        ? "Incluido"
        : `$${item.precio.toLocaleString("es-AR")}`;
    return `✅ ${item.nombre}: ${labelPrecio}`;
  });

  // --- LÓGICA DE PROMO DJ + FOTÓGRAFO ---
  if (E.musicaPersonal.has("dj") && E.musicaPersonal.has("fotografia")) {
    const precioDJ = E.turno === "dia" ? 550000 : 650000;
    const precioFoto = 450000;
    // Vemos cuánta plata hay que descontarle para que el combo quede en $850.000 exactos
    const descuentoDjFoto = precioDJ + precioFoto - 850000;

    total -= descuentoDjFoto;
    lineas.push(
      `🎁 Promo DJ + Fotógrafo aplicada: -$${descuentoDjFoto.toLocaleString("es-AR")}`,
    );
  }

  // Paquete Promo Automático General (Seña Fija)
  const esPromo =
    E.espacio === "quinta" &&
    E.dia === "finde" &&
    E.personas === 60 &&
    E.musicaPersonal.has("dj") &&
    E.musicaPersonal.has("fotografia");
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
  const { total, lineas, anticipo, cuotas, resto } = calcular();
  const totalFmt = `$${total.toLocaleString("es-AR")}`;

  const barEl = document.getElementById("cot-total-bar");
  const panelEl = document.getElementById("cot-total");
  if (barEl) barEl.textContent = totalFmt;
  if (panelEl) panelEl.textContent = totalFmt;

  const esp = E.espacio === "salon" ? "Salón" : "Quinta";
  let diaMostrado = E.dia === "semana" ? "Día de Sem" : "Finde";

  if (E.fechaExacta) {
    const [year, month, day] = E.fechaExacta.split("-");
    diaMostrado += ` (${day}/${month})`;
  }

  const turnoTexto =
    E.turno === "dia" ? "Día (10:30 a 18hs)" : "Noche (20:30 a 05hs)";
  document.getElementById("cot-detalle").textContent =
    `${E.personas} pers · ${esp} · ${diaMostrado} · ${turnoTexto}`;

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
  const { total, lineas, anticipo, cuotas, resto } = calcular();
  const esp = E.espacio === "salon" ? "Salón" : "Quinta Completa";
  const dia = E.dia === "semana" ? "Día de Semana" : "Fin de Semana";

  let msg = `🌿 ¡Hola! Armé mi evento en la web de Quinta Las Palmeras.\n\n`;
  msg += `📍 *Espacio elegido:* ${esp}\n`;
  msg += `📅 *Tipo de día:* ${dia}\n`;

  if (E.fechaExacta) {
    const [year, month, day] = E.fechaExacta.split("-");
    msg += `🗓️ *Fecha exacta:* ${day}/${month}/${year}\n`;
  }

  const turnoMsg =
    E.turno === "dia"
      ? "☀️ Día (10:30 a 18:00 hs)"
      : "🌙 Noche (20:30 a 05:00 hs)";
  msg += `⏰ *Horario:* ${turnoMsg}\n`;
  msg += `👥 *Personas:* ${E.personas}\n\n`;
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

function activarPromo() {
  setEspacio("quinta");
  setDia("finde");

  const slider = document.getElementById("slider-personas");
  if (slider) {
    slider.value = 60;
    slider.dispatchEvent(new Event("input"));
  }

  // Agregamos el combo de dj + fotografía
  E.musicaPersonal = new Set(["combo_dj_foto", "parlante"]);
  E.juegos = new Set();
  E.extras = new Set(["parrilla", "heladera", "apoya_torta", "shimer"]);
  E.catering = new Set();
  E.barra = new Set();

  renderOpciones(CATERING, "grid-catering", "catering");
  renderOpciones(BARRA, "grid-barra", "barra");
  renderOpciones(MUSICA_PERSONAL, "grid-musica-personal", "musicaPersonal");
  renderOpciones(JUEGOS, "grid-juegos", "juegos");
  renderOpciones(EXTRAS, "grid-extras", "extras");
  actualizar();

  document.getElementById("cotizador")?.scrollIntoView({ behavior: "smooth" });
}

document.addEventListener("DOMContentLoaded", () => {
  randomizarGaleria();
  initFiltros();
  renderOpciones(CATERING, "grid-catering", "catering");
  renderOpciones(BARRA, "grid-barra", "barra");
  renderOpciones(MUSICA_PERSONAL, "grid-musica-personal", "musicaPersonal");
  renderOpciones(JUEGOS, "grid-juegos", "juegos");
  renderOpciones(EXTRAS, "grid-extras", "extras");
  initSlider();
  actualizar();
  initRuletaGuardada()

  // Cerrar el resumen si se toca afuera de él
  document.addEventListener("click", (e) => {
    const resumen = document.getElementById("cot-resumen");
    if (!resumen || !resumen.classList.contains("expandido")) return;

    const clickDentro = resumen.contains(e.target);
    if (!clickDentro) {
      toggleResumen();
    }
  });

  const inputFecha = document.getElementById('fecha-exacta');
  if (inputFecha) {
    const hoy = new Date().toISOString().split('T')[0]; // formato YYYY-MM-DD
    inputFecha.setAttribute('min', hoy);
  }
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
