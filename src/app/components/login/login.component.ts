import { Component, ViewEncapsulation, OnInit, Renderer2, Inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser, CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { JsonService } from '../../services/json.service';  // Usa la ruta relativa correcta
import { HttpClientModule } from '@angular/common/http';  // Importa el HttpClientModule

/**
 * Componente de inicio de sesión que permite a los usuarios autenticarse.
 */
@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule, HttpClientModule],  // Añade HttpClientModule a los imports
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
  encapsulation: ViewEncapsulation.None
})
export class LoginComponent implements OnInit {
  usuariosIniciales = [
    { nombre: "Juan", apellido: "Perez", correo: "juan.perez@example.com", contrasena: "Password123!", rol: "admin" },
    { nombre: "Ana", apellido: "Gomez", correo: "ana.gomez@example.com", contrasena: "AnaGomez456$", rol: "user" }
  ];

  usuarios: any[] = [];

  /**
   * Constructor del LoginComponent
   * @param platformId Identificador de la plataforma (navegador o servidor)
   * @param renderer Servicio para manipular el DOM
   * @param router Servicio de navegación de Angular
   * @param jsonService Servicio personalizado para interactuar con archivos JSON en Firebase Storage
   */
  constructor(
    @Inject(PLATFORM_ID) private platformId: any,
    private renderer: Renderer2,
    private router: Router,
    private jsonService: JsonService
  ) {}

  /**
   * Redirige al usuario a la página de registro.
   */
  navigateToRegister() {
    this.router.navigate(['/register']);
  }

  /**
   * Inicializa el componente cargando datos de usuarios desde Firebase Storage y configurando eventos de validación.
   */
  ngOnInit(): void {
    if (isPlatformBrowser(this.platformId)) {
      this.jsonService.getUsuarios().subscribe(data => {
        console.log('Usuarios:', data);
        this.usuariosIniciales = data;
        this.usuarios = this.cargarDatos(this.usuariosIniciales);

        if (!localStorage.getItem('usuarios')) {
          this.guardarDatos(this.usuariosIniciales);
        }
      });

      // Eventos de validación en tiempo real
      document.querySelectorAll<HTMLInputElement>('#register-form input, #profile-form input').forEach(input => {
        input.addEventListener('input', () => {
          this.handleInputValidation(input);
        });

        input.addEventListener('blur', () => {
          this.handleInputValidation(input);
        });
      });

      // Manejar el envío del formulario de inicio de sesión
      const loginForm = document.getElementById('login-form');
      if (loginForm) {
        loginForm.addEventListener('submit', (e) => this.handleLoginSubmit(e));
      }

      // Mostrar/ocultar contraseña
      const mostrarContrasenaCheckbox = document.getElementById('mostrarContrasena');
      const passwordInput = document.getElementById('login-password');
      if (mostrarContrasenaCheckbox && passwordInput) {
        mostrarContrasenaCheckbox.addEventListener('change', function() {
          (passwordInput as HTMLInputElement).type = (mostrarContrasenaCheckbox as HTMLInputElement).checked ? 'text' : 'password';
        });
      }
    }
  }

  /**
   * Maneja la validación de entrada en tiempo real para varios campos del formulario.
   * @param input El campo de entrada que se está validando.
   */
  handleInputValidation(input: HTMLInputElement): void {
    switch (input.id) {
      case 'register-nombre':
      case 'profile-nombre':
        this.validarCampo(input, this.validarNombreApellido, 'El nombre debe tener al menos 3 caracteres y no puede contener números ni caracteres especiales');
        break;
      case 'register-apellido':
      case 'profile-apellido':
        this.validarCampo(input, this.validarNombreApellido, 'El apellido debe tener al menos 3 caracteres y no puede contener números ni caracteres especiales');
        break;
      case 'register-email':
      case 'profile-email':
        this.validarCampo(input, this.validarCorreo, 'Por favor, ingresa un correo válido (por ejemplo, user@example.com)');
        break;
      case 'register-password':
      case 'profile-password':
        this.validarCampo(input, this.validarContrasena, 'La contraseña debe tener al menos 8 caracteres, una letra mayúscula, un número y un carácter especial');
        break;
    }
  }

  /**
   * Maneja el envío del formulario de inicio de sesión.
   * @param e El evento de envío del formulario.
   */
  handleLoginSubmit(e: Event): void {
    e.preventDefault();

    const correo = (document.getElementById('login-email') as HTMLInputElement).value;
    const contrasena = (document.getElementById('login-password') as HTMLInputElement).value;

    let valid = true;

    if (!this.validarCorreo(correo)) {
      this.mostrarError(document.getElementById('login-email') as HTMLInputElement, 'Por favor, ingresa un correo válido (por ejemplo, user@example.com)');
      valid = false;
    } else {
      this.quitarError(document.getElementById('login-email') as HTMLInputElement);
    }

    if (contrasena === "") {
      this.mostrarError(document.getElementById('login-password') as HTMLInputElement, 'La contraseña no puede estar vacía');
      valid = false;
    } else {
      this.quitarError(document.getElementById('login-password') as HTMLInputElement);
    }

    if (valid) {
      const usuario = this.usuarios.find(user => user.correo === correo && user.contrasena === contrasena);

      if (usuario) {
        sessionStorage.setItem('usuarioActual', JSON.stringify(usuario));
        this.router.navigate(['/dashboard']); // Cambia a la redirección de Angular
      } else {
        alert('Correo o contraseña incorrectos');
      }
    }
  }

