// LOGIN.JS
// Lógica de negocio del login
// No maneja pantallas ni DOM

function login(usuario, password) {
  let errores = [];

  if (usuario === "") {
    errores.push("El usuario es obligatorio");
  }

  if (password === "") {
    errores.push("La contraseña es obligatoria");
  }

  if (errores.length > 0) {
    return errores;
  }

  // Usuario hardcodeado para el taller
  if (usuario !== "admin" || password !== "1234") {
    errores.push("Usuario o contraseña incorrectos");
    return errores;
  }

  // Guarda sesión
  localStorage.setItem("usuarioLogueado", "admin");

  return [];
}

module.exports = { login };