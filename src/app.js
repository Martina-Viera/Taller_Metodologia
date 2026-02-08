//addEventListener al submit

//querySelector / getElementById

//Construye el objeto reserva

//Llama a altaReserva(reserva)

//Muestra errores o mensaje de éxito

// No decide reglas del negocio


//SELECT TIPO ANIMAL
const tipoAnimal = ["Perro", "Gato"];
const selectAnimal = document.getElementById("tipoAnimal");

for (let i = 0; i < tipoAnimal.length; i++) {
  const tipo = tipoAnimal[i];

  const option = document.createElement("option");
  option.value = tipo;
  option.textContent = tipo;

  selectAnimal.appendChild(option);
}

//SELECT SERVICIO

const tipoServicio =  ["Consulta Veterinaria ($1500)", "Corte y baño ($1200)"];
const selectServicio = document.getElementById("tipoServicio")

for(let i=0; i< tipoServicio.length; i++){
    const servicio = tipoServicio[i];
     
  const option = document.createElement("option");
  option.value = servicio;
  option.textContent = servicio;

  selectServicio.appendChild(option);

}

//SELECT PROFESIONAL

const profesionales = [
  "Patricia Martinez - Veterinaria clínica",
  "Florencia Perez - Cirujana",
  "Pedro Ramirez - Esteticista"
];

const selectProfesional = document.getElementById("profesional");

for (let i = 0; i < profesionales.length; i++) {
  const profesional = profesionales[i];

  const option = document.createElement("option");
  option.value = profesional;
  option.textContent = profesional;

  selectProfesional.appendChild(option);
}

//SELECT FECHA

//cuando quiera leer la fecha
//const fecha = document.getElementById("date").value;
const inputFecha = document.getElementById("fecha");

function formatearFechaYYYYMMDD(date) {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, "0");
  const d = String(date.getDate()).padStart(2, "0");
  return `${y}-${m}-${d}`;
}

// Suma meses “de verdad” (maneja cambios de mes/año)
function sumarMeses(baseDate, meses) {
  const d = new Date(baseDate);
  d.setMonth(d.getMonth() + meses);
  return d;
}

function configurarRangoFecha() {
  const hoy = new Date();
  hoy.setHours(0, 0, 0, 0);

  const max = sumarMeses(hoy, 2);

  // Si querés permitir desde mañana (no hoy), usá esto:
  const min = new Date(hoy);
  min.setDate(min.getDate() + 1);

  inputFecha.min = formatearFechaYYYYMMDD(min);
  inputFecha.max = formatearFechaYYYYMMDD(max);
}

configurarRangoFecha();


//SELECT HORARIO

const horarios = ["9:00", "9:30", "10:00","10:30", "11:00", "11:30", "12:00",
  "12:30", "13:00", "13:30", "14:00", "14:30", "15:00", "15:30", "16:00",
  "16:30", "17:00"];

  const selectHora= document.getElementById("hora")
  for(let i=0; i<horarios.length; i++){
    const hora = horarios[i];

    const option = document.createElement("option");
  option.value = hora;
  option.textContent = hora;

  selectHora.appendChild(option);

  }


//SELECT MÉTODO DE PAGO

const metodosDePago = ["Efectivo", "Transferencia", "Web"];

const selectMetodoPago = document.getElementById("metodoPago");

for (let i = 0; i < metodosDePago.length; i++) {
  const metodoPago = metodosDePago[i];

  const option = document.createElement("option");
  option.value = metodoPago;
  option.textContent = metodoPago;

  selectMetodoPago.appendChild(option);
}

document.querySelector("#btnAltaConsulta").addEventListener("click", manejarAltaReserva);

//MANEJO DE LA RESERVA
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
