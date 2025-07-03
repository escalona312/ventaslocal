let ventas = [];
    let contadorVentas = 0;
    
    function mostrarAlerta(mensaje, tipo = 'success') {
      const alertContainer = document.getElementById('alertContainer');
      const alert = document.createElement('div');
      alert.className = `alert alert-${tipo}`;
      alert.textContent = mensaje;
      
      alertContainer.appendChild(alert);
      
      setTimeout(() => {
        alert.remove();
      }, 3000);
    }
    
    function generarFactura() {
      if (ventas.length === 0) {
        mostrarAlerta('No hay ventas registradas para generar factura.', 'error');
        return;
      }
      
      const totalVentas = ventas.reduce((sum, venta) => sum + venta.total, 0);
      const fechaActual = new Date().toLocaleDateString('es-ES');
      
      // Crear una lista detallada de productos
      const resumenProductos = {};
      ventas.forEach(venta => {
        if (resumenProductos[venta.producto]) {
          resumenProductos[venta.producto].cantidad += venta.cantidad;
          resumenProductos[venta.producto].total += venta.total;
        } else {
          resumenProductos[venta.producto] = {
            cantidad: venta.cantidad,
            total: venta.total
          };
        }
      });
      
      // Crear el HTML de la factura
      const facturaHTML = `
        <!DOCTYPE html>
        <html>
        <head>
          <meta charset="UTF-8">
          <title>Factura de Venta</title>
          <style>
            body { font-family: Arial, sans-serif; margin: 20px; }
            .header { text-align: center; margin-bottom: 30px; }
            .logo { font-size: 24px; font-weight: bold; color: #333; }
            .fecha { margin-top: 10px; color: #666; }
            .info-empresa { margin-bottom: 30px; }
            .table { width: 100%; border-collapse: collapse; margin-bottom: 20px; }
            .table th, .table td { border: 1px solid #ddd; padding: 10px; text-align: left; }
            .table th { background-color: #f2f2f2; font-weight: bold; }
            .total-row { font-weight: bold; background-color: #f9f9f9; }
            .total-section { margin-top: 30px; text-align: right; }
            .total-final { font-size: 20px; font-weight: bold; color: #333; }
            .footer { margin-top: 50px; text-align: center; color: #666; font-size: 12px; }
          </style>
        </head>
        <body>
          <div class="header">
            <div class="logo">🛍️ TIENDA DE ROPA</div>
            <div class="fecha">Fecha: ${fechaActual}</div>
          </div>
          
          <div class="info-empresa">
            <h3>FACTURA DE VENTA</h3>
            <p><strong>Número de Factura:</strong> ${String(Date.now()).slice(-6)}</p>
          </div>
          
          <table class="table">
            <thead>
              <tr>
                <th>Producto</th>
                <th>Cantidad</th>
                <th>Total</th>
              </tr>
            </thead>
            <tbody>
              ${Object.entries(resumenProductos).map(([producto, datos]) => `
                <tr>
                  <td>${producto}</td>
                  <td>${datos.cantidad}</td>
                  <td>${datos.total.toLocaleString()}</td>
                </tr>
              `).join('')}
              <tr class="total-row">
                <td colspan="2"><strong>TOTAL GENERAL</strong></td>
                <td><strong>${totalVentas.toLocaleString()}</strong></td>
              </tr>
            </tbody>
          </table>
          
          <div class="total-section">
            <div class="total-final">Total a Pagar: ${totalVentas.toLocaleString()}</div>
          </div>
          
          <div class="footer">
            <p>¡Gracias por su compra!</p>
            <p>Productos vendidos: ${ventas.reduce((sum, venta) => sum + venta.cantidad, 0)} unidades</p>
          </div>
        </body>
        </html>
      `;
      
      // Crear una nueva ventana para la factura
      const ventanaFactura = window.open('', '_blank', 'width=800,height=600');
      ventanaFactura.document.write(facturaHTML);
      ventanaFactura.document.close();
      
      // Enfocar la ventana y abrir el diálogo de impresión
      ventanaFactura.focus();
      setTimeout(() => {
        ventanaFactura.print();
      }, 500);
      
      mostrarAlerta('Factura generada correctamente. Se abrió en una nueva ventana.');
    }
    
    function mostrarTotal() {
      const totalVentas = ventas.reduce((sum, venta) => sum + venta.total, 0);
      
      if (ventas.length === 0) {
        mostrarAlerta('No hay ventas registradas para calcular el total.', 'error');
        return;
      }
      
      // Crear una lista detallada de productos
      const resumenProductos = {};
      ventas.forEach(venta => {
        if (resumenProductos[venta.producto]) {
          resumenProductos[venta.producto].cantidad += venta.cantidad;
          resumenProductos[venta.producto].total += venta.total;
        } else {
          resumenProductos[venta.producto] = {
            cantidad: venta.cantidad,
            total: venta.total
          };
        }
      });
      
      let detalleProductos = Object.entries(resumenProductos)
        .map(([producto, datos]) => `${datos.cantidad}x ${producto} = ${datos.total.toLocaleString()}`)
        .join('\n');
      
      alert(`📊 RESUMEN TOTAL DE VENTAS 📊\n\n${detalleProductos}\n\n💰 TOTAL GENERAL: ${totalVentas.toLocaleString()}\n📦 Total de productos vendidos: ${ventas.reduce((sum, venta) => sum + venta.cantidad, 0)}`);
    }
    
    function agregarVenta() {
      const inputProducto = document.getElementById("producto");
      const producto = inputProducto.value.trim();
      const monto = parseFloat(document.getElementById("monto").value);
      const cantidad = parseInt(document.getElementById("cantidad").value) || 1;
      
      if (!producto || isNaN(monto) || monto <= 0) {
        mostrarAlerta("Por favor selecciona un producto y escribe un monto válido.", 'error');
        return;
      }
      
      if (cantidad <= 0) {
        mostrarAlerta("La cantidad debe ser mayor a 0.", 'error');
        return;
      }
      
      const total = monto * cantidad;
      const fecha = new Date().toLocaleString('es-ES');
      
      const venta = {
        id: ++contadorVentas,
        producto,
        cantidad,
        precioUnitario: monto,
        total,
        fecha
      };
      
      ventas.push(venta);
      actualizarTabla();
      actualizarEstadisticas();
      limpiarCampos();
      
      mostrarAlerta(`Venta agregada: ${cantidad}x ${producto} - ${total.toLocaleString()}`);
    }
    
    function eliminarVenta(id) {
      if (confirm('¿Estás seguro de que quieres eliminar esta venta?')) {
        ventas = ventas.filter(venta => venta.id !== id);
        actualizarTabla();
        actualizarEstadisticas();
        mostrarAlerta('Venta eliminada correctamente.');
      }
    }
    
    function actualizarTabla() {
      const tbody = document.getElementById('listaVentas');
      
      if (ventas.length === 0) {
        tbody.innerHTML = '<tr><td colspan="6" class="no-data">No hay ventas registradas</td></tr>';
        return;
      }
      
      tbody.innerHTML = ventas.map(venta => `
        <tr>
          <td>${venta.producto}</td>
          <td>${venta.cantidad}</td>
          <td>${venta.precioUnitario.toLocaleString()}</td>
          <td>${venta.total.toLocaleString()}</td>
          <td class="datetime">${venta.fecha}</td>
          <td>
            <button class="delete-btn" onclick="eliminarVenta(${venta.id})">
              🗑️ Eliminar
            </button>
          </td>
        </tr>
      `).join('');
    }
    
    function actualizarEstadisticas() {
      const totalVentas = ventas.reduce((sum, venta) => sum + venta.total, 0);
      const cantidadVentas = ventas.length;
      const promedioVenta = cantidadVentas > 0 ? totalVentas / cantidadVentas : 0;
      
      document.getElementById('totalVentas').textContent = `${totalVentas.toLocaleString()}`;
      document.getElementById('cantidadVentas').textContent = cantidadVentas;
      document.getElementById('promedioVenta').textContent = `${Math.round(promedioVenta).toLocaleString()}`;
    }
    
    function limpiarCampos() {
      document.getElementById("producto").value = "";
      document.getElementById("monto").value = "";
      document.getElementById("cantidad").value = "1";
    }
    
    function limpiarTodo() {
      if (ventas.length === 0) {
        mostrarAlerta('No hay ventas para limpiar.', 'error');
        return;
      }
      
      if (confirm('¿Estás seguro de que quieres eliminar todas las ventas?')) {
        ventas = [];
        contadorVentas = 0;
        actualizarTabla();
        actualizarEstadisticas();
        mostrarAlerta('Todas las ventas han sido eliminadas.');
      }
    }
    
    // Permitir agregar venta con Enter
    document.addEventListener('keypress', function(e) {
      if (e.key === 'Enter') {
        agregarVenta();
      }
    });
    
    // Inicializar
    actualizarEstadisticas();