const { MercadoPagoConfig, Preference } = require('mercadopago');

module.exports = async (req, res) => {
  // Solo permitimos peticiones POST
  if (req.method !== 'POST') {
    res.status(405).send('Method Not Allowed');
    return;
  }

  try {
    const data = req.body;

    // Detectar dinámicamente la URL base del sitio en Vercel
    const baseUrl = req.headers.origin || `https://${req.headers.host}`;

    // Conecta con Mercado Pago usando la variable de entorno de Vercel
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
    res.status(200).json({ init_point: response.init_point });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
