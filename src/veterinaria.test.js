let veterinaria = require('./core/reservas.js');

//SI LA RESERVA TIENE ERRORES NO SE GUARDA
//Mock de localStorage (necesario para testear alta/guardar/obtener)

beforeEach(() => {
  let store = {};

  global.localStorage = {
    getItem: (key) => (store[key] ? store[key] : null),
    setItem: (key, value) => { store[key] = String(value); },
    removeItem: (key) => { delete store[key]; },
    clear: () => { store = {}; }
  };
});

 test("si validarReserva devuelve errores, NO guarda la reserva", () => {

    // Reserva inválida (varios campos vacíos)
    const reservaInvalida = {
      nombreDueno: "",
      cedula: "",
      nombreMascota: "",
      telefono: "",
      email: "",
      tipoAnimal: "",
      servicio: "",
      profesional: "",
      fecha: "",
      hora: "",
      formaDePago: ""
    };

    const errores = veterinaria.altaReserva(reservaInvalida);

    // Debe devolver errores
    expect(errores.length).toBeGreaterThan(0);

    // No debe haber nada guardado
    const consultas = JSON.parse(localStorage.getItem("consultas")) || [];
    expect(consultas.length).toBe(0);
  });

  //SI LA RESERVA ES VÁLIDA SE GUARDA EN EL LOCALSTORAGE
  tes("si la reserva es válida, se guarda y devuelve []", () => {

  //fijamos la fecha del sistema porque la función validarFecha depende de la fecha actual:
  jest.useFakeTimers();
  jest.setSystemTime(new Date("2026-02-27T12:00:00Z"));

  const reservaValida = {
    nombreDueno: "Ana",
    cedula: "47707443",
    nombreMascota: "Luna",
    telefono: "099123456",
    email: "ana@gmail.com",
    tipoAnimal: "Perro",
    servicio: "Consulta Veterinaria",
    profesional: "Patricia Martinez",
    fecha: "2026-03-10",   // futura y dentro de 2 meses
    hora: "10:30",
    formaDePago: "Efectivo"
  };

  const errores = veterinaria.altaReserva(reservaValida);

  // No debe haber errores
  expect(errores).toEqual([]);

  // Debe haberse guardado en localStorage
  const consultas = JSON.parse(localStorage.getItem("consultas")) || [];
  expect(consultas.length).toBe(1);
  expect(consultas[0].cedula).toBe("47707443");

  jest.useRealTimers();
});

//RESERVA CON FECHA PASADA DEVUELVE ERROR 

test("validarFecha: fecha pasada devuelve error", () => {

  jest.useFakeTimers();
  jest.setSystemTime(new Date("2026-02-27T12:00:00Z")); // fijo fecha de hoy

  const errores = veterinaria.validarFecha("2026-02-20"); // fecha anterior

  expect(errores).toEqual([
    "La fecha debe ser posterior al día de hoy."
  ]);

  jest.useRealTimers();
});

//RESERVA CON FECHA MAYOR A DOS MESES DEVUELVE ERROR

test("validarFecha: fecha mayor a 2 meses devuelve error", () => {

  jest.useFakeTimers();
  jest.setSystemTime(new Date("2026-02-27T12:00:00Z")); // hoy fijo

  const errores = veterinaria.validarFecha("2026-05-05"); // más de 2 meses

  expect(errores).toEqual([
    "La fecha no puede superar los dos meses a partir de hoy."
  ]);

  jest.useRealTimers();
});

// TESTS VALIDAR TELÉFONO

test('teléfono válido (099123456) devuelve []', function () {
  expect(veterinaria.validarTelefono("099123456")).toEqual([]);
});

test("largo menor a 9 -> error de 9 dígitos", function () {
  var errores = veterinaria.validarTelefono("09912345");
  expect(errores).toEqual(["El teléfono debe tener 9 dígitos."]);
  expect(errores.length).toBeGreaterThan(0);
});

test("largo mayor a 9 -> error de 9 dígitos", function () {
  var errores = veterinaria.validarTelefono("09912345678");
  expect(errores).toEqual(["El teléfono debe tener 9 dígitos."]);
  expect(errores.length).toBeGreaterThan(0);
});

test('si es inválido, la condición (errores.length === 0) es falsy', function () {
  var errores = veterinaria.validarTelefono("090123456");
  expect(errores.length === 0).toBeFalsy();
});

test('Teléfono con espacios ("099 123 456") debe ser válido', function () {
  expect(veterinaria.validarTelefono("099 123 456")).toEqual([]);
});

test('Debe dar error si contiene letras', function () {
  var errores = veterinaria.validarTelefono("099ABC456");
  expect(errores).toContain("El teléfono solo puede contener números.");
});

test('Debe dar error si no comienza con 09 (ej. 089...)', function () {
  var errores = veterinaria.validarTelefono("089123456");
  expect(errores).toContain("El teléfono debe comenzar con 09.");
});


// TESTS VALIDAR EMAIL

test('Email sin arroba -> El email debe contener un solo @.', function () {
  var errores = veterinaria.validarEmail("juan.gmail.com");
  expect(errores).toEqual(["El email debe contener un solo @."]);
});

test('email con dos @ -> El email debe contener un solo @.', function () {
  var errores = veterinaria.validarEmail("a@@b.com");
  expect(errores).toEqual(["El email debe contener un solo @."]);
});

test('email con espacios -> El email no puede contener espacios', function () {
  var errores = veterinaria.validarEmail("a b@c.com");
  expect(errores).toEqual(["El email no puede contener espacios."]);
});

test('@ al inicio -> El no tiene un formato valido', function () {
  var error = veterinaria.validarEmail("@unmail.com");
  expect(error).toEqual(["El email no tiene un formato válido."])
})

test('Email sin punto después del @ debe devolver error', function () {
  var errores = veterinaria.validarEmail("juan@gmail");
  expect(errores).toContain("El email debe contener un punto después del @."); //
});

test('Email que termina en punto debe devolver error de dominio', function () {
    var errores = veterinaria.validarEmail("ana@gmail.");
    expect(errores).toContain("El email no tiene un dominio válido."); //
});

// TESTS VALIDAR CÉDULA Y CAMPOS OBLIGATORIOS

test('cedula vacia -> devuelve SOLO el error de cédula', function () {
  var reserva = {
    nombreDueno: "nombre1",
    cedula: "",               // <- vacío
    nombreMascota: "Luna",
    telefono: "099123456",
    email: "ana@gmail.com",
    tipoAnimal: "Perro",
    servicio: "Consulta",
    profesional: "Dr",
    fecha: "2026-03-10",
    hora: "10:30",
    formaDePago: "Efectivo"
  };

  var errores = veterinaria.validarCamposObligatorios(reserva);

  expect(errores).toEqual(["La cédula es obligatoria"]);
});

test('Cédula con 7 dígitos debe devolver error de largo (deben ser 8)', function () {
    var errores = veterinaria.validarCedula("1234567");
    expect(errores).toContain("La cédula debe tener exactamente 8 caracteres.");
});

test('Cédula con 8 dígitos debe ser válida (array vacío)', function () {
    var errores = veterinaria.validarCedula("47707443");
    expect(errores).toEqual([]);
});