  /**
   * Maneja el envío del formulario de registro.
   * @param e El evento de envío del formulario.
   */
  handleRegisterSubmit(e: Event): void {
    e.preventDefault();

    const nombre = (document.getElementById('register-nombre') as HTMLInputElement).value;
    const apellido = (document.getElementById('register-apellido') as HTMLInputElement).value;
    const correo = (document.getElementById('register-email') as HTMLInputElement).value;
    const contrasena = (document.getElementById('register-password') as HTMLInputElement).value;

    let valid = true;

    if (!this.validarNombreApellido(nombre)) {
      this.mostrarError(document.getElementById('register-nombre') as HTMLInputElement, 'El nombre debe tener al menos 3 caracteres y no puede contener números ni caracteres especiales');
      valid = false;
    } else {
      this.quitarError(document.getElementById('register-nombre') as HTMLInputElement);
    }

    if (!this.validarNombreApellido(apellido)) {
      this.mostrarError(document.getElementById('register-apellido') as HTMLInputElement, 'El apellido debe tener al menos 3 caracteres y no puede contener números ni caracteres especiales');
      valid = false;
    } else {
      this.quitarError(document.getElementById('register-apellido') as HTMLInputElement);
    }

    if (!this.validarCorreo(correo)) {
      this.mostrarError(document.getElementById('register-email') as HTMLInputElement, 'Por favor, ingresa un correo válido (por ejemplo, user@example.com)');
      valid = false;
    } else {
      this.quitarError(document.getElementById('register-email') as HTMLInputElement);
    }

    if (!this.validarContrasena(contrasena)) {
      this.mostrarError(document.getElementById('register-password') as HTMLInputElement, 'La contraseña debe tener al menos 8 caracteres, una letra mayúscula, un número y un carácter especial');
      valid = false;
    } else {
      this.quitarError(document.getElementById('register-password') as HTMLInputElement);
    }

    if (valid) {
      const nuevoUsuario = {
        nombre,
        apellido,
        correo,
        contrasena,
        rol: 'user' // O el rol que desees asignar
      };

      this.usuarios.push(nuevoUsuario);
      this.jsonService.updateUsuarios(this.usuarios).subscribe(() => {
        alert('Usuario registrado exitosamente');
        (document.getElementById('register-form') as HTMLFormElement).reset();
      });
    }
  }

  /**
   * Carga datos desde el almacenamiento local o utiliza datos iniciales.
   * @param iniciales Los datos iniciales.
   * @returns Los datos cargados.
   */
  cargarDatos(iniciales: any[]): any[] {
    const datosGuardados = localStorage.getItem('usuarios');
    return datosGuardados ? JSON.parse(datosGuardados) : iniciales;
  }

  /**
   * Guarda datos en el almacenamiento local.
   * @param datos Los datos a guardar.
   */
  guardarDatos(datos: any[]): void {
    localStorage.setItem('usuarios', JSON.stringify(datos));
  }

  /**
   * Valida un correo electrónico.
   * @param correo El correo electrónico a validar.
   * @returns True si el correo es válido, false en caso contrario.
   */
  validarCorreo(correo: string): boolean {
    const patron = /^[^ ]+@[^ ]+\.[a-z]{2,3}$/;
    return patron.test(correo);
  }

  /**
   * Valida una contraseña.
   * @param contrasena La contraseña a validar.
   * @returns True si la contraseña es válida, false en caso contrario.
   */
  validarContrasena(contrasena: string): boolean {
    return /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*\W).{8,}$/.test(contrasena);
  }

  /**
   * Valida un nombre o apellido.
   * @param nombreApellido El nombre o apellido a validar.
   * @returns True si el nombre o apellido es válido, false en caso contrario.
   */
  validarNombreApellido(nombreApellido: string): boolean {
    return /^[a-zA-Z]{3,}$/.test(nombreApellido);
  }

  /**
   * Muestra un mensaje de error en el campo de entrada.
   * @param input El campo de entrada.
   * @param mensaje El mensaje de error a mostrar.
   */
  mostrarError(input: HTMLInputElement, mensaje: string): void {
    const formGroup = input.closest('.form-group');
    if (formGroup) {
      const feedback = formGroup.querySelector('.invalid-feedback');
      if (feedback) feedback.innerHTML = mensaje;
      input.classList.add('is-invalid');
    }
  }

  /**
   * Quita el mensaje de error del campo de entrada.
   * @param input El campo de entrada.
   */
  quitarError(input: HTMLInputElement): void {
    const formGroup = input.closest('.form-group');
    if (formGroup) input.classList.remove('is-invalid');
  }

  /**
   * Valida un campo de entrada.
   * @param input El campo de entrada.
   * @param validacion La función de validación.
   * @param mensajeError El mensaje de error a mostrar si la validación falla.
   * @returns True si el campo es válido, false en caso contrario.
   */
  validarCampo(input: HTMLInputElement, validacion: (value: string) => boolean, mensajeError: string): boolean {
    if (!validacion(input.value)) {
      this.mostrarError(input, mensajeError);
      return false;
    } else {
      this.quitarError(input);
      return true;
    }
  }

  /**
   * Permite al usuario recuperar su contraseña.
   */
  recuperarContrasena(): void {
    const correo = prompt('Por favor, ingresa tu correo electrónico para recuperar tu contraseña:');
    if (correo) {
      if (this.validarCorreo(correo)) {
        // Aquí puedes añadir la lógica para enviar un correo de recuperación de contraseña
        alert('Si el correo ingresado es válido, recibirás un mensaje para recuperar tu contraseña.');
      } else {
        alert('Por favor, ingresa un correo válido.');
      }
    }
  }
}
