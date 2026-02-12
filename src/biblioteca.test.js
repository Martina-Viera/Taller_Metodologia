let biblioteca = require('./core/reservas.js');

test('teléfono válido (099123456) devuelve []', function () {
    expect(biblioteca.validarTelefono("099123456")).toEqual([]);
  });

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

  var errores = biblioteca.validarCamposObligatorios(reserva);

  expect(errores).toEqual(["La cédula es obligatoria"]);
});

test('largo mayor a 9 devuelve error de largo', function () {
    expect(biblioteca.validarTelefono("0991234567")).toEqual([
      "El teléfono debe tener 9 dígitos."
    ]);});


 test("largo menor a 9 -> error de 9 dígitos", function () {
    var errores = biblioteca.validarTelefono("09912345");
    expect(errores).toEqual(["El teléfono debe tener 9 dígitos."]);
    expect(errores.length).toBeGreaterThan(0);
  });

 test("largo mayor a 9 -> error de 9 dígitos", function () {
    var errores = biblioteca.validarTelefono("09912345");
    expect(errores).toEqual(["El teléfono debe tener 9 dígitos."]);
    expect(errores.length).toBeGreaterThan(0);
  });

  test('email con dos @ -> El email debe contener un solo @.', function () {
    var errores = biblioteca.validarEmail("a@@b.com");
    expect(errores).toEqual(["El email debe contener un solo @."]);
  });

  test('email con espacios -> El email no puede contener espacios', function () {
    var errores = biblioteca.validarEmail("a b@c.com");
    expect(errores).toEqual(["El email no puede contener espacios."]);
  });

  test('@ al inicio -> El no tiene un formato valido', function(){
    var error=biblioteca.validarEmail("@unmail.com");
      expect(error).toEqual(["El email no tiene un formato válido."])
  })