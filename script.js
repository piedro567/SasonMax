// 🛒 VARIABLES GLOBALES
let carrito = [];
const precioBase = 200;

// ➕ AGREGAR PRODUCTO AL CARRITO
function agregarProducto(nombre, boton) {
  const cantidad = parseInt(boton.parentElement.querySelector('.cantidad').value);
  if (cantidad <= 0 || isNaN(cantidad)) {
    alert("Por favor ingresa una cantidad válida.");
    return;
  }

  const existente = carrito.find(prod => prod.nombre === nombre);
  if (existente) {
    existente.cantidad += cantidad;
  } else {
    carrito.push({ nombre, cantidad, precio: precioBase });
  }
  actualizarCarrito();
}

// 🔄 ACTUALIZAR CARRITO EN PANTALLA
function actualizarCarrito() {
  const carritoDiv = document.getElementById("carrito-items");
  carritoDiv.innerHTML = "";
  let total = 0;

  carrito.forEach((prod, index) => {
    const subtotal = prod.cantidad * prod.precio;
    total += subtotal;
    carritoDiv.innerHTML += `
      <div class="item-carrito">
        <p>${prod.nombre} - ${prod.cantidad} x $${prod.precio} = $${subtotal}</p>
        <button onclick="eliminarProducto(${index})">Eliminar</button>
      </div>
    `;
  });

  document.getElementById("carrito-total").innerText = "Total: $" + total;
  document.getElementById("contador-carrito").innerText = carrito.length;

  // ✅ Guardar carrito en LocalStorage
  localStorage.setItem("carrito", JSON.stringify(carrito));
}

// ❌ ELIMINAR PRODUCTO DEL CARRITO
function eliminarProducto(index) {
  carrito.splice(index, 1);
  actualizarCarrito();
}

// 📋 ABRIR FORMULARIO MODAL
function abrirFormulario() {
  if (carrito.length === 0) {
    alert("Tu carrito está vacío. Agrega productos antes de finalizar la compra.");
    return;
  }
  const hoy = new Date().toISOString().split("T")[0];
  document.getElementById("fechaEntrega").setAttribute("min", hoy);
  document.getElementById("modal").style.display = "block";
}

// ❌ CERRAR FORMULARIO MODAL
function cerrarFormulario() {
  document.getElementById("modal").style.display = "none";
}

// 🎞️ SLIDER
document.addEventListener("DOMContentLoaded", () => {
  let slideIndex = 0;
  const slides = document.querySelectorAll(".slide");
  const dotsContainer = document.querySelector(".dots");

  slides.forEach((_, i) => {
    const dot = document.createElement("span");
    dot.addEventListener("click", () => showSlide(i));
    dotsContainer.appendChild(dot);
  });

  const dots = document.querySelectorAll(".dots span");

  function showSlide(n) {
    slides.forEach(s => s.classList.remove("active"));
    dots.forEach(d => d.classList.remove("active"));
    slides[n].classList.add("active");
    dots[n].classList.add("active");
    slideIndex = n;
  }

  function nextSlide() {
    slideIndex = (slideIndex + 1) % slides.length;
    showSlide(slideIndex);
  }

  function prevSlide() {
    slideIndex = (slideIndex - 1 + slides.length) % slides.length;
    showSlide(slideIndex);
  }

  document.querySelector(".next").addEventListener("click", nextSlide);
  document.querySelector(".prev").addEventListener("click", prevSlide);

  setInterval(nextSlide, 5000);
  showSlide(slideIndex);
});

// ⚙️ Configuración automática del rango de fechas y recuperación del carrito
window.onload = function() {
  const fechaEntrega = document.getElementById("fechaEntrega");
  const hoy = new Date();
  const maximo = new Date(hoy);
  maximo.setDate(hoy.getDate() + 30);

  // ✅ ahora permite seleccionar el mismo día
  fechaEntrega.min = hoy.toISOString().split("T")[0];
  fechaEntrega.max = maximo.toISOString().split("T")[0];

  // ✅ Recuperar carrito guardado
  const carritoGuardado = localStorage.getItem("carrito");
  if (carritoGuardado) {
    carrito = JSON.parse(carritoGuardado);
    actualizarCarrito();
  }
};

