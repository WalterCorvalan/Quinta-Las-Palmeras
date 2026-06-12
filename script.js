// --- INICIALIZACIÓN ---
document.addEventListener('DOMContentLoaded', calcularTotal);

// --- LÓGICA DE LOS CARRUSELES DE IMÁGENES ---
let carouselState = {};

function moveCarousel(trackId, direction) {
  const track = document.getElementById(trackId);
  if (!track) return;
  
  if (carouselState[trackId] === undefined) {
    carouselState[trackId] = 0;
  }
  
  const slides = track.querySelectorAll('img');
  const totalSlides = slides.length;
  
  if (totalSlides <= 1) return; 
  
  carouselState[trackId] += direction;
  
  if (carouselState[trackId] >= totalSlides) carouselState[trackId] = 0;
  if (carouselState[trackId] < 0) carouselState[trackId] = totalSlides - 1;
  
  const percentageToMove = carouselState[trackId] * -100;
  track.style.transform = `translateX(${percentageToMove}%)`;
}

// --- LÓGICA DEL COTIZADOR ---
const checkboxes = document.querySelectorAll('.cot-calc-cb');
const inputsQty = document.querySelectorAll('.cot-calc-qty');
const resumenLista = document.getElementById('cot-resumen-lista');
const totalUI = document.getElementById('cot-total-ui');

// Función arreglada: Quita TODOS los checks por defecto y deja solo la promo
function activarPromo() {
  // 1. Desmarcamos todo (Alquiler base, seguro, extras, etc.)
  checkboxes.forEach(cb => cb.checked = false);
  
  // 2. Ponemos todas las cantidades en 0 (mozos, catering, etc.)
  inputsQty.forEach(input => {
    input.value = 0;
    const qtySpanId = `qty-${input.id.replace('input-', '')}`;
    const span = document.getElementById(qtySpanId);
    if(span) span.innerText = 0;
  });

  // 3. Activamos SOLO la casilla de la Súper Promo
  const cbPromo = document.querySelector('input[data-name="Súper Promo Viernes (DJ+Foto+Mobiliario)"]');
  if(cbPromo) cbPromo.checked = true;

  // 4. Recalculamos para actualizar el numerito
  calcularTotal();
}

function updateQty(id, change) {
  const span = document.getElementById(`qty-${id}`);
  const input = document.getElementById(`input-${id}`);
  
  let currentValue = parseInt(input.value) || 0;
  let newValue = currentValue + change;
  if (newValue < 0) newValue = 0; 
  
  span.innerText = newValue;
  input.value = newValue;
  
  calcularTotal();
}

checkboxes.forEach(cb => {
  cb.addEventListener('change', calcularTotal);
});

function calcularTotal() {
  let total = 0;
  let itemsSeleccionados = [];

  checkboxes.forEach(cb => {
    if (cb.checked) {
      const precio = parseInt(cb.getAttribute('data-price'));
      const nombre = cb.getAttribute('data-name');
      total += precio;
      itemsSeleccionados.push({ nombre: nombre, cant: 1, precioTotal: precio });
    }
  });

  inputsQty.forEach(input => {
    const cant = parseInt(input.value);
    if (cant > 0) {
      const precioUnitario = parseInt(input.getAttribute('data-price'));
      const nombre = input.getAttribute('data-name');
      const precioTotal = precioUnitario * cant;
      total += precioTotal;
      itemsSeleccionados.push({ nombre: nombre, cant: cant, precioTotal: precioTotal });
    }
  });

  if (itemsSeleccionados.length === 0) {
    resumenLista.innerHTML = `<div style="text-align: center; color: rgba(255,255,255,0.5); font-size: 0.9rem; margin-top: 20px;">
          Seleccioná opciones a la izquierda para empezar a armar tu evento.
        </div>`;
  } else {
    let htmlResumen = '';
    itemsSeleccionados.forEach(item => {
      let textoNombre = item.cant > 1 ? `${item.cant}x ${item.nombre}` : item.nombre;
      htmlResumen += `
        <div class="cot-resumen-item">
          <span>${textoNombre}</span>
          <strong style="color: var(--acento)">$${item.precioTotal.toLocaleString('es-AR')}</strong>
        </div>
      `;
    });
    resumenLista.innerHTML = htmlResumen;
  }

  totalUI.innerText = `$${total.toLocaleString('es-AR')}`;
}

// --- FUNCIÓN DE WHATSAPP ---
function enviarWhatsApp() {
  let total = 0;
  let lineas = [];

  checkboxes.forEach(cb => {
    if (cb.checked) {
      const precio = parseInt(cb.getAttribute('data-price'));
      const nombre = cb.getAttribute('data-name');
      lineas.push(`E_CHECK ${nombre} ($${precio.toLocaleString('es-AR')})`);
      total += precio;
    }
  });

  inputsQty.forEach(input => {
    const cant = parseInt(input.value);
    if (cant > 0) {
      const precioUnitario = parseInt(input.getAttribute('data-price'));
      const nombre = input.getAttribute('data-name');
      const subtotal = precioUnitario * cant;
      lineas.push(`E_CHECK ${cant} x ${nombre} ($${subtotal.toLocaleString('es-AR')})`);
      total += subtotal;
    }
  });

  if (total === 0) {
    alert('Por favor, seleccioná al menos una opción para cotizar.');
    return;
  }

  const numeroWp = "5493856865979"; 
  
  let texto = "E_TELEFONO ¡Hola Quinta Eventos!\n";
  texto += "Estuve viendo la web y armé un presupuesto estimativo para mi evento. E_FIESTA\n\n";
  
  texto += "E_ABAJO *Esto es lo que elegí:*\n";
  texto += lineas.join('\n') + "\n\n";
  
  texto += `E_BILLETE *Total aproximado: $${total.toLocaleString('es-AR')}*\n\n`;
  
  texto += "¿Me cuentan si tienen fechas disponibles y cómo hacemos para ir a conocer la quinta? ¡Mil gracias!";

  let mensajeCodificado = encodeURIComponent(texto);

  // Inyección de Emojis Hexadecimales MODERNOS para WhatsApp
  mensajeCodificado = mensajeCodificado.replace(/E_TELEFONO/g, "%F0%9F%93%B1"); // 📱 (Celular moderno)
  mensajeCodificado = mensajeCodificado.replace(/E_FIESTA/g, "%F0%9F%A5%82");   // 🥂 (Copas brindando)
  mensajeCodificado = mensajeCodificado.replace(/E_ABAJO/g, "%F0%9F%91%87");    // 👇 (Mano señalando)
  mensajeCodificado = mensajeCodificado.replace(/E_BILLETE/g, "%F0%9F%92%B3");  // 💳 (Tarjeta de crédito / Pago)
  mensajeCodificado = mensajeCodificado.replace(/E_CHECK/g, "%E2%9C%85");       // ✅ (Check verde clásico y vibrante)

  const url = `https://wa.me/${numeroWp}?text=${mensajeCodificado}`;
  window.open(url, '_blank');
}