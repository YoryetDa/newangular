import { TestBed } from '@angular/core/testing';
import { JsonService } from './json.service';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { config } from '../../config';

describe('JsonService', () => {
  let service: JsonService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [JsonService]
    });
    service = TestBed.inject(JsonService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should retrieve users from the API', () => {
    const dummyUsers = [
      { nombre: 'John', apellido: 'Doe', correo: 'john.doe@example.com', rol: 'user' },
      { nombre: 'Jane', apellido: 'Doe', correo: 'jane.doe@example.com', rol: 'admin' }
    ];

    service.getUsuarios().subscribe(users => {
      expect(users.length).toBe(2);
      expect(users).toEqual(dummyUsers);
    });

    const req = httpMock.expectOne(`${config.apiUrl}usuarios.json?alt=media&token=${config.tokens.usuarios}`);
    expect(req.request.method).toBe('GET');
    req.flush(dummyUsers);
  });

  it('should retrieve doctors from the API', () => {
    const dummyDoctors = [
      { nombre: 'Doctor 1', especialidad: 'Cardiología' },
      { nombre: 'Doctor 2', especialidad: 'Dermatología' }
    ];

    service.getDoctores().subscribe(doctors => {
      expect(doctors.length).toBe(2);
      expect(doctors).toEqual(dummyDoctors);
    });

    const req = httpMock.expectOne(`${config.apiUrl}doctores.json?alt=media&token=${config.tokens.doctores}`);
    expect(req.request.method).toBe('GET');
    req.flush(dummyDoctors);
  });
});
