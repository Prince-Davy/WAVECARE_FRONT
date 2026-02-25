import { TestBed } from '@angular/core/testing';
import { provideHttpClientTesting, HttpTestingController } from '@angular/common/http/testing';

import { PatientService } from './patient.service';
import { AuthTokenService } from '@app/features/auth/services/auth-token.service';
import { PatientDetailDto } from '../models/patient-detail.dto';

describe('PatientService', () => {
  let service: PatientService;
  let httpMock: HttpTestingController;
  let tokenService: jasmine.SpyObj<AuthTokenService>;

  beforeEach(() => {
    const spy = jasmine.createSpyObj('AuthTokenService', ['getToken']);

    TestBed.configureTestingModule({
      providers: [provideHttpClientTesting(), { provide: AuthTokenService, useValue: spy }]
    });

    service = TestBed.inject(PatientService);
    httpMock = TestBed.inject(HttpTestingController);
    tokenService = TestBed.inject(AuthTokenService) as jasmine.SpyObj<AuthTokenService>;
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('getPatientDetail should request the correct url with authorization header', () => {
    const dummyPatient: PatientDetailDto = {
      id: '123',
      firstName: 'Jean',
      lastName: 'Dupont',
      nss: '987654321',
      ins: 'INS123',
      birthDate: new Date('1990-01-01'),
      birthName: 'Dupont',
      maritalName: '',
      maritalStatus: 'SINGLE',
      birthPlace: 'Paris',
      nationality: 'FR',
      gender: 'MALE',
      address: '1 rue de Test',
      phone: '0123456789',
      email: 'jean.dupont@example.com',
      trustedContact: { firstName: 'Marie', lastName: 'Dupond', phone: '0987654321' },
      healthCoverage: { insurance: 'Mutuelle', policy: 'ABC123' }
    };

    tokenService.getToken.and.returnValue('fake-token');

    service.getPatientDetail('123').subscribe(patient => {
      expect(patient).toEqual(dummyPatient);
    });

    const req = httpMock.expectOne('/api/patients/123');
    expect(req.request.method).toBe('GET');
    expect(req.request.headers.get('Authorization')).toBe('Bearer fake-token');
    req.flush(dummyPatient);
  });
});