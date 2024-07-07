import { Component, OnInit, Renderer2, Inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { JsonService } from '../../services/json.service'; // Importa el servicio

/**
 * Componente que gestiona la información de los doctores.
 */
@Component({
  selector: 'app-doctor',
  standalone: true,
  templateUrl: './doctor.component.html',
  styleUrls: ['./doctor.component.css'],
  imports: [CommonModule, FormsModule]
})
export class DoctorComponent implements OnInit {
  instituciones = ["Institución A", "Institución B", "Institución C"];
  usuarioActual: any;
  doctores: any[] = [];
  doctorActual: any = this.inicializarDoctor();

  /**
   * Constructor del DoctorComponent
   * @param platformId Identificador de la plataforma (navegador o servidor)
   * @param renderer Servicio para manipular el DOM
   * @param jsonService Servicio para interactuar con los datos en Firebase
   */
  constructor(@Inject(PLATFORM_ID) private platformId: any, private renderer: Renderer2, private jsonService: JsonService) {}


  /**
   * Inicializa el componente cargando la información del usuario actual y los doctores.
   */
  ngOnInit(): void {
    if (isPlatformBrowser(this.platformId)) {
      const usuarioActualString = sessionStorage.getItem('usuarioActual');
      if (usuarioActualString) {
        this.usuarioActual = JSON.parse(usuarioActualString);
      }
      this.cargarDoctores();
    }
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
   * Guarda el doctor actual en la lista de doctores y en Firebase.
   * @param event El evento de envío del formulario
   */
  guardarDoctor(event: Event): void {
    event.preventDefault();
    if (this.doctorActual.nombre.length < 3 || this.doctorActual.apellido.length < 3 || this.doctorActual.especialidad.length < 3) {
      alert('Por favor, llena todos los campos correctamente.');
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
   * Edita la información de un doctor existente.
   * @param doctor El doctor a editar
   */
  editarDoctor(doctor: any): void {
    this.doctorActual = { ...doctor, index: this.doctores.indexOf(doctor) };
    this.abrirModal();
  }

  /**
   * Elimina un doctor de la lista y de Firebase.
   * @param doctor El doctor a eliminar
   */
  eliminarDoctor(doctor: any): void {
    if (confirm('¿Estás seguro de que quieres eliminar a este doctor?')) {
      this.jsonService.deleteDoctor(doctor.id).subscribe(() => {
        this.cargarDoctores();
      });
    }
  }

  /**
   * Abre el modal para editar o agregar un doctor.
   */
  abrirModal(): void {
    const modal = document.getElementById('doctorModal');
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
   * Agrega un nuevo campo de email al doctor actual.
   */
  agregarCampoEmail(): void {
    this.doctorActual.emails.push('');
  }

  /**
   * Elimina un campo de email del doctor actual.
   * @param index El índice del campo de email a eliminar
   */
  eliminarCampoEmail(index: number): void {
    this.doctorActual.emails.splice(index, 1);
  }

  /**
   * Agrega un nuevo campo de teléfono al doctor actual.
   */
  agregarCampoTelefono(): void {
    this.doctorActual.telefonos.push('');
  }

  /**
   * Elimina un campo de teléfono del doctor actual.
   * @param index El índice del campo de teléfono a eliminar
   */
  eliminarCampoTelefono(index: number): void {
    this.doctorActual.telefonos.splice(index, 1);
  }

  /**
   * Agrega un nuevo campo de institución al doctor actual.
   */
  agregarCampoInstitucion(): void {
    this.doctorActual.instituciones.push('');
  }

  /**
   * Elimina un campo de institución del doctor actual.
   * @param index El índice del campo de institución a eliminar
   */
  eliminarCampoInstitucion(index: number): void {
    this.doctorActual.instituciones.splice(index, 1);
  }

  /**
   * Previsualiza la imagen seleccionada para el doctor actual.
   * @param event El evento de cambio del input de archivo
   */
  previsualizarImagen(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files[0]) {
      const reader = new FileReader();
      reader.onload = (e) => {
        if (e.target && e.target.result) {
          this.doctorActual.imagen = e.target.result as string;
        }
      };
      reader.readAsDataURL(input.files[0]);
    }
  }

  /**
   * Cierra el modal de edición o agregado de doctor (método alternativo).
   */
  closeModal(): void {
    const modal = document.getElementById('doctorModal');
    if (modal) {
      modal.classList.remove('show');
      modal.style.display = 'none';
    }
  }
}
