# 🌿 Quinta Las Palmeras

Sitio web oficial y cotizador interactivo de eventos para **Quinta Las Palmeras**, un espacio verde y familiar ubicado en Del Viso, Buenos Aires (Antonio Machado 660). Diseñado para la gestión de alquileres de salón, parque y pileta para eventos de hasta 100 personas.

## 🚀 Características principales
- **Cotizador dinámico en tiempo real:** Permite seleccionar espacio, tipo de día, fecha, cantidad de invitados, servicios adicionales (DJ, catering, fotografía, etc.), juegos y extras, calculando el presupuesto al instante.
- **Integración con WhatsApp:** Envía el desglose completo del presupuesto directamente al chat de consultas con un solo clic.
- **Pasarela de Pagos (Mercado Pago):** Generación automática de link de pago para señas/anticipos mediante Netlify Serverless Functions.
- **Galería interactiva:** Filtros por fotos y videos reales del predio con integración de YouTube.
- **Diseño Responsive (Mobile-First):** Optimizado para celulares con barra fija de presupuesto y en desktop con panel lateral.

## 🛠️ Tecnologías Utilizadas
- **Frontend:** HTML5, CSS3 (Variables CSS, Grid, Flexbox), JavaScript Vanilla.
- **Backend / Serverless:** Netlify Functions (`Node.js`).
- **Pagos:** SDK Oficial de Mercado Pago (`mercadopago`).

## 🤖 Bot de WhatsApp (respuestas automáticas)

Bot basado en reglas (sin IA, costo $0) que responde automáticamente a mensajes de WhatsApp con un menú de opciones (Ver planes / Hablar con vendedor / Cotizar).

- **Código:** `netlify/functions/whatsapp-webhook.js`
- **Respuestas editables:** `netlify/functions/bot-respuestas.json` (agregá o modificá palabras clave y textos sin tocar código)

### Configuración (WhatsApp Cloud API de Meta)

1. Creá una app en [developers.facebook.com](https://developers.facebook.com/) y agregá el producto **WhatsApp**.
2. Obtené el `Phone Number ID` y un token de acceso temporal (o permanente con una System User).
3. En Netlify, configurá estas variables de entorno (Site settings → Environment variables):
   - `WHATSAPP_TOKEN`: token de acceso de la API de WhatsApp Cloud.
   - `WHATSAPP_PHONE_ID`: ID del número de WhatsApp emisor.
   - `WHATSAPP_VERIFY_TOKEN`: string inventado por vos, para validar el webhook.
4. En el panel de Meta, configurá el webhook con la URL `https://<tu-sitio>.netlify.app/.netlify/functions/whatsapp-webhook` y el mismo `WHATSAPP_VERIFY_TOKEN`.
5. Suscribite al campo `messages` del webhook.

Para editar el menú o agregar nuevas palabras clave, modificá `netlify/functions/bot-respuestas.json` y hacé deploy.

## 📇 Mini CRM de chats

Cada mensaje entrante y cada respuesta del bot se guarda automáticamente (Netlify Blobs) y se puede ver en un panel web simple.

- **Panel:** `https://<tu-sitio>.netlify.app/crm.html`
- **API:** `netlify/functions/crm-chats.js`
- **Storage:** `netlify/functions/lib/chats-store.js` (Netlify Blobs, sin servicios externos)

Funcionalidades: lista de conversaciones ordenada por más reciente, detalle con historial completo de mensajes, y marcar cada chat como "atendido" o reabrirlo.

### Configuración

1. En Netlify, agregá la variable de entorno `CRM_PASSWORD` con la contraseña que vas a usar para entrar al panel.
2. Entrá a `/crm.html`, ingresá esa contraseña y listo.

La contraseña es compartida (no hay usuarios individuales); si necesitás varios accesos con permisos distintos en el futuro, se puede migrar a Supabase Auth u otro proveedor.

## 📂 Estructura del Proyecto