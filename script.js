// Llamamos al cálculo apenas carga la página
document.addEventListener('DOMContentLoaded', calcularTotal);

const checkboxes = document.querySelectorAll('.cot-calc-cb');
const inputsQty = document.querySelectorAll('.cot-calc-qty');
const resumenLista = document.getElementById('cot-resumen-lista');
const totalUI = document.getElementById('cot-total-ui');

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

// Función para compilar el mensaje usando Emojis Nativos
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
  
  // Usamos palabras clave para los emojis de teléfono y billete
  let texto = "E_TELEFONO ¡Hola Quinta Eventos!\n";
  texto += "Estuve viendo la web y armé un presupuesto estimativo para mi evento. E_FIESTA\n\n";
  
  texto += "E_ABAJO *Esto es lo que elegí:*\n";
  texto += lineas.join('\n') + "\n\n";
  
  texto += `E_BILLETE *Total aproximado: $${total.toLocaleString('es-AR')}*\n\n`;
  
  texto += "¿Me cuentan si tienen fechas disponibles y cómo hacemos para ir a conocer la quinta? ¡Mil gracias!";

  let mensajeCodificado = encodeURIComponent(texto);

  // Reemplazamos las palabras clave por los códigos puros de WhatsApp
  mensajeCodificado = mensajeCodificado.replace(/E_TELEFONO/g, "%F0%9F%93%9E"); // 📞
  mensajeCodificado = mensajeCodificado.replace(/E_FIESTA/g, "%F0%9F%8E%89");   // 🎉
  mensajeCodificado = mensajeCodificado.replace(/E_ABAJO/g, "%F0%9F%91%87");    // 👇
  mensajeCodificado = mensajeCodificado.replace(/E_BILLETE/g, "%F0%9F%92%B5");   // 💵
  mensajeCodificado = mensajeCodificado.replace(/E_CHECK/g, "%E2%9C%94%EF%B8%8F"); // ✔️ (Un tilde negro más formal)

  const url = `https://wa.me/${numeroWp}?text=${mensajeCodificado}`;
  window.open(url, '_blank');
}