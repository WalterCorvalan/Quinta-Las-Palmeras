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

## 🤖 Bot de WhatsApp y mini CRM (armados, inactivos)

El código de un bot de respuestas automáticas de WhatsApp y un panel CRM para ver esas conversaciones está en el repo (`api/whatsapp-webhook.js`, `api/crm-chats.js`, `crm.html`), pero **no está activo**: nunca se cargaron las credenciales necesarias. Sin el bot conectado, el CRM queda siempre vacío porque depende de que el webhook vaya guardando los mensajes entrantes.

Si en algún momento lo quieren activar:

1. Creá una app en [developers.facebook.com](https://developers.facebook.com/), agregá el producto **WhatsApp** y obtené el `Phone Number ID` y un token de acceso.
2. En Vercel, agregá las variables de entorno:
   - `WHATSAPP_TOKEN`: token de acceso de la API de WhatsApp Cloud.
   - `WHATSAPP_PHONE_ID`: ID del número de WhatsApp emisor.
   - `WHATSAPP_VERIFY_TOKEN`: string inventado por vos, para validar el webhook.
   - `CRM_PASSWORD`: contraseña para entrar a `/crm.html`.
3. En el panel de Meta, configurá el webhook con la URL `https://<tu-sitio>.vercel.app/api/whatsapp-webhook` y el mismo `WHATSAPP_VERIFY_TOKEN`, y suscribite al campo `messages`.
4. El storage de chats usa **Upstash Redis** (ya está instalado como integración de Vercel en este proyecto — las variables `KV_REST_API_URL` / `KV_REST_API_TOKEN` ya están cargadas).

Preguntas, precios, paquetes y límite de respuestas del bot son editables en `api/lib/bot-respuestas.json`, sin tocar código.

## 📂 Estructura del Proyecto