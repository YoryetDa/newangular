import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';

import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent implements OnInit {
  usuariosIniciales = [
    { nombre: "Juan", apellido: "Perez", correo: "juan.perez@example.com", contrasena: "Password123!", rol: "admin" },
    { nombre: "Ana", apellido: "Gomez", correo: "ana.gomez@example.com", contrasena: "AnaGomez456$", rol: "user" }
  ];

  usuarios: any[] = [];

  constructor(private router: Router) {}
  
  navigateToLogin() {
    this.router.navigate(['/login']);
  }

  ngOnInit(): void {
    this.usuarios = this.cargarDatos('usuarios', this.usuariosIniciales);

    if (!localStorage.getItem('usuarios')) {
      this.guardarDatos('usuarios', this.usuariosIniciales);
    }
  }

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
      this.guardarDatos('usuarios', this.usuarios);

      alert('Usuario registrado exitosamente');
      (document.getElementById('register-form') as HTMLFormElement).reset();
    }
  }

  cargarDatos(clave: string, iniciales: any[]): any[] {
    const datosGuardados = localStorage.getItem(clave);
    return datosGuardados ? JSON.parse(datosGuardados) : iniciales;
  }

  guardarDatos(clave: string, datos: any[]): void {
    localStorage.setItem(clave, JSON.stringify(datos));
  }

  validarCorreo(correo: string): boolean {
    const patron = /^[^ ]+@[^ ]+\.[a-z]{2,3}$/;
    return patron.test(correo);
  }

  validarContrasena(contrasena: string): boolean {
    return /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*\W).{8,}$/.test(contrasena);
  }

  validarNombreApellido(nombreApellido: string): boolean {
    return /^[a-zA-Z]{3,}$/.test(nombreApellido);
  }

  mostrarError(input: HTMLInputElement, mensaje: string): void {
    const formGroup = input.closest('.form-group');
    if (formGroup) {
      const feedback = formGroup.querySelector('.invalid-feedback');
      if (feedback) feedback.innerHTML = mensaje;
      input.classList.add('is-invalid');
    }
  }

  quitarError(input: HTMLInputElement): void {
    const formGroup = input.closest('.form-group');
    if (formGroup) {
      input.classList.remove('is-invalid');
    }
  }
}
