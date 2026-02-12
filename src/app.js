/*************************************************************
 * APP.JS
 * Capa de presentación
 * Maneja eventos, DOM y navegación entre pantallas
 * No decide reglas del negocio
 *************************************************************/


/*************************************************************
 * INICIALIZACIÓN DE SELECTS
 *************************************************************/

// SELECT TIPO ANIMAL
const tipoAnimal = ["Perro", "Gato"];
const selectAnimal = document.getElementById("tipoAnimal");

for (let i = 0; i < tipoAnimal.length; i++) {
  const option = document.createElement("option");
  option.value = tipoAnimal[i];
  option.textContent = tipoAnimal[i];
  selectAnimal.appendChild(option);
}

// SELECT SERVICIO
const tipoServicio = ["Consulta Veterinaria ($1500)", "Corte y baño ($1200)"];
const selectServicio = document.getElementById("tipoServicio");

for (let i = 0; i < tipoServicio.length; i++) {
  const option = document.createElement("option");
  option.value = tipoServicio[i];
  option.textContent = tipoServicio[i];
  selectServicio.appendChild(option);
}

// SELECT PROFESIONAL
const profesionales = [
  "Patricia Martinez - Veterinaria clínica",
  "Florencia Perez - Cirujana",
  "Pedro Ramirez - Esteticista"
];

const selectProfesional = document.getElementById("profesional");

for (let i = 0; i < profesionales.length; i++) {
  const option = document.createElement("option");
  option.value = profesionales[i];
  option.textContent = profesionales[i];
  selectProfesional.appendChild(option);
}


/*************************************************************
 * SELECT FECHA
 *************************************************************/

const inputFecha = document.getElementById("fecha");

function formatearFechaYYYYMMDD(date) {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, "0");
  const d = String(date.getDate()).padStart(2, "0");
  return `${y}-${m}-${d}`;
}

function sumarMeses(baseDate, meses) {
  const d = new Date(baseDate);
  d.setMonth(d.getMonth() + meses);
  return d;
}

function configurarRangoFecha() {
  const hoy = new Date();
  hoy.setHours(0, 0, 0, 0);

  const max = sumarMeses(hoy, 2);
  const min = new Date(hoy);
  min.setDate(min.getDate() + 1);

  inputFecha.min = formatearFechaYYYYMMDD(min);
  inputFecha.max = formatearFechaYYYYMMDD(max);
}

configurarRangoFecha();


/*************************************************************
 * SELECT HORARIO
 *************************************************************/

const horarios = [
  "9:00", "9:30", "10:00", "10:30", "11:00", "11:30",
  "12:00", "12:30", "13:00", "13:30", "14:00", "14:30",
  "15:00", "15:30", "16:00", "16:30", "17:00"
];

const selectHora = document.getElementById("hora");

for (let i = 0; i < horarios.length; i++) {
  const option = document.createElement("option");
  option.value = horarios[i];
  option.textContent = horarios[i];
  selectHora.appendChild(option);
}


/*************************************************************
 * SELECT MÉTODO DE PAGO
 *************************************************************/

const metodosDePago = ["Efectivo", "Transferencia", "Web"];
const selectMetodoPago = document.getElementById("metodoPago");

for (let i = 0; i < metodosDePago.length; i++) {
  const option = document.createElement("option");
  option.value = metodosDePago[i];
  option.textContent = metodosDePago[i];
  selectMetodoPago.appendChild(option);
}


/*************************************************************
 * MANEJO DE LA RESERVA
 *************************************************************/

document
  .querySelector("#btnAltaConsulta")
  .addEventListener("click", manejarAltaReserva);

function manejarAltaReserva() {
  let consulta = {
    nombreDueno: document.querySelector("#txtNombreD").value.toLowerCase(),
    telefono: document.querySelector("#txtTel").value,
    email: document.querySelector("#txtEmail").value,
    nombreMascota: document.querySelector("#txtNombreM").value,
    tipoAnimal: document.querySelector("#tipoAnimal").value,
    servicio: document.querySelector("#tipoServicio").value,
    profesional: document.querySelector("#profesional").value,
    fecha: document.querySelector("#fecha").value,
    hora: document.querySelector("#hora").value,
    formaDePago: document.querySelector("#metodoPago").value
  };

  let errores = altaReserva(consulta);

  if (errores.length > 0) {
    alert(errores.join("\n"));
    return;
  }

  alert("Reserva realizada con éxito");
}


