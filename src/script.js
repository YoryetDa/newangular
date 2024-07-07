document.addEventListener('DOMContentLoaded', function() {
    // Variables globales
    const usuariosIniciales = [
        { nombre: "Juan", apellido: "Perez", correo: "juan.perez@example.com", contrasena: "Password123!", rol: "admin" },
        { nombre: "Ana", apellido: "Gomez", correo: "ana.gomez@example.com", contrasena: "AnaGomez456$", rol: "user" }
    ];

    // Funciones de almacenamiento
    const cargarDatos = (clave, iniciales) => {
        const datosGuardados = localStorage.getItem(clave);
        return datosGuardados ? JSON.parse(datosGuardados) : iniciales;
    };

    const guardarDatos = (clave, datos) => {
        localStorage.setItem(clave, JSON.stringify(datos));
    };

    // Cargar datos
    let usuarios = cargarDatos('usuarios', usuariosIniciales);

    if (!localStorage.getItem('usuarios')) {
        guardarDatos('usuarios', usuariosIniciales);
    }

    // Validaciones
    const validarCorreo = correo => /^[^ ]+@[^ ]+\.[a-z]{2,3}$/.test(correo);
    const validarContrasena = contrasena => /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*\W).{8,}$/.test(contrasena);
    const validarNombreApellido = nombreApellido => /^[a-zA-Z]{3,}$/.test(nombreApellido);

    const mostrarError = (input, mensaje) => {
        const formGroup = input.closest('.form-group');
        if (formGroup) {
            const feedback = formGroup.querySelector('.invalid-feedback');
            if (feedback) feedback.innerText = mensaje;
            input.classList.add('is-invalid');
        }
    };

    const quitarError = input => {
        const formGroup = input.closest('.form-group');
        if (formGroup) input.classList.remove('is-invalid');
    };

    const validarCampo = (input, validacion, mensajeError) => {
        if (!validacion(input.value)) {
            mostrarError(input, mensajeError);
            return false;
        } else {
            quitarError(input);
            return true;
        }
    };

    // Eventos de validación en tiempo real
    document.querySelectorAll('#register-form input, #profile-form input').forEach(input => {
        input.addEventListener('input', () => {
            switch (input.id) {
                case 'register-nombre':
                case 'profile-nombre':
                    validarCampo(input, validarNombreApellido, 'El nombre debe tener al menos 3 caracteres y no puede contener números ni caracteres especiales');
                    break;
                case 'register-apellido':
                case 'profile-apellido':
                    validarCampo(input, validarNombreApellido, 'El apellido debe tener al menos 3 caracteres y no puede contener números ni caracteres especiales');
                    break;
                case 'register-email':
                case 'profile-email':
                    validarCampo(input, validarCorreo, 'Por favor, ingresa un correo válido (por ejemplo, user@example.com)');
                    break;
                case 'register-password':
                case 'profile-password':
                    validarCampo(input, validarContrasena, 'La contraseña debe tener al menos 8 caracteres, una letra mayúscula, un número y un carácter especial');
                    break;
            }
        });

        input.addEventListener('blur', () => {
            switch (input.id) {
                case 'register-nombre':
                case 'profile-nombre':
                    validarCampo(input, validarNombreApellido, 'El nombre debe tener al menos 3 caracteres y no puede contener números ni caracteres especiales');
                    break;
                case 'register-apellido':
                case 'profile-apellido':
                    validarCampo(input, validarNombreApellido, 'El apellido debe tener al menos 3 caracteres y no puede contener números ni caracteres especiales');
                    break;
                case 'register-email':
                case 'profile-email':
                    validarCampo(input, validarCorreo, 'Por favor, ingresa un correo válido (por ejemplo, user@example.com)');
                    break;
                case 'register-password':
                case 'profile-password':
                    validarCampo(input, validarContrasena, 'La contraseña debe tener al menos 8 caracteres, una letra mayúscula, un número y un carácter especial');
                    break;
            }
        });
    });

    const actualizarContadores = () => {
        const doctoresGuardados = JSON.parse(localStorage.getItem('doctores')) || [];
        const institucionesGuardadas = JSON.parse(localStorage.getItem('instituciones')) || [];
        document.getElementById('contador-doctores').innerText = doctoresGuardados.length;
        document.getElementById('contador-instituciones').innerText = institucionesGuardadas.length;
    };

    const renderizarUsuarios = () => {
        const usuariosLista = document.getElementById('usuarios-lista');
        usuariosLista.innerHTML = '';
        usuarios.forEach((usuario, index) => {
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>${usuario.nombre}</td>
                <td>${usuario.apellido}</td>
                <td>${usuario.correo}</td>
                <td>${usuario.rol}</td>
                <td>
                    <button class="btn btn-warning btn-editar" data-index="${index}">Editar</button>
                    <button class="btn btn-danger btn-eliminar" data-index="${index}">Eliminar</button>
                </td>
            `;
            usuariosLista.appendChild(row);
        });

        document.querySelectorAll('.btn-editar').forEach(btn => {
            btn.addEventListener('click', function() {
                const index = this.getAttribute('data-index');
                editarUsuario(index);
            });
        });

        document.querySelectorAll('.btn-eliminar').forEach(btn => {
            btn.addEventListener('click', function() {
                const index = this.getAttribute('data-index');
                eliminarUsuario(index);
            });
        });
    };

    const editarUsuario = (index) => {
        const usuario = usuarios[index];
        sessionStorage.setItem('usuarioEditar', JSON.stringify(usuario));
        window.location.href = 'profile.html';
    };

    const eliminarUsuario = (index) => {
        if (confirm('¿Estás seguro de que deseas eliminar este usuario?')) {
            usuarios.splice(index, 1);
            guardarDatos('usuarios', usuarios);
            renderizarUsuarios();
        }
    };

    // Manejar el envío del formulario de registro
    const registerForm = document.getElementById('register-form');
    if (registerForm) {
        registerForm.onsubmit = (e) => {
            e.preventDefault();

            const nombre = document.getElementById('register-nombre').value;
            const apellido = document.getElementById('register-apellido').value;
            const correo = document.getElementById('register-email').value;
            const contrasena = document.getElementById('register-password').value;
            const rol = document.getElementById('register-rol') ? document.getElementById('register-rol').value : 'user';

            let valid = true;

            if (!validarNombreApellido(nombre)) {
                mostrarError(document.getElementById('register-nombre'), 'El nombre debe tener al menos 3 caracteres y no puede contener números ni caracteres especiales');
                valid = false;
            } else {
                quitarError(document.getElementById('register-nombre'));
            }

            if (!validarNombreApellido(apellido)) {
                mostrarError(document.getElementById('register-apellido'), 'El apellido debe tener al menos 3 caracteres y no puede contener números ni caracteres especiales');
                valid = false;
            } else {
                quitarError(document.getElementById('register-apellido'));
            }

            if (!validarCorreo(correo)) {
                mostrarError(document.getElementById('register-email'), 'Por favor, ingresa un correo válido (por ejemplo, user@example.com)');
                valid = false;
            } else {
                quitarError(document.getElementById('register-email'));
            }

            if (!validarContrasena(contrasena)) {
                mostrarError(document.getElementById('register-password'), 'La contraseña debe tener al menos 8 caracteres, una letra mayúscula, un número y un carácter especial');
                valid = false;
            } else {
                quitarError(document.getElementById('register-password'));
            }

            if (valid) {
                usuarios.push({ nombre, apellido, correo, contrasena, rol });
                guardarDatos('usuarios', usuarios);
                alert('¡Registro exitoso! Por favor, inicia sesión.');
                window.location.href = 'index.html';
            }
        };
    }

    // Manejar el envío del formulario de inicio de sesión
    const loginForm = document.getElementById('login-form');
    if (loginForm) {
        loginForm.onsubmit = (e) => {
            e.preventDefault();

            const correo = document.getElementById('login-email').value;
            const contrasena = document.getElementById('login-password').value;

            let valid = true;

            if (!validarCorreo(correo)) {
                mostrarError(document.getElementById('login-email'), 'Por favor, ingresa un correo válido (por ejemplo, user@example.com)');
                valid = false;
            } else {
                quitarError(document.getElementById('login-email'));
            }

            if (contrasena === "") {
                mostrarError(document.getElementById('login-password'), 'La contraseña no puede estar vacía');
                valid = false;
            } else {
                quitarError(document.getElementById('login-password'));
            }

            if (valid) {
                const usuario = usuarios.find(user => user.correo === correo && user.contrasena === contrasena);
                if (usuario) {
                    sessionStorage.setItem('usuarioActual', JSON.stringify(usuario));
                    window.location.href = 'dashboard.html';
                } else {
                    alert('Correo o contraseña incorrectos');
                }
            }
        };
    }

    // Mostrar/ocultar contraseña
    const mostrarContrasenaCheckbox = document.getElementById('mostrarContrasena');
    const passwordInput = document.getElementById('login-password');
    if (mostrarContrasenaCheckbox && passwordInput) {
        mostrarContrasenaCheckbox.addEventListener('change', function() {
            passwordInput.type = mostrarContrasenaCheckbox.checked ? 'text' : 'password';
        });
    }

    // Cargar datos en el dashboard
    if (window.location.pathname.endsWith('dashboard.html')) {
        const usuarioActual = JSON.parse(sessionStorage.getItem('usuarioActual'));
        if (usuarioActual) {
            document.getElementById('usuario-nombre').innerText = `${usuarioActual.nombre} ${usuarioActual.apellido}`;
            document.getElementById('usuario-rol').innerText = usuarioActual.rol;
            document.getElementById('usuario-rol-navbar').innerText = usuarioActual.rol;
            // Mostrar/Ocultar botón "Ingresar Doctor" basado en el rol del usuario
            const btnIngresarDoctor = document.getElementById('btn-ingresar-doctor');
            const btnIngresarInstitucion = document.getElementById('btn-ingresar-institucion');
            if (usuarioActual.rol !== 'admin') {
                if (btnIngresarDoctor) btnIngresarDoctor.style.display = 'none';
                if (btnIngresarInstitucion) btnIngresarInstitucion.style.display = 'none';
            } else {
                document.getElementById('admin-section').style.display = 'block';
            }
            actualizarContadores();
            renderizarUsuarios();
        } else {
            window.location.href = 'index.html';
        }
    }

    // Manejar el envío del formulario de perfil
    const profileForm = document.getElementById('profile-form');
    if (profileForm) {
        const usuarioActual = JSON.parse(sessionStorage.getItem('usuarioActual'));
        if (usuarioActual) {
            document.getElementById('profile-nombre').value = usuarioActual.nombre;
            document.getElementById('profile-apellido').value = usuarioActual.apellido;
            document.getElementById('profile-email').value = usuarioActual.correo;
            document.getElementById('profile-password').value = usuarioActual.contrasena;

            profileForm.onsubmit = (e) => {
                e.preventDefault();

                const nombre = document.getElementById('profile-nombre').value;
                const apellido = document.getElementById('profile-apellido').value;
                const correo = document.getElementById('profile-email').value;
                const contrasena = document.getElementById('profile-password').value;

                let valid = true;

                if (!validarNombreApellido(nombre)) {
                    mostrarError(document.getElementById('profile-nombre'), 'El nombre debe tener al menos 3 caracteres y no puede contener números ni caracteres especiales');
                    valid = false;
                } else {
                    quitarError(document.getElementById('profile-nombre'));
                }

                if (!validarNombreApellido(apellido)) {
                    mostrarError(document.getElementById('profile-apellido'), 'El apellido debe tener al menos 3 caracteres y no puede contener números ni caracteres especiales');
                    valid = false;
                } else {
                    quitarError(document.getElementById('profile-apellido'));
                }

                if (!validarCorreo(correo)) {
                    mostrarError(document.getElementById('profile-email'), 'Por favor, ingresa un correo válido (por ejemplo, user@example.com)');
                    valid = false;
                } else {
                    quitarError(document.getElementById('profile-email'));
                }

                if (!validarContrasena(contrasena)) {
                    mostrarError(document.getElementById('profile-password'), 'La contraseña debe tener al menos 8 caracteres, una letra mayúscula, un número y un carácter especial');
                    valid = false;
                } else {
                    quitarError(document.getElementById('profile-password'));
                }

                if (valid) {
                    const oldCorreo = usuarioActual.correo;

                    usuarioActual.nombre = nombre;
                    usuarioActual.apellido = apellido;
                    usuarioActual.correo = correo;
                    usuarioActual.contrasena = contrasena;

                    const index = usuarios.findIndex(user => user.correo === oldCorreo);
                    if (index !== -1) {
                        usuarios[index] = usuarioActual;
                    }

                    sessionStorage.setItem('usuarioActual', JSON.stringify(usuarioActual));
                    guardarDatos('usuarios', usuarios);
                    alert('¡Perfil actualizado!');
                    window.location.href = 'dashboard.html';
                }
            };
        } else {
            window.location.href = 'index.html';
        }
    }

    const btnRegistrarUsuario = document.getElementById('btn-registrar-usuario');
    if (btnRegistrarUsuario) {
        btnRegistrarUsuario.addEventListener('click', () => {
            window.location.href = 'register.html';
        });
    }
});
