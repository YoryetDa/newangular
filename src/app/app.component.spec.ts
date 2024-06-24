import { TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { AppComponent } from './app.component';

// Descripción del grupo de pruebas para AppComponent
describe('AppComponent', () => {
  // Configuración del módulo de prueba
  beforeEach(async () => {
    // Configura el TestBed con los módulos necesarios y el componente a probar
    await TestBed.configureTestingModule({
      imports: [RouterTestingModule, AppComponent]  // Importa RouterTestingModule y AppComponent
    }).compileComponents(); // Compila los componentes
  });

  // Prueba para verificar que el componente se crea correctamente
  it('should create the app', () => {
    const fixture = TestBed.createComponent(AppComponent); // Crea una instancia del componente y del fixture
    const app = fixture.componentInstance; // Obtiene la instancia del componente
    expect(app).toBeTruthy(); // Verifica que el componente se crea correctamente
  });

  // Prueba para verificar que la propiedad 'title' del componente tiene el valor esperado
  it(`should have as title 'mimedisan'`, () => {
    const fixture = TestBed.createComponent(AppComponent); // Crea una instancia del componente y del fixture
    const app = fixture.componentInstance; // Obtiene la instancia del componente
    expect(app.title).toEqual('mimedisan'); // Verifica que la propiedad 'title' del componente es 'mimedisan'
  });

  // Prueba para verificar que el componente renderiza el navbar
  it('should render the navbar', () => {
    const fixture = TestBed.createComponent(AppComponent); // Crea una instancia del componente y del fixture
    fixture.detectChanges(); // Detecta cambios para actualizar la vista
    const compiled = fixture.nativeElement as HTMLElement; // Obtiene el elemento nativo del DOM
    expect(compiled.querySelector('app-navbar')).not.toBeNull(); // Verifica que el navbar se renderiza en la vista
  });
});