/*************************************************************
 * NAVEGACIÓN ENTRE PANTALLAS
 *************************************************************/

function ocultarPantallas() {
  document.getElementById("login").classList.add("oculto");
  document.getElementById("inicio").classList.add("oculto");
  document.getElementById("reservas").classList.add("oculto");
  document.getElementById("listado-turnos-admin").classList.add("oculto");
}

function mostrarLogin() {
  ocultarPantallas();
  document.getElementById("login").classList.remove("oculto");

  // Limpiar mensaje de login
  const mensaje = document.getElementById("mensajeLogin");
  mensaje.textContent = "";
}

function mostrarInicio() {
  ocultarPantallas();
  document.getElementById("inicio").classList.remove("oculto");
}

function mostrarReservas() {
  ocultarPantallas();
  document.getElementById("reservas").classList.remove("oculto");
}

function mostrarListado() {
  ocultarPantallas();
  document.getElementById("listado-turnos-admin").classList.remove("oculto");
}


/*************************************************************
 * NAVBAR
 *************************************************************/

const linksNav = document.querySelectorAll(".menu a");

for (let i = 0; i < linksNav.length; i++) {
  linksNav[i].addEventListener("click", function () {
    const destino = this.getAttribute("href");
    const estaLogueado = localStorage.getItem("usuarioLogueado");

    // Si no está logueado, solo puede ir al login
    if (!estaLogueado && destino !== "#login") {
      mostrarLogin();
      return;
    }

    if (destino === "#inicio") mostrarInicio();
    if (destino === "#reservas") mostrarReservas();
    if (destino === "#login") mostrarLogin();
    if (destino === "#listado-turnos-admin") mostrarListadoReservas();
  });
}


/*************************************************************
 * LISTADO DE TURNOS (ADMIN)
 *************************************************************/

function mostrarListadoReservas() {
  ocultarPantallas();

  const reservas = obtenerReservas();
  const tbody = document.querySelector("#tablaReservas tbody");
  tbody.innerHTML = "";

  if (reservas.length === 0) {
    tbody.innerHTML = `
      <tr>
        <td colspan="8">No hay reservas registradas</td>
      </tr>
    `;
  } else {
    for (let i = 0; i < reservas.length; i++) {
      const r = reservas[i];

      const fila = document.createElement("tr");
      fila.innerHTML = `
        <td>${r.nombreDueno}</td>
        <td>${r.nombreMascota}</td>
        <td>${r.tipoAnimal}</td>
        <td>${r.servicio}</td>
        <td>${r.profesional}</td>
        <td>${r.fecha}</td>
        <td>${r.hora}</td>
        <td>${r.formaDePago}</td>
      `;

      tbody.appendChild(fila);
    }
  }

  document.getElementById("listado-turnos-admin").classList.remove("oculto");
}


/*************************************************************
 * LOGIN
 *************************************************************/

document
  .getElementById("btnLogin")
  .addEventListener("click", manejarLogin);

function manejarLogin() {
  const usuario = document.getElementById("txtUser").value;
  const password = document.getElementById("txtPass").value;

  const errores = login(usuario, password);
  const mensaje = document.getElementById("mensajeLogin");

  if (errores.length > 0) {
    mensaje.textContent = errores.join(" ");
    mensaje.style.color = "red";
    return;
  }

  mensaje.textContent = "Login exitoso";
  mensaje.style.color = "green";

  mostrarHeaderLogueado();
  mostrarInicio();
}


/*************************************************************
 * LOGOUT
 *************************************************************/

document
  .getElementById("btnLogout")
  .addEventListener("click", manejarLogout);

function manejarLogout() {
  localStorage.removeItem("usuarioLogueado");
  mostrarHeaderLogin();
  mostrarLogin();
}


/*************************************************************
 * HEADER
 *************************************************************/

function mostrarHeaderLogin() {
  document.getElementById("menu-login").classList.remove("oculto");
  document.getElementById("menu-logout").classList.add("oculto");
  document.getElementById("menu-admin").classList.add("oculto");
}

function mostrarHeaderLogueado() {
  document.getElementById("menu-login").classList.add("oculto");
  document.getElementById("menu-logout").classList.remove("oculto");
  document.getElementById("menu-admin").classList.remove("oculto");
}


/*************************************************************
 * ESTADO INICIAL
 *************************************************************/

mostrarHeaderLogin();
mostrarLogin();
