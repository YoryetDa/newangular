import { ComponentFixture, TestBed } from '@angular/core/testing';
import { DashboardComponent } from './dashboard.component';
import { FormsModule } from '@angular/forms';
import { RouterTestingModule } from '@angular/router/testing';
import { HttpClientModule } from '@angular/common/http';
import { JsonService } from '../../services/json.service';
import { of } from 'rxjs';

class MockJsonService {
  usuarios = [
    { nombre: 'Juan', apellido: 'Perez', correo: 'juan.perez@example.com', contrasena: 'Password123!', rol: 'admin' },
    { nombre: 'Ana', apellido: 'Gomez', correo: 'ana.gomez@example.com', contrasena: 'AnaGomez456$', rol: 'user' }
  ];

  doctores = [
    { id: '1', nombre: 'Doctor 1', especialidad: 'Cardiología' },
    { id: '2', nombre: 'Doctor 2', especialidad: 'Dermatología' }
  ];

  instituciones = [
    { nombre: 'Institución A' },
    { nombre: 'Institución B' },
    { nombre: 'Institución C' }
  ];

  getUsuarios() {
    return of(this.usuarios);
  }

  getDoctores() {
    return of(this.doctores);
  }

  getInstituciones() {
    return of(this.instituciones);
  }

  updateUsuarios(data: any) {
    this.usuarios = data;
    return of(null);
  }

  updateDoctores(data: any) {
    this.doctores = data;
    return of(null);
  }

  deleteDoctor(id: string) {
    this.doctores = this.doctores.filter(doctor => doctor.id !== id);
    return of(null);
  }

  generateId(): string {
    return '_' + Math.random().toString(36).substr(2, 9);
  }
}

describe('DashboardComponent', () => {
  let component: DashboardComponent;
  let fixture: ComponentFixture<DashboardComponent>;
  let jsonService: MockJsonService;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FormsModule, RouterTestingModule, HttpClientModule, DashboardComponent],
      providers: [{ provide: JsonService, useClass: MockJsonService }]
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DashboardComponent);
    component = fixture.componentInstance;
    jsonService = TestBed.inject(JsonService) as unknown as MockJsonService;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should load users from JsonService', () => {
    component.ngOnInit();
    expect(component.usuarios).toEqual(jsonService.usuarios);
  });

  it('should add a user correctly', () => {
    const initialLength = component.usuarios.length;
    const newUser = { nombre: 'Jane', apellido: 'Doe', correo: 'jane.doe@example.com', rol: 'user' };

    component.usuarioActualEdicion = newUser;
    component.guardarUsuario(new Event('submit'));

    expect(component.usuarios.length).toBe(initialLength + 1);
    expect(component.usuarios[component.usuarios.length - 1]).toEqual(newUser);
  });

  it('should delete a user correctly', () => {
    const initialLength = component.usuarios.length;
    const userToDelete = jsonService.usuarios[0];

    component.eliminarUsuario(userToDelete);

    expect(component.usuarios.length).toBe(initialLength - 1);
    expect(component.usuarios.some(u => u.correo === userToDelete.correo)).toBeFalse();
  });

  it('should load doctors from JsonService', () => {
    component.ngOnInit();
    expect(component.doctores).toEqual(jsonService.doctores);
  });

  it('should load institutions from JsonService', () => {
    component.ngOnInit();
    expect(component.instituciones).toEqual(jsonService.instituciones);
  });
});
