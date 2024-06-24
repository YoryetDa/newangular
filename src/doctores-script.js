document.addEventListener('DOMContentLoaded', function() {
    const instituciones = ["Institución A", "Institución B", "Institución C"];
    let doctores = cargarDoctores();
    let editIndex = null; // Variable para rastrear el índice de edición

    if (!localStorage.getItem('doctores')) {
        localStorage.setItem('doctores', JSON.stringify(doctores));
    }

    const guardarDoctores = () => {
        localStorage.setItem('doctores', JSON.stringify(doctores));
        actualizarContadores();
    };

    const actualizarContadores = () => {
        const doctoresGuardados = JSON.parse(localStorage.getItem('doctores')) || [];
        const contadorDoctores = document.getElementById('contador-doctores');
        if (contadorDoctores) {
            contadorDoctores.innerText = doctoresGuardados.length;
        }
    };

    const renderizarDoctores = () => {
        const lista = document.getElementById('doctores-lista');
        if (!lista) return;

        lista.innerHTML = '';
        doctores.forEach((doctor, index) => {
            const row = document.createElement('tr');

            row.innerHTML = `
                <td>${doctor.nombre || ''}</td>
                <td>${doctor.apellido || ''}</td>
                <td>${(doctor.emails || []).join(', ')}</td>
                <td>${(doctor.telefonos || []).join(', ')}</td>
                <td>${doctor.especialidad || ''}</td>
                <td>${(doctor.instituciones || []).join(', ')}</td>
                <td>${doctor.notas || ''}</td>
                <td>${doctor.visitas || ''}</td>
                <td>
                    <button class="btn btn-info btn-ver" data-index="${index}">Ver</button>
                    <button class="btn btn-warning btn-editar" data-index="${index}">Editar</button>
                    <button class="btn btn-danger btn-eliminar" data-index="${index}">Eliminar</button>
                </td>
            `;

            lista.appendChild(row);
        });

        document.querySelectorAll('.btn-ver').forEach(btn => {
            btn.addEventListener('click', function() {
                const index = this.getAttribute('data-index');
                verDoctor(index);
            });
        });

        document.querySelectorAll('.btn-editar').forEach(btn => {
            btn.addEventListener('click', function() {
                const index = this.getAttribute('data-index');
                editarDoctor(index);
            });
        });

        document.querySelectorAll('.btn-eliminar').forEach(btn => {
            btn.addEventListener('click', function() {
                const index = this.getAttribute('data-index');
                eliminarDoctor(index);
            });
        });
    };

    const cargarDoctorEnFormulario = (doctor) => {
        document.getElementById('doctor-nombre').value = doctor.nombre;
        document.getElementById('doctor-apellido').value = doctor.apellido;

        const emailsContainer = document.getElementById('emails-container');
        emailsContainer.innerHTML = '';
        doctor.emails.forEach(email => {
            const emailField = document.createElement('div');
            emailField.className = 'input-group mb-2';
            emailField.innerHTML = `
                <input type="email" class="form-control" name="doctor-email" placeholder="Correo Electrónico" value="${email}">
                <div class="input-group-append">
                    <button class="btn btn-outline-secondary btn-add-email" type="button">+</button>
                </div>
                <div class="invalid-feedback">Por favor, ingresa un correo válido</div>
            `;
            emailsContainer.appendChild(emailField);
        });

        const telefonosContainer = document.getElementById('telefonos-container');
        telefonosContainer.innerHTML = '';
        doctor.telefonos.forEach(telefono => {
            const telefonoField = document.createElement('div');
            telefonoField.className = 'input-group mb-2';
            telefonoField.innerHTML = `
                <input type="text" class="form-control" name="doctor-telefono" placeholder="Teléfono" value="${telefono}">
                <div class="input-group-append">
                    <button class="btn btn-outline-secondary btn-add-telefono" type="button">+</button>
                </div>
                <div class="invalid-feedback">El teléfono debe ser válido</div>
            `;
            telefonosContainer.appendChild(telefonoField);
        });

        const institucionesContainer = document.getElementById('instituciones-container');
        institucionesContainer.innerHTML = '';
        doctor.instituciones.forEach(institucion => {
            const institucionField = document.createElement('div');
            institucionField.className = 'input-group mb-2';
            institucionField.innerHTML = `
                <select class="form-control" name="doctor-institucion">
                    ${instituciones.map(inst => `<option value="${inst}" ${institucion === inst ? 'selected' : ''}>${inst}</option>`).join('')}
                </select>
                <div class="input-group-append">
                    <button class="btn btn-outline-secondary btn-add-institucion" type="button">+</button>
                </div>
                <div class="invalid-feedback">Por favor, selecciona una institución</div>
            `;
            institucionesContainer.appendChild(institucionField);
        });

        document.getElementById('doctor-especialidad').value = doctor.especialidad;
        document.getElementById('doctor-notas').value = doctor.notas;
    };

    const verDoctor = (index) => {
        const doctor = doctores[index];
        alert(`Doctor: ${doctor.nombre} ${doctor.apellido}\nEmails: ${(doctor.emails || []).join(', ')}\nTeléfonos: ${(doctor.telefonos || []).join(', ')}\nEspecialidad: ${doctor.especialidad}\nInstituciones: ${(doctor.instituciones || []).join(', ')}\nNotas: ${doctor.notas}\nVisitas: ${doctor.visitas}`);
    };

    const editarDoctor = (index) => {
      

            editIndex = index;
            const doctor = doctores[index];
            cargarDoctorEnFormulario(doctor);
            openModal(document.getElementById('doctorModal'));
        
    };

    const eliminarDoctor = (index) => {
        if (confirm('¿Estás seguro de que deseas eliminar este doctor?')) {
            doctores.splice(index, 1);
            guardarDoctores();
            renderizarDoctores();
        }
    };

    renderizarDoctores();
    actualizarContadores();

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

    const btnAddEmail = document.querySelector('.btn-add-email');
    if (btnAddEmail) {
        btnAddEmail.addEventListener('click', function() {
            const container = document.getElementById('emails-container');
            const newField = container.firstElementChild.cloneNode(true);
            newField.querySelector('input').value = '';
            container.appendChild(newField);
        });
    }

    const btnAddTelefono = document.querySelector('.btn-add-telefono');
    if (btnAddTelefono) {
        btnAddTelefono.addEventListener('click', function() {
            const container = document.getElementById('telefonos-container');
            const newField = container.firstElementChild.cloneNode(true);
            newField.querySelector('input').value = '';
            container.appendChild(newField);
        });
    }

    const btnAddInstitucion = document.querySelector('.btn-add-institucion');
    if (btnAddInstitucion) {
        btnAddInstitucion.addEventListener('click', function() {
            const container = document.getElementById('instituciones-container');
            const newField = container.firstElementChild.cloneNode(true);
            newField.querySelector('select').value = '';
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
                };
                reader.readAsDataURL(file);
            } else {
                imagenPrevia.src = 'img/predeterminada.jpg';
            }
        });
    }

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
                    notas,
                    historico: `${ultimaActualizacion}: ${editIndex === null ? 'Creado' : 'Actualizado'}\n`,
                    ultimaActualizacion,
                    actualizadoPor,
                    visitas: ""
                };

                if (editIndex === null) {
                    doctores.push(nuevoDoctor);
                } else {
                    doctores[editIndex] = nuevoDoctor;
                    editIndex = null;
                }

                guardarDoctores();
                renderizarDoctores();
                closeModal(document.getElementById('doctorModal'));
                doctorForm.reset();
                imagenPrevia.src = 'img/predeterminada.jpg';
            }
        };
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
});

