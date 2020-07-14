import { TestBed } from '@angular/core/testing';

import { RegistroEnviosService } from './registro-envios.service';

describe('RegistroEnviosService', () => {
  let service: RegistroEnviosService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(RegistroEnviosService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
