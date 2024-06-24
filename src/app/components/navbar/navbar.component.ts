import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

/**
 * Componente de navegación que muestra el menú de la aplicación.
 */
@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent implements OnInit {
  usuarioActual: any;

  /**
   * Constructor del NavbarComponent
   * @param router Servicio de navegación de Angular
   */
  constructor(private router: Router) {}

  /**
   * Inicializa el componente obteniendo el usuario actual de la sesión.
   */
  ngOnInit(): void {
    const usuarioActualString = sessionStorage.getItem('usuarioActual');
    if (usuarioActualString) {
      this.usuarioActual = JSON.parse(usuarioActualString);
    }
  }

  /**
   * Cierra la sesión del usuario actual y redirige al login.
   */
  cerrarSesion(): void {
    sessionStorage.removeItem('usuarioActual');
    this.router.navigate(['/login']);
  }
}
