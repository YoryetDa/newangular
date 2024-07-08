import { Component, OnInit, Renderer2, Inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { CommonModule } from '@angular/common';
import { DoctorComponent } from '../doctor/doctor.component';
import { RouterModule } from '@angular/router'; // Importar RouterModule
import { FormsModule } from '@angular/forms';  // Importar FormsModule
import { JsonService } from '../../services/json.service'; // Importar JsonService

/**
 * Componente que gestiona el panel de control, incluyendo la información de instituciones, usuarios y doctores.
 */
@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, DoctorComponent, RouterModule, FormsModule],  // Incluir FormsModule
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {
  instituciones: any[] = [];
  usuarioActual: any; 
  contadorDoctores: number = 0;
  contadorInstituciones: number = 0;
  usuarios: any[] = [];
  usuarioActualEdicion: any = this.inicializarUsuario();
  doctores: any[] = [];

  doctorActual: any = this.inicializarDoctor();

  /**
   * Constructor del DashboardComponent.
   * @param platformId Identificador de la plataforma (navegador o servidor).
   * @param renderer Servicio para manipular el DOM.
   */
  constructor(
    @Inject(PLATFORM_ID) private platformId: any,
    private renderer: Renderer2,
    private jsonService: JsonService // Inyectar JsonService

  ) {}

  /**
   * Inicializa el componente, cargando la información necesaria y configurando eventos.
   */
  ngOnInit(): void {
    if (isPlatformBrowser(this.platformId)) {
      const usuarioActualString = sessionStorage.getItem('usuarioActual');
      if (usuarioActualString) {
        this.usuarioActual = JSON.parse(usuarioActualString);
        console.log('Usuario Actual:', this.usuarioActual);
      }

      this.actualizarContadores();
      this.cargarInstituciones();
      this.cargarUsuarios();
      this.agregarEventos();
    }
  }

  /**
   * Inicializa un objeto usuario con campos vacíos.
   * @returns Un objeto usuario inicializado.
   */
  inicializarUsuario() {
    return {
      nombre: '',
      apellido: '',
      correo: '',
      rol: ''
    };
  }
 /**
   * Inicializa un nuevo doctor con campos vacíos.
   * @returns Un objeto doctor inicializado
   */
 inicializarDoctor() {
  return {
    nombre: '',
    apellido: '',
    emails: [''],
    telefonos: [''],
    especialidad: '',
    instituciones: [''],
    notas: '',
    visitas: '',
    imagen: ''
  };
}
 /**
   * Carga la lista de doctores desde Firebase.
   */
 cargarDoctores(): void {
  this.jsonService.getDoctores().subscribe(data => {
    this.doctores = data;
  });
}
/**
  /**
   * Actualiza los contadores de doctores e instituciones a partir del almacenamiento local.
   */
    actualizarContadores(): void {
      this.jsonService.getDoctores().subscribe(doctores => {
        this.contadorDoctores = doctores.length;
      });

      this.jsonService.getInstituciones().subscribe(instituciones => {
        this.contadorInstituciones = instituciones.length;
      });
    }

    
    guardarDoctor(event: Event): void {
      event.preventDefault();
      if (this.doctorActual.nombre.length < 3 || this.doctorActual.apellido.length < 3 || this.doctorActual.especialidad.length < 3) {
        //alert('Por favor, llena todos los campos correctamente.');
        return;
      }
  
      if (this.doctorActual.index != null) {
        this.doctores[this.doctorActual.index] = this.doctorActual;
      } else {
        this.doctores.push(this.doctorActual);
      }
      this.jsonService.updateDoctores(this.doctores).subscribe(() => {
        this.doctorActual = this.inicializarDoctor();
        this.cargarDoctores();
        this.cerrarModal();
      });
    }
  
 
    /**
   * Carga las instituciones y actualiza los elementos select correspondientes.
   */
  cargarInstituciones(): void {
    this.jsonService.getInstituciones().subscribe(instituciones => {
      this.instituciones = instituciones;
      const institucionSelects = document.querySelectorAll('select[name="doctor-institucion"]');
      institucionSelects.forEach(select => {
        const selectElement = select as HTMLSelectElement;
        selectElement.innerHTML = '';
        this.instituciones.forEach(inst => {
          const option = document.createElement('option');
          option.value = inst.nombre;
          option.textContent = inst.nombre;
          selectElement.appendChild(option);
        });
      });
    });
  }

  /**
   * Carga la lista de usuarios desde el almacenamiento local.
   */
  cargarUsuarios(): void {
    this.jsonService.getUsuarios().subscribe(usuarios => {
      this.usuarios = usuarios;
    });
  }

  /**
   * Agrega eventos a varios elementos del DOM.
   */
  agregarEventos(): void {
    const btnIngresarDoctor = document.getElementById('btn-ingresar-doctor');
    if (btnIngresarDoctor) {
      btnIngresarDoctor.addEventListener('click', () => {
        const modal = document.getElementById('doctorModal');
        if (modal) {
          modal.classList.add('show');
          modal.style.display = 'block';
        }
      });
    }

    const btnAddEmail = document.querySelector('.btn-add-email');
    if (btnAddEmail) {
      btnAddEmail.addEventListener('click', this.agregarCampoEmail.bind(this));
    }

    const btnAddTelefono = document.querySelector('.btn-add-telefono');
    if (btnAddTelefono) {
      btnAddTelefono.addEventListener('click', this.agregarCampoTelefono.bind(this));
    }

    const btnAddInstitucion = document.querySelector('.btn-add-institucion');
    if (btnAddInstitucion) {
      btnAddInstitucion.addEventListener('click', this.agregarCampoInstitucion.bind(this));
    }

    const imagenInput = document.getElementById('doctor-imagen') as HTMLInputElement;
    const imagenPrevia = document.getElementById('doctor-imagen-previa') as HTMLImageElement;
    if (imagenInput && imagenPrevia) {
      imagenInput.addEventListener('change', function() {
        const file = this.files ? this.files[0] : null;
        if (file) {
          const reader = new FileReader();
          reader.onload = function(e) {
            if (e.target && e.target.result && imagenPrevia) {
              imagenPrevia.src = e.target.result as string;
            }
          };
          reader.readAsDataURL(file);
        } else {
          imagenPrevia.src = 'img/predeterminada.jpg';
        }
      });
    }

    document.querySelectorAll('#doctor-form input, #doctor-form select').forEach(input => {
      input.addEventListener('input', (event) => this.validarInput(event.target as HTMLInputElement | HTMLSelectElement));
      input.addEventListener('blur', (event) => this.validarInput(event.target as HTMLInputElement | HTMLSelectElement));
    });

    const doctorForm = document.getElementById('doctor-form') as HTMLFormElement;
    if (doctorForm) {
      doctorForm.addEventListener('submit', (e) => this.handleSubmit(e, doctorForm));
    }

    const btnAddVisita = document.querySelector('.btn-add-visita');
    if (btnAddVisita) {
      btnAddVisita.addEventListener('click', this.agregarVisita.bind(this));
    }

    const btnAddNota = document.querySelector('.btn-add-nota');
    if (btnAddNota) {
      btnAddNota.addEventListener('click', this.agregarNota.bind(this));
    }
  }

  /**
   * Abre un modal.
   * @param modal El elemento modal a abrir.
   */
  openModal(modal: HTMLElement): void {
    modal.classList.add('show');
    modal.style.display = 'block';
    document.body.classList.add('modal-open');

    const backdrop = document.createElement('div');
    backdrop.className = 'modal-backdrop fade show';
    document.body.appendChild(backdrop);
  }

  /**
   * Edita la información de un usuario existente.
   * @param usuario El usuario a editar.
   */
  editarUsuario(usuario: any): void {
    this.usuarioActualEdicion = { ...usuario, index: this.usuarios.indexOf(usuario) };
    this.abrirModal('usuarioModal');
  }

  /**
   * Elimina un usuario de la lista y del almacenamiento local.
   * @param usuario El usuario a eliminar.
   */
  eliminarUsuario(usuario: any): void {
    this.usuarios = this.usuarios.filter(u => u.correo !== usuario.correo);
    this.jsonService.updateUsuarios(this.usuarios).subscribe(() => {
      localStorage.setItem('usuarios', JSON.stringify(this.usuarios));
    });
  }
  /**
   * Abre un modal por su ID.
   * @param modalId El ID del modal a abrir.
   */
  abrirModal(modalId: string): void {
    const modal = document.getElementById(modalId);
    if (modal) {
      modal.classList.add('show');
      modal.style.display = 'block';
      document.body.classList.add('modal-open');

      const backdrop = document.createElement('div');
      backdrop.className = 'modal-backdrop fade show';
      document.body.appendChild(backdrop);
    }
  }

 

  /**
   * Cierra el modal de edición o agregado de doctor.
   */
  cerrarModal(): void {
    const modal = document.getElementById('doctorModal');
    if (modal) {
      modal.classList.remove('show');
      modal.style.display = 'none';
      document.body.classList.remove('modal-open');

      const backdrop = document.querySelector('.modal-backdrop');
      if (backdrop) {
        document.body.removeChild(backdrop);
      }
    }
  }

  /**
   * Guarda la información del usuario actual en la lista de usuarios y en el almacenamiento local.
   * @param event El evento de envío del formulario.
   */
  guardarUsuario(event: Event): void {
    event.preventDefault();
    if (this.usuarioActualEdicion.index != null) {
      this.usuarios[this.usuarioActualEdicion.index] = this.usuarioActualEdicion;
    } else {
      this.usuarios.push(this.usuarioActualEdicion);
    }
    this.jsonService.updateUsuarios(this.usuarios).subscribe(() => {
      localStorage.setItem('usuarios', JSON.stringify(this.usuarios));
      this.usuarioActualEdicion = this.inicializarUsuario();
      this.cerrarModal();
    });
  }

  /**
   * Cierra un modal.
   * @param modal El elemento modal a cerrar.
   */
  closeModal(modal: HTMLElement): void {
    modal.classList.remove('show');
    modal.style.display = 'none';
    document.body.classList.remove('modal-open');

    const backdrop = document.querySelector('.modal-backdrop');
    if (backdrop) {
      document.body.removeChild(backdrop);
    }
  }

  /**
   * Agrega un nuevo campo de email.
   */
  agregarCampoEmail(): void {
    const container = document.getElementById('emails-container');
    if (container && container.firstElementChild) {
      const newField = container.firstElementChild.cloneNode(true) as HTMLElement;
      const input = newField.querySelector('input');
      if (input) {
        input.value = '';
      }
      container.appendChild(newField);
    }
  }
  /**
   * Agrega un nuevo campo de teléfono.
   */
  agregarCampoTelefono(): void {
    const container = document.getElementById('telefonos-container');
    if (container && container.firstElementChild) {
      const newField = container.firstElementChild.cloneNode(true) as HTMLElement;
      const input = newField.querySelector('input');
      if (input) {
        input.value = '';
      }
      container.appendChild(newField);
    }
  }

  /**
   * Agrega un nuevo campo de institución.
   */
  agregarCampoInstitucion(): void {
    const container = document.getElementById('instituciones-container');
    if (container && container.firstElementChild) {
      const newField = container.firstElementChild.cloneNode(true) as HTMLElement;
      const select = newField.querySelector('select');
      if (select) {
        select.value = '';
      }
      container.appendChild(newField);
      this.cargarInstituciones();
    }
  }

  /**
   * Valida un campo de entrada.
   * @param input El campo de entrada a validar.
   */
  validarInput(input: HTMLInputElement | HTMLSelectElement): void {
    if (input instanceof HTMLInputElement) {
      switch (input.id) {
        case 'doctor-nombre':
        case 'doctor-apellido':
        case 'doctor-especialidad':
          this.validarCampo(input, `El ${input.placeholder.toLowerCase()} es obligatorio y debe tener al menos 3 caracteres`, this.validarNombre);
          break;
        case 'doctor-email':
          this.validarCampo(input, 'Por favor, ingresa un correo válido', this.validarEmail);
          break;
        case 'doctor-telefono':
          this.validarCampo(input, 'El teléfono debe ser válido', this.validarTelefono);
          break;
      }
    } else if (input instanceof HTMLSelectElement) {
      if (input.name === 'doctor-institucion') {
        this.validarCampo(input, 'Por favor, selecciona una institución', valor => valor !== '');
      }
    }
  }

  /**
   * Valida un campo de formulario.
   * @param input El campo de formulario a validar.
   * @param mensajeError El mensaje de error a mostrar si la validación falla.
   * @param validacion La función de validación.
   * @returns Un booleano indicando si el campo es válido o no.
   */
  validarCampo(input: HTMLInputElement | HTMLSelectElement, mensajeError: string, validacion: (value: string) => boolean): boolean {
    if (!validacion(input.value.trim())) {
      this.mostrarError(input, mensajeError);
      return false;
    } else {
      this.quitarError(input);
      return true;
    }
  }

  /**
   * Valida un nombre.
   * @param nombre El nombre a validar.
   * @returns Un booleano indicando si el nombre es válido o no.
   */
  validarNombre(nombre: string): boolean {
    return nombre.length >= 3;
  }

  /**
   * Valida un número de teléfono.
   * @param telefono El número de teléfono a validar.
   * @returns Un booleano indicando si el número de teléfono es válido o no.
   */
  validarTelefono(telefono: string): boolean {
    return telefono.length >= 7;
  }

  /**
   * Valida un correo electrónico.
   * @param email El correo electrónico a validar.
   * @returns Un booleano indicando si el correo electrónico es válido o no.
   */
  validarEmail(email: string): boolean {
    const patron = /^[^ ]+@[^ ]+\.[a-z]{2,3}$/;
    return patron.test(email);
  }

  /**
   * Muestra un mensaje de error en un campo de formulario.
   * @param input El campo de formulario donde mostrar el mensaje de error.
   * @param mensaje El mensaje de error a mostrar.
   */
  mostrarError(input: HTMLInputElement | HTMLSelectElement, mensaje: string): void {
    const formGroup = input.closest('.form-group');
    if (formGroup) {
      const feedback = formGroup.querySelector('.invalid-feedback') as HTMLElement;
      if (feedback) {
        feedback.innerText = mensaje;
      }
      input.classList.add('is-invalid');
    }
  }
  /**
   * Elimina el mensaje de error de un campo de formulario.
   * @param input El campo de formulario del que eliminar el mensaje de error.
   */
  quitarError(input: HTMLInputElement | HTMLSelectElement): void {
    const formGroup = input.closest('.form-group');
    if (formGroup) {
      input.classList.remove('is-invalid');
    }
  }

  /**
   * Maneja el envío del formulario, validando los campos y guardando los datos si son válidos.
   * @param e El evento de envío del formulario.
   * @param form El formulario a enviar.
   */
   handleSubmit(e: Event, form: HTMLFormElement): void {
    e.preventDefault();

    const nombreValido = this.validarCampo(document.getElementById('doctor-nombre') as HTMLInputElement, 'El nombre es obligatorio y debe tener al menos 3 caracteres', this.validarNombre);
    const apellidoValido = this.validarCampo(document.getElementById('doctor-apellido') as HTMLInputElement, 'El apellido es obligatorio y debe tener al menos 3 caracteres', this.validarNombre);

    const emails = document.querySelectorAll('input[name="doctor-email"]');
    let emailsValidos = true;
    const emailValues = Array.from(emails).map(email => {
      const inputEmail = email as HTMLInputElement;
      if (inputEmail.value.trim() !== '' && !this.validarEmail(inputEmail.value)) {
        emailsValidos = false;
        this.mostrarError(inputEmail, 'Por favor, ingresa un correo válido');
      } else {
        this.quitarError(inputEmail);
      }
      return inputEmail.value.trim();
    }).filter(email => email !== '');

    const telefonos = document.querySelectorAll('input[name="doctor-telefono"]');
    let telefonosValidos = true;
    const telefonoValues = Array.from(telefonos).map(telefono => {
      const inputTelefono = telefono as HTMLInputElement;
      if (inputTelefono.value.trim() !== '' && !this.validarTelefono(inputTelefono.value)) {
        telefonosValidos = false;
        this.mostrarError(inputTelefono, 'El teléfono debe ser válido');
      } else {
        this.quitarError(inputTelefono);
      }
      return inputTelefono.value.trim();
    }).filter(telefono => telefono !== '');

    const instituciones = document.querySelectorAll('select[name="doctor-institucion"]');
    let institucionesValidas = true;
    const institucionValues = Array.from(instituciones).map(institucion => {
      const selectInstitucion = institucion as HTMLSelectElement;
      if (selectInstitucion.value === '') {
        institucionesValidas = false;
        this.mostrarError(selectInstitucion, 'Por favor, selecciona una institución');
      } else {
        this.quitarError(selectInstitucion);
      }
      return selectInstitucion.value;
    });

    const especialidadValida = this.validarCampo(document.getElementById('doctor-especialidad') as HTMLInputElement, 'La especialidad es obligatoria', this.validarNombre);

    if (nombreValido && apellidoValido && emailsValidos && telefonosValidos && especialidadValida && institucionesValidas) {
      const nuevoDoctor = {
        nombre: (document.getElementById('doctor-nombre') as HTMLInputElement).value,
        apellido: (document.getElementById('doctor-apellido') as HTMLInputElement).value,
        emails: emailValues,
        telefonos: telefonoValues,
        especialidad: (document.getElementById('doctor-especialidad') as HTMLInputElement).value,
        instituciones: institucionValues,
        notas: "",
        historico: `${new Date().toLocaleString()}: Creado\n`,
        ultimaActualizacion: new Date().toLocaleString(),
        actualizadoPor: this.usuarioActual ? this.usuarioActual.nombre : 'Desconocido',
        visitas: ""
      };

      this.jsonService.getDoctores().subscribe(doctores => {
        doctores.push(nuevoDoctor);
        this.jsonService.updateDoctores(doctores).subscribe(() => {
          (document.getElementById('doctor-form') as HTMLFormElement).reset();
          const imagenPrevia = document.getElementById('doctor-imagen-previa') as HTMLImageElement;
          if (imagenPrevia) {
            imagenPrevia.src = 'img/predeterminada.jpg';
          }
          this.closeModal(document.getElementById('doctorModal') as HTMLElement);
          alert('Doctor guardado exitosamente');
          this.actualizarContadores();
        });
      });
    }
  }

  agregarVisita(): void {
    const visitasInput = document.getElementById('doctor-visitas') as HTMLTextAreaElement;
    const nuevaVisita = prompt('Ingrese la nueva visita:');
    if (nuevaVisita) {
      const nuevaEntrada = `${new Date().toLocaleString()}: ${nuevaVisita}\n`;
      visitasInput.value += nuevaEntrada;
    }
  }

  agregarNota(): void {
    const notasInput = document.getElementById('doctor-notas') as HTMLTextAreaElement;
    const nuevaNota = prompt('Ingrese la nueva nota:');
    if (nuevaNota) {
      const nuevaEntrada = `${new Date().toLocaleString()}: ${nuevaNota}\n`;
      notasInput.value += nuevaEntrada;
    }
  }

  previsualizarImagen(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files[0]) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const imagenPrevia = document.getElementById('doctor-imagen-previa') as HTMLImageElement;
        if (e.target && e.target.result) {
          imagenPrevia.src = e.target.result as string;
        }
      };
      reader.readAsDataURL(input.files[0]);
    }
  }
}