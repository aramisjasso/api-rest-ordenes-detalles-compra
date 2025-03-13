const BASE_URL = 'http://localhost:3000/orders'; // Ajusta la URL según el endpoint

async function makeRequest(method, endpoint, body = null) {
  const url = `${BASE_URL}${endpoint}`;
  const options = {
    method,
    headers: {
      'Content-Type': 'application/json',
    },
  };

  if (body) {
    options.body = JSON.stringify(body);
  }

  try {
    const response = await fetch(url, options);
    const data = await response.json();
    showResponse(data);
  } catch (error) {
    showResponse({ error: error.message });
  }
}

function showResponse(data) {
  const responseContainer = document.getElementById('response');
  responseContainer.textContent = JSON.stringify(data, null, 2);
}

document.getElementById('getOrders').addEventListener('click', () => {
  makeRequest('GET', '/');
});

document.getElementById('getOrderById').addEventListener('click', () => {
  const orderId = document.getElementById('orderId').value;
  if (orderId) makeRequest('GET', `/${orderId}`);
});

document.getElementById('createOrder').addEventListener('click', () => {
  const body = {
    clienteId: '12345',
    fechaPedido: new Date().toISOString(),
    total: 1200,
    estado: 'Pendiente',
    productos: [
      {
        nombre: 'Teclado Mecánico',
        productoId: 'P456',
        cantidad: 1,
        precioUnitario: 1200
      }
    ],
    estadoEnvio: {
      estadoActual: 'Preparando',
      fechaActualizacion: null,
      ubicacionActual: 'Almacén central'
    }
  };

  makeRequest('POST', '/', body);
});

document.getElementById('updateOrder').addEventListener('click', () => {
  const orderId = document.getElementById('updateOrderId').value;
  const body = {
    total: 2400,
    productos: [
      {
        nombre: 'Teclado Mecánico',
        productoId: 'P456',
        cantidad: 2,
        precioUnitario: 1200
      }
    ],
    estado: 'Pendiente'
  };

  if (orderId) makeRequest('PUT', `/${orderId}`, body);
});

document.getElementById('deleteOrder').addEventListener('click', () => {
  const orderId = document.getElementById('deleteOrderId').value;
  if (orderId) makeRequest('DELETE', `/${orderId}`);
});