function cargarDoctores() {
    const doctoresGuardados = localStorage.getItem('doctores');
    return doctoresGuardados ? JSON.parse(doctoresGuardados) : [
        {
            nombre: "Dr. Carlos",
            apellido: "Martinez",
            emails: ["carlos.martinez@institucion.com"],
            telefonos: ["123456789"],
            especialidad: "Cardiología",
            instituciones: ["Institución A"],
            notas: "Nota inicial",
            historico: "2024-01-01: Creado\n",
            ultimaActualizacion: "2024-01-01",
            actualizadoPor: "admin",
            visitas: "2024-01-01: Primera visita\n"
        },
        {
            nombre: "Dr. Laura",
            apellido: "González",
            emails: ["laura.gonzalez@institucion.com"],
            telefonos: ["987654321"],
            especialidad: "Dermatología",
            instituciones: ["Institución B"],
            notas: "Nota inicial",
            historico: "2024-01-02: Creado\n",
            ultimaActualizacion: "2024-01-02",
            actualizadoPor: "admin",
            visitas: "2024-01-02: Primera visita\n"
        },
        {
            nombre: "Dr. Pedro",
            apellido: "López",
            emails: ["pedro.lopez@institucion.com"],
            telefonos: ["111222333"],
            especialidad: "Neurología",
            instituciones: ["Institución C"],
            notas: "Nota inicial",
            historico: "2024-01-03: Creado\n",
            ultimaActualizacion: "2024-01-03",
            actualizadoPor: "admin",
            visitas: "2024-01-03: Primera visita\n"
        },
        {
            nombre: "Dr. María",
            apellido: "Fernández",
            emails: ["maria.fernandez@institucion.com"],
            telefonos: ["444555666"],
            especialidad: "Pediatría",
            instituciones: ["Institución A", "Institución B"],
            notas: "Nota inicial",
            historico: "2024-01-04: Creado\n",
            ultimaActualizacion: "2024-01-04",
            actualizadoPor: "admin",
            visitas: "2024-01-04: Primera visita\n"
        }
    ];
}
