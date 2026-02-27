// Mock de localStorage: como Jest corre en Node y no en el navegador, localStorage no existe. 
// Lo simulamos para poder probar el login sin que tire error.

let loginModule = require('./core/login.js');

global.localStorage = {
  setItem: jest.fn(),
  getItem: jest.fn(),
  removeItem: jest.fn()
};


test("Login correcto devuelve array vacío", function () {
  let errores = loginModule.login("admin", "1234");
  expect(errores).toEqual([]);
});

test("Usuario vacío devuelve error obligatorio", function () {
  let errores = loginModule.login("", "1234");
  expect(errores).toContain("El usuario es obligatorio");
});

test("Password vacía devuelve error obligatorio", function () {
  let errores = loginModule.login("admin", "");
  expect(errores).toContain("La contraseña es obligatoria");
});

test("Credenciales incorrectas devuelve error", function () {
  let errores = loginModule.login("martina", "0000");
  expect(errores).toContain("Usuario o contraseña incorrectos");
});