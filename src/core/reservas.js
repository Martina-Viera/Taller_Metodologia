//ALTA CONSULTA





function altaReserva(reserva) {
  var errores = validarReserva(reserva);

  if (errores.length > 0) {
    return false;
  }

  guardarReserva(reserva);
  return true;
}

function guardarReserva(reserva) {
  let consultas = JSON.parse(localStorage.getItem("consultas")) || [];
  consultas.push(reserva);
  localStorage.setItem("consultas", JSON.stringify(consultas));
}




// FUNCIÓN GENERAL
function validarReserva(reserva) {
  var errores = [];

  errores = errores.concat(validarCamposObligatorios(reserva));
  errores = errores.concat(validarTelefono(reserva.telefono));
  errores = errores.concat(validarEmail(reserva.email));
  errores = errores.concat(validarFecha(reserva.fecha));
   errores = errores.concat(validarDiaHabil(reserva.fecha));

  return errores;
}


//VALIDACIÓN CAMPOS OBLIGATORIOS
function validarCamposObligatorios(reserva) {
  var errores = [];

  if (reserva.nombreDueno === "") {
    errores.push("El nombre del dueño es obligatorio.");
  }

  if (reserva.nombreMascota === "") {
    errores.push("El nombre de la mascota es obligatorio.");
  }

  if (reserva.telefono === "") {
    errores.push("El teléfono es obligatorio.");
  }

  if (reserva.email === "") {
    errores.push("El email es obligatorio.");
  }

  return errores;
}


//vALIDACIÓN TELÉFONO

function validarTelefono(telefono) {
  var errores = [];

  // 1) Eliminar espacios
  telefono = telefono.split(" ").join("");

  // 2) Verificar largo
  if (telefono.length !== 9) {
    errores.push("El teléfono debe tener 9 dígitos.");
    return errores;
  }

  // 3) Verificar que todos sean números
  for (var i = 0; i < telefono.length; i++) {
    var caracter = telefono.charAt(i);

    if (caracter < '0' || caracter > '9') {
      errores.push("El teléfono solo puede contener números.");
      return errores;
    }
  }

  // 4) Verificar que empiece con 09
  if (telefono.charAt(0) !== '0' || telefono.charAt(1) !== '9') {
    errores.push("El teléfono debe comenzar con 09.");
    return errores;
  }

  // 5) Verificar prefijos válidos (091–099)
  var tercerDigito = telefono.charAt(2);

  if (tercerDigito < '1' || tercerDigito > '9') {
    errores.push("El prefijo del teléfono no es válido.");
    return errores;
  }

  return errores;
}


//VALIDAR MAIL 

function validarEmail(email) {
  var errores = [];

  // 1) No vacío
  if (email === "") {
    errores.push("El email es obligatorio.");
    return errores;
  }

  // 2) No debe tener espacios
  for (var i = 0; i < email.length; i++) {
    if (email.charAt(i) === " ") {
      errores.push("El email no puede contener espacios.");
      return errores;
    }
  }

  // 3) Debe tener un solo @
  var cantidadArrobas = 0;
  for (var i = 0; i < email.length; i++) {
    if (email.charAt(i) === "@") {
      cantidadArrobas++;
    }
  }

  if (cantidadArrobas !== 1) {
    errores.push("El email debe contener un solo @.");
    return errores;
  }

  var posicionArroba = email.indexOf("@");

  // 4) @ no puede estar al inicio ni al final
  if (posicionArroba === 0 || posicionArroba === email.length - 1) {
    errores.push("El email no tiene un formato válido.");
    return errores;
  }

  // 5) Debe haber un punto después del @
  var posicionPunto = email.indexOf(".", posicionArroba);

  if (posicionPunto === -1) {
    errores.push("El email debe contener un punto después del @.");
    return errores;
  }

  // 6) El punto no puede ser el último carácter
  if (posicionPunto === email.length - 1) {
    errores.push("El email no tiene un dominio válido.");
    return errores;
  }

  return errores;
}

//VALIDAR FECHA DE RESERVA NO SUPERIROR A DOS MESES

function validarFecha(fecha) {
  var errores = [];

  if (fecha === "") {
    errores.push("La fecha es obligatoria.");
    return errores;
  }

  // Fecha seleccionada (00:00 para comparar solo fechas)
  var fechaSeleccionada = new Date(fecha + "T00:00:00");

  // Hoy (00:00)
  var hoy = new Date();
  hoy.setHours(0, 0, 0, 0);

  // 1) Debe ser futura
  if (fechaSeleccionada <= hoy) {
    errores.push("La fecha debe ser posterior al día de hoy.");
    return errores;
  }

  // 2) Máximo 2 meses a futuro
  var fechaMaxima = new Date(hoy);
  fechaMaxima.setMonth(fechaMaxima.getMonth() + 2);

  if (fechaSeleccionada > fechaMaxima) {
    errores.push("La fecha no puede superar los dos meses a partir de hoy.");
    return errores;
  }

  return errores;
}

//VALIDAR DÍAS HÁBILES

function validarDiaHabil(fecha) {
  var errores = [];

  if (fecha === "") {
    return errores; // la obligatoriedad ya se valida en otra función
  }

  var fechaSeleccionada = new Date(fecha + "T00:00:00");
  var diaSemana = fechaSeleccionada.getDay();

  // 0 = domingo, 6 = sábado
  if (diaSemana === 0 || diaSemana === 6) {
    errores.push("Solo se permiten reservas de lunes a viernes.");
  }

  return errores;
}

