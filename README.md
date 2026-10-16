# 🌿 Quinta Las Palmeras

Sitio web oficial y cotizador interactivo de eventos para **Quinta Las Palmeras**, un espacio verde y familiar ubicado en Del Viso, Buenos Aires (Antonio Machado 660). Diseñado para la gestión de alquileres de salón, parque y pileta para eventos de hasta 100 personas.

## 🚀 Características principales
- **Cotizador dinámico en tiempo real:** Permite seleccionar espacio, tipo de día, fecha, cantidad de invitados, servicios adicionales (DJ, catering, fotografía, etc.), juegos y extras, calculando el presupuesto al instante.
- **Integración con WhatsApp:** Envía el desglose completo del presupuesto directamente al chat de consultas con un solo clic.
- **Pasarela de Pagos (Mercado Pago):** Generación automática de link de pago para señas/anticipos mediante Vercel Serverless Functions.
- **Galería interactiva:** Filtros por fotos y videos reales del predio con integración de YouTube.
- **Diseño Responsive (Mobile-First):** Optimizado para celulares con barra fija de presupuesto y en desktop con panel lateral.

## 🛠️ Tecnologías Utilizadas
- **Frontend:** HTML5, CSS3 (Variables CSS, Grid, Flexbox), JavaScript Vanilla.
- **Backend / Serverless:** Vercel Functions (`Node.js`).
- **Pagos:** SDK Oficial de Mercado Pago (`mercadopago`).

## 💳 Pasarela de pagos (Mercado Pago)

- **Código:** `api/crear-pago.js`
- **Configuración:** en Vercel, agregá la variable de entorno `MP_ACCESS_TOKEN` (Project settings → Environment Variables) con el access token de tu cuenta de Mercado Pago.

## 📂 Estructura del Proyecto