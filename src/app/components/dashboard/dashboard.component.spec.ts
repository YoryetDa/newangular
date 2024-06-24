import { ComponentFixture, TestBed } from '@angular/core/testing';
import { DashboardComponent } from './dashboard.component';
import { FormsModule } from '@angular/forms';
import { RouterTestingModule } from '@angular/router/testing';

describe('DashboardComponent', () => {
  let component: DashboardComponent;
  let fixture: ComponentFixture<DashboardComponent>;

  // Configuración del módulo de prueba
  beforeEach(async () => {
    // Configura el TestBed con los módulos necesarios y el componente a probar
    await TestBed.configureTestingModule({
      imports: [FormsModule, RouterTestingModule, DashboardComponent]
    }).compileComponents();
  });

  // Inicialización del componente y del fixture antes de cada prueba
  beforeEach(() => {
    // Crea una instancia del componente y del fixture
    fixture = TestBed.createComponent(DashboardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges(); // Detecta cambios para inicializar la vista
  });

  // Prueba para verificar que el componente se crea correctamente
  it('should create', () => {
    expect(component).toBeTruthy();
  });

  // Prueba para verificar que el usuario actual se carga correctamente desde sessionStorage
  it('should load the current user from sessionStorage', () => {
    const mockUser = { nombre: 'John', apellido: 'Doe', rol: 'admin' };
    sessionStorage.setItem('usuarioActual', JSON.stringify(mockUser)); // Simula un usuario en sessionStorage

    component.ngOnInit(); // Llama al método ngOnInit para cargar el usuario

    expect(component.usuarioActual).toEqual(mockUser); // Verifica que el usuario actual es el esperado
  });

  // Prueba para verificar que un usuario se agrega correctamente
  it('should add a user correctly', () => {
    const initialLength = component.usuarios.length; // Guarda la longitud inicial de la lista de usuarios
    const newUser = { nombre: 'Jane', apellido: 'Doe', correo: 'jane.doe@example.com', rol: 'user' };

    component.usuarioActualEdicion = newUser; // Establece el nuevo usuario como el usuario en edición
    component.guardarUsuario(new Event('submit')); // Llama al método para guardar el usuario

    expect(component.usuarios.length).toBe(initialLength + 1); // Verifica que la longitud de la lista de usuarios aumentó en uno
    expect(component.usuarios[component.usuarios.length - 1]).toEqual(newUser); // Verifica que el último usuario en la lista es el nuevo usuario
  });

  // Prueba para verificar que un usuario se elimina correctamente
  it('should delete a user correctly', () => {
    // Configura una lista inicial de usuarios
    component.usuarios = [
      { nombre: 'Juan', apellido: 'Perez', correo: 'juan.perez@example.com', contrasena: 'Password123!', rol: 'admin' },
      { nombre: 'Ana', apellido: 'Gomez', correo: 'ana.gomez@example.com', contrasena: 'AnaGomez456$', rol: 'user' },
      { nombre: 'Jane', apellido: 'Doe', correo: 'jane.doe@example.com', rol: 'user' }
    ];

    const userToDelete = { nombre: 'Jane', apellido: 'Doe', correo: 'jane.doe@example.com', rol: 'user' };
    const initialLength = component.usuarios.length; // Guarda la longitud inicial de la lista de usuarios

    component.eliminarUsuario(userToDelete); // Llama al método para eliminar el usuario

    expect(component.usuarios.length).toBe(initialLength - 1); // Verifica que la longitud de la lista de usuarios disminuyó en uno
    expect(component.usuarios.some(u => u.correo === userToDelete.correo)).toBeFalse(); // Verifica que el usuario eliminado ya no está en la lista
  });
});
