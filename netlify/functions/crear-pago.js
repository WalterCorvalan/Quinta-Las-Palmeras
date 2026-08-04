const { MercadoPagoConfig, Preference } = require('mercadopago');

exports.handler = async (event) => {
  // Solo permitimos peticiones POST
  if (event.httpMethod !== 'POST') {
    return { statusCode: 405, body: 'Method Not Allowed' };
  }

  try {
    const data = JSON.parse(event.body);
    
    // Detectar dinámicamente la URL base del sitio en Netlify
    const baseUrl = event.headers.origin || process.env.URL || 'https://tu-sitio.netlify.app';

    // Conecta con Mercado Pago usando la variable de entorno de Netlify
    const client = new MercadoPagoConfig({ accessToken: process.env.MP_ACCESS_TOKEN });
    const preference = new Preference(client);

    // Crea el link de pago dinámico
    const response = await preference.create({
      body: {
        items: [{
          title: data.descripcion,
          unit_price: Number(data.total),
          quantity: 1,
          currency_id: 'ARS'
        }],
        back_urls: {
          success: baseUrl,
          failure: baseUrl,
          pending: baseUrl
        },
        auto_return: "approved"
      }
    });

    // Le devuelve el link a tu script.js
    return {
      statusCode: 200,
      body: JSON.stringify({ init_point: response.init_point })
    };

  } catch (error) {
    return {
      statusCode: 500,
      body: JSON.stringify({ error: error.message })
    };
  }
};