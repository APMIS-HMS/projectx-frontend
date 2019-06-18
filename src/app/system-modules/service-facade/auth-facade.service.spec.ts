import { TestBed, inject } from '@angular/core/testing';

import { AuthFacadeService } from './auth-facade.service';

describe('AuthFacadeService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [AuthFacadeService]
    });
  });

  it('should be created', inject([AuthFacadeService], (service: AuthFacadeService) => {
    expect(service).toBeTruthy();
  }));
});
