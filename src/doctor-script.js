document.addEventListener('DOMContentLoaded', function() {
    const instituciones = ["Institución A", "Institución B", "Institución C"];
    const btnIngresarDoctor = document.getElementById('btn-ingresar-doctor');
    const doctorModal = document.getElementById('doctorModal');

    const actualizarContadores = () => {
        const doctoresGuardados = JSON.parse(localStorage.getItem('doctores')) || [];
        const contadorDoctores = document.getElementById('contador-doctores');
        if (contadorDoctores) {
            contadorDoctores.innerText = doctoresGuardados.length;
        }
    };

    function openModal(modal) {
        modal.classList.add('show');
        modal.style.display = 'block';
        document.body.classList.add('modal-open');

        const backdrop = document.createElement('div');
        backdrop.className = 'modal-backdrop fade show';
        document.body.appendChild(backdrop);
    }

    function closeModal(modal) {
        modal.classList.remove('show');
        modal.style.display = 'none';
        document.body.classList.remove('modal-open');

        const backdrop = document.querySelector('.modal-backdrop');
        if (backdrop) {
            document.body.removeChild(backdrop);
        }
    }

    if (btnIngresarDoctor && doctorModal) {
        btnIngresarDoctor.addEventListener('click', function() {
            openModal(doctorModal);
        });

        const closeModalButtons = document.querySelectorAll('[data-dismiss="modal"]');
        closeModalButtons.forEach(button => {
            button.addEventListener('click', function() {
                closeModal(doctorModal);
            });
        });
    }

    function cargarInstituciones() {
        const institucionSelects = document.querySelectorAll('select[name="doctor-institucion"]');
        institucionSelects.forEach(select => {
            select.innerHTML = '';
            instituciones.forEach(inst => {
                const option = document.createElement('option');
                option.value = inst;
                option.textContent = inst;
                select.appendChild(option);
            });
        });
    }

    cargarInstituciones();

    const btnAddEmail = document.querySelector('.btn-add-email');
    if (btnAddEmail) {
        btnAddEmail.addEventListener('click', function() {
            const container = document.getElementById('emails-container');
            const newField = container.firstElementChild.cloneNode(true);
            const input = newField.querySelector('input');
            if (input) {
                input.value = '';
            }
            container.appendChild(newField);
        });
    }

    const btnAddTelefono = document.querySelector('.btn-add-telefono');
    if (btnAddTelefono) {
        btnAddTelefono.addEventListener('click', function() {
            const container = document.getElementById('telefonos-container');
            const newField = container.firstElementChild.cloneNode(true);
            const input = newField.querySelector('input');
            if (input) {
                input.value = '';
            }
            container.appendChild(newField);
        });
    }

    const btnAddInstitucion = document.querySelector('.btn-add-institucion');
    if (btnAddInstitucion) {
        btnAddInstitucion.addEventListener('click', function() {
            const container = document.getElementById('instituciones-container');
            const newField = container.firstElementChild.cloneNode(true);
            const select = newField.querySelector('select');
            if (select) {
                select.value = '';
            }
            container.appendChild(newField);
            cargarInstituciones();
        });
    }

    const imagenInput = document.getElementById('doctor-imagen');
    const imagenPrevia = document.getElementById('doctor-imagen-previa');
    if (imagenInput) {
        imagenInput.addEventListener('change', function() {
            const file = this.files[0];
            if (file) {
                const reader = new FileReader();
                reader.onload = function(e) {
                    imagenPrevia.src = e.target.result;
                }
                reader.readAsDataURL(file);
            } else {
                imagenPrevia.src = 'img/predeterminada.jpg';
            }
        });
    }

    function validarCampo(input, mensajeError, validacion) {
        if (!validacion(input.value.trim())) {
            mostrarError(input, mensajeError);
            return false;
        } else {
            quitarError(input);
            return true;
        }
    }

    function validarNombre(nombre) {
        return nombre.length >= 3;
    }

    function validarTelefono(telefono) {
        return telefono.length >= 7;
    }

    function validarEmail(email) {
        const patron = /^[^ ]+@[^ ]+\.[a-z]{2,3}$/;
        return patron.test(email);
    }

    function mostrarError(input, mensaje) {
        const formGroup = input.closest('.form-group');
        if (formGroup) {
            const feedback = formGroup.querySelector('.invalid-feedback');
            if (feedback) {
                feedback.innerText = mensaje;
            }
            input.classList.add('is-invalid');
        }
    }

    function quitarError(input) {
        const formGroup = input.closest('.form-group');
        if (formGroup) {
            input.classList.remove('is-invalid');
        }
    }

    document.querySelectorAll('#doctor-form input, #doctor-form select').forEach(input => {
        input.addEventListener('input', () => {
            switch (input.id || input.name) {
                case 'doctor-nombre':
                case 'doctor-apellido':
                case 'doctor-especialidad':
                    validarCampo(input, `El ${input.placeholder.toLowerCase()} es obligatorio y debe tener al menos 3 caracteres`, validarNombre);
                    break;
                case 'doctor-email':
                    validarCampo(input, 'Por favor, ingresa un correo válido', validarEmail);
                    break;
                case 'doctor-telefono':
                    validarCampo(input, 'El teléfono debe ser válido', validarTelefono);
                    break;
                case 'doctor-institucion':
                    validarCampo(input, 'Por favor, selecciona una institución', valor => valor !== '');
                    break;
            }
        });

        input.addEventListener('blur', () => {
            switch (input.id || input.name) {
                case 'doctor-nombre':
                case 'doctor-apellido':
                case 'doctor-especialidad':
                    validarCampo(input, `El ${input.placeholder.toLowerCase()} es obligatorio y debe tener al menos 3 caracteres`, validarNombre);
                    break;
                case 'doctor-email':
                    validarCampo(input, 'Por favor, ingresa un correo válido', validarEmail);
                    break;
                case 'doctor-telefono':
                    validarCampo(input, 'El teléfono debe ser válido', validarTelefono);
                    break;
                case 'doctor-institucion':
                    validarCampo(input, 'Por favor, selecciona una institución', valor => valor !== '');
                    break;
            }
        });
    });

    const doctorForm = document.getElementById('doctor-form');
    if (doctorForm) {
        doctorForm.onsubmit = function(e) {
            e.preventDefault();

            const nombreValido = validarCampo(document.getElementById('doctor-nombre'), 'El nombre es obligatorio y debe tener al menos 3 caracteres', validarNombre);
            const apellidoValido = validarCampo(document.getElementById('doctor-apellido'), 'El apellido es obligatorio y debe tener al menos 3 caracteres', validarNombre);
            const emails = document.querySelectorAll('input[name="doctor-email"]');
            let emailsValidos = true;
            emails.forEach(email => {
                if (email.value.trim() !== '' && !validarEmail(email.value)) {
                    emailsValidos = false;
                    mostrarError(email, 'Por favor, ingresa un correo válido');
                } else {
                    quitarError(email);
                }
            });
            const telefonos = document.querySelectorAll('input[name="doctor-telefono"]');
            let telefonosValidos = true;
            telefonos.forEach(telefono => {
                if (telefono.value.trim() !== '' && !validarTelefono(telefono.value)) {
                    telefonosValidos = false;
                    mostrarError(telefono, 'El teléfono debe ser válido');
                } else {
                    quitarError(telefono);
                }
            });
            const especialidadValida = validarCampo(document.getElementById('doctor-especialidad'), 'La especialidad es obligatoria', validarNombre);
            const instituciones = document.querySelectorAll('select[name="doctor-institucion"]');
            let institucionesValidas = true;
            instituciones.forEach(institucion => {
                if (institucion.value === '') {
                    institucionesValidas = false;
                    mostrarError(institucion, 'Por favor, selecciona una institución');
                } else {
                    quitarError(institucion);
                }
            });

            if (nombreValido && apellidoValido && emailsValidos && telefonosValidos && especialidadValida && institucionesValidas) {
                const nombre = document.getElementById('doctor-nombre').value;
                const apellido = document.getElementById('doctor-apellido').value;
                const emailValues = Array.from(emails).map(email => email.value).filter(email => email.trim() !== '');
                const telefonoValues = Array.from(telefonos).map(telefono => telefono.value).filter(telefono => telefono.trim() !== '');
                const especialidad = document.getElementById('doctor-especialidad').value;
                const institucionValues = Array.from(instituciones).map(institucion => institucion.value);
                const notas = document.getElementById('doctor-notas').value;
                const ultimaActualizacion = new Date().toLocaleString();
                const actualizadoPor = JSON.parse(sessionStorage.getItem('usuarioActual')).nombre;

                const nuevoDoctor = {
                    nombre,
                    apellido,
                    emails: emailValues,
                    telefonos: telefonoValues,
                    especialidad,
                    instituciones: institucionValues,
                    notas: "",
                    historico: `${ultimaActualizacion}: Creado\n`,
                    ultimaActualizacion,
                    actualizadoPor,
                    visitas: ""
                };

                let doctores = JSON.parse(localStorage.getItem('doctores')) || [];
                doctores.push(nuevoDoctor);
                localStorage.setItem('doctores', JSON.stringify(doctores));

                doctorForm.reset();
                imagenPrevia.src = 'img/predeterminada.jpg';

                closeModal(doctorModal);

                alert('Doctor guardado exitosamente');
                actualizarContadores();
            }
        };
    }

    const btnAddVisita = document.querySelector('.btn-add-visita');
    if (btnAddVisita) {
        btnAddVisita.addEventListener('click', function() {
            const visitasInput = document.getElementById('doctor-visitas');
            const nuevaVisita = prompt('Ingrese la nueva visita:');
            if (nuevaVisita) {
                const nuevaEntrada = `${new Date().toLocaleString()}: ${nuevaVisita}\n`;
                visitasInput.value += nuevaEntrada;
            }
        });
    }

    const btnAddNota = document.querySelector('.btn-add-nota');
    if (btnAddNota) {
        btnAddNota.addEventListener('click', function() {
            const notasInput = document.getElementById('doctor-notas');
            const nuevaNota = prompt('Ingrese la nueva nota:');
            if (nuevaNota) {
                const nuevaEntrada = `${new Date().toLocaleString()}: ${nuevaNota}\n`;
                notasInput.value += nuevaEntrada;
            }
        });
    }

    const tabLinks = document.querySelectorAll('.nav-link');
    const tabPanes = document.querySelectorAll('.tab-pane');

    tabLinks.forEach(link => {
        link.addEventListener('click', function(event) {
            event.preventDefault();

            tabLinks.forEach(link => link.classList.remove('active'));
            tabPanes.forEach(pane => pane.classList.remove('show', 'active'));

            this.classList.add('active');
            const targetPane = document.querySelector(this.getAttribute('href'));
            targetPane.classList.add('show', 'active');
        });
    });

    actualizarContadores();
});