// 📝 Función para armar el mensaje con validaciones estrictas
function construirMensaje() {
  const nombre = document.getElementById("nombreCliente").value.trim();
  const direccion = document.getElementById("direccionCliente").value.trim();
  const telefono = document.getElementById("telefonoCliente").value.trim();
  const fechaEntrega = document.getElementById("fechaEntrega").value;
  const descripcion = document.getElementById("descripcionCliente").value.trim();

  // Validar nombre y dirección
  if (!nombre || nombre.length < 3) {
    alert("Por favor ingresa un nombre válido.");
    return null;
  }
  if (!direccion || direccion.length < 5) {
    alert("Por favor ingresa una dirección válida.");
    return null;
  }

  // Validar teléfono (mínimo 8 dígitos, opcional prefijo +57)
  const regexTelefono = /^(\+57\s?)?\d{8,}$/;
  if (!regexTelefono.test(telefono)) {
    alert("El número de teléfono debe tener al menos 8 dígitos o incluir el prefijo +57.");
    return null;
  }

  // Validar fecha de entrega (solo hoy o dentro de 30 días)
  if (!fechaEntrega) {
    alert("Por favor seleccione una fecha de entrega.");
    return null;
  }
  const hoy = new Date();
  hoy.setHours(0,0,0,0); // normalizar hora
  const fechaSeleccionada = new Date(fechaEntrega);
  const maximo = new Date(hoy);
  maximo.setDate(hoy.getDate() + 30);

  if (fechaSeleccionada < hoy || fechaSeleccionada > maximo) {
    alert("La fecha de entrega debe ser desde hoy hasta dentro de 30 días.");
    return null;
  }

  // Construir mensaje si todo es válido
  let mensaje = `📦 Nuevo Pedido\n\n👤 Nombre: ${nombre}\n🏠 Dirección: ${direccion}\n📞 Teléfono: ${telefono}\n📅 Fecha de entrega: ${fechaEntrega}`;
  if (descripcion) {
    mensaje += `\n📝 Descripción: ${descripcion}`;
  }

  // Agregar productos
  let total = 0;
  mensaje += `\n\n🛒 Productos:\n`;
  carrito.forEach(prod => {
    const subtotal = prod.cantidad * prod.precio;
    total += subtotal;
    mensaje += `- ${prod.nombre}: ${prod.cantidad} x $${prod.precio} = $${subtotal}\n`;
  });
  mensaje += `\n💰 TOTAL: $${total}`;

  return mensaje;
}

// 📲 Enviar por WhatsApp
function enviarWhatsApp() {
  const mensaje = construirMensaje();
  if (!mensaje) return;

  const numeroWhatsApp = "56373393"; // <-- Cambia por TU número con prefijo país
  const urlWhatsApp = `https://wa.me/${numeroWhatsApp}?text=${encodeURIComponent(mensaje)}`;
  window.open(urlWhatsApp, "_blank");
  cerrarFormulario();

  // ✅ Vaciar carrito y limpiar LocalStorage
  carrito = [];
  actualizarCarrito();
  localStorage.removeItem("carrito");
}

// 📲 Enviar por SMS
function enviarSMS() {
  const mensaje = construirMensaje();
  if (!mensaje) return;

  const numeroSMS = "56373393"; // <-- Cambia por TU número local
  const urlSMS = `sms:${numeroSMS}?body=${encodeURIComponent(mensaje)}`;
  window.open(urlSMS, "_blank");
  cerrarFormulario();

  // ✅ Vaciar carrito y limpiar LocalStorage
  carrito = [];
  actualizarCarrito();
  localStorage.removeItem("carrito");
}

// 🔍 BUSCADOR DE PRODUCTOS
document.getElementById("buscador").addEventListener("input", function() {
  const filtro = this.value.toLowerCase();
  const productos = document.querySelectorAll(".producto");

  productos.forEach(prod => {
    const nombre = prod.querySelector("h3").textContent.toLowerCase();
    if (nombre.includes(filtro)) {
      prod.style.display = "";   // muestra con el estilo original
    } else {
      prod.style.display = "none"; // oculta
    }
  });
});


// 📲 Mostrar/ocultar menú de contacto con animación
document.getElementById("btnContacto").addEventListener("click", function(event) {
  event.preventDefault(); 
  const menu = document.getElementById("menuContacto");
  menu.classList.toggle("show"); // usa la clase CSS para animación
});

// ✅ Cerrar el menú si se hace clic fuera
document.addEventListener("click", function(event) {
  const menu = document.getElementById("menuContacto");
  const btn = document.getElementById("btnContacto");
  if (!btn.contains(event.target) && !menu.contains(event.target)) {
    menu.classList.remove("show");
  }
});

