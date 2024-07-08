import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, switchMap } from 'rxjs/operators';
import { config } from '../../config';  // Asegúrate de usar la ruta correcta

// Decorador Injectable que marca esta clase como un servicio que puede ser inyectado en otros componentes o servicios
@Injectable({
  providedIn: 'root' // Proporciona este servicio a nivel de raíz, lo que significa que estará disponible en toda la aplicación
})
export class JsonService {
  // Base URL para acceder a los archivos JSON almacenados en Firebase Storage
  private baseUrl = config.apiUrl;
  // Tokens de acceso necesarios para acceder a los archivos JSON específicos
  private tokens = config.tokens;

  // Constructor que inyecta HttpClient para realizar solicitudes HTTP
  constructor(private http: HttpClient) { }

  // Método para obtener los usuarios desde el archivo JSON en Firebase Storage
  getUsuarios(): Observable<any> {
    const url = `${this.baseUrl}usuarios.json?alt=media&token=${this.tokens.usuarios}`;
    console.log('URL solicitada:', url); // Agrega esta línea para imprimir la URL
    return this.http.get(url)
      .pipe(catchError(this.handleError));
  }

  // Método para obtener las instituciones desde el archivo JSON en Firebase Storage
  getInstituciones(): Observable<any> {
    return this.http.get(`${this.baseUrl}instituciones.json?alt=media&token=${this.tokens.instituciones}`)
      .pipe(catchError(this.handleError)); // Maneja errores utilizando el método handleError
  }

  // Método para obtener los doctores desde el archivo JSON en Firebase Storage
  getDoctores(): Observable<any> {
    return this.http.get(`${this.baseUrl}doctores.json?alt=media&token=${this.tokens.doctores}`)
      .pipe(catchError(this.handleError)); // Maneja errores utilizando el método handleError
  }

  // Método para actualizar el archivo JSON de usuarios (simulando PUT utilizando POST)
  updateUsuarios(data: any): Observable<any> {
    const url = `${this.baseUrl}usuarios.json?alt=media&token=${this.tokens.usuarios}`;
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
    });
    return this.http.post(url, data, { headers })
      .pipe(catchError(this.handleError)); // Maneja errores utilizando el método handleError
  }

  // Método para actualizar el archivo JSON de instituciones (simulando PUT utilizando POST)
  updateInstituciones(data: any): Observable<any> {
    const url = `${this.baseUrl}instituciones.json?alt=media&token=${this.tokens.instituciones}`;
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
    });
    return this.http.post(url, data, { headers })
      .pipe(catchError(this.handleError)); // Maneja errores utilizando el método handleError
  }

  // Método para actualizar el archivo JSON de doctores (simulando PUT utilizando POST)
  updateDoctores(data: any): Observable<any> {
    const url = `${this.baseUrl}doctores.json?alt=media&token=${this.tokens.doctores}`;
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
    });
    return this.http.post(url, data, { headers })
      .pipe(catchError(this.handleError)); // Maneja errores utilizando el método handleError
  }

  // Método para eliminar un usuario (simulando DELETE)
  deleteUsuario(correo: string): Observable<any> {
    return this.getUsuarios().pipe(
      switchMap(users => {
        // Filtra los usuarios para eliminar el usuario con el correo especificado
        const updatedUsers = users.filter((user: any) => user.correo !== correo);
        return this.updateUsuarios(updatedUsers); // Actualiza el archivo JSON con los usuarios restantes
      }),
      catchError(this.handleError) // Maneja errores utilizando el método handleError
    );
  }

  // Método para eliminar una institución (simulando DELETE)
  deleteInstitucion(id: string): Observable<any> {
    return this.getInstituciones().pipe(
      switchMap(instituciones => {
        // Filtra las instituciones para eliminar la institución con el ID especificado
        const updatedInstituciones = instituciones.filter((institucion: any) => institucion.id !== id);
        return this.updateInstituciones(updatedInstituciones); // Actualiza el archivo JSON con las instituciones restantes
      }),
      catchError(this.handleError) // Maneja errores utilizando el método handleError
    );
  }

  // Método para eliminar un doctor (simulando DELETE)
  deleteDoctor(id: string): Observable<any> {
    return this.getDoctores().pipe(
      switchMap(doctores => {
        // Filtra los doctores para eliminar el doctor con el ID especificado
        const updatedDoctores = doctores.filter((doctor: any) => doctor.id !== id);
        return this.updateDoctores(updatedDoctores); // Actualiza el archivo JSON con los doctores restantes
      }),
      catchError(this.handleError) // Maneja errores utilizando el método handleError
    );
  }

  // Método para manejar errores en las solicitudes HTTP
  private handleError(error: HttpErrorResponse) {
    if (error.error instanceof ErrorEvent) {
      // Error del lado del cliente o de red
      console.error('An error occurred:', error.error.message);
    } else {
      // El backend retornó un código de respuesta no exitoso
      console.error(`Backend returned code ${error.status}, body was: ${error.error}`);
    }
    // Retorna un observable con un mensaje de error amigable para el usuario
    return throwError('Something bad happened; please try again later.');
  }
}
