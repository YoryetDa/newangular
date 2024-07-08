import { ComponentFixture, TestBed } from '@angular/core/testing';
import { DoctorComponent } from './doctor.component';
import { HttpClientModule } from '@angular/common/http';
import { JsonService } from '../../services/json.service';

describe('DoctorComponent', () => {
  let component: DoctorComponent;
  let fixture: ComponentFixture<DoctorComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HttpClientModule, DoctorComponent], // Importar DoctorComponent aquí
      providers: [JsonService]
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DoctorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
