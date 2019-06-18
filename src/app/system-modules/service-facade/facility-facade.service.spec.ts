import { TestBed, inject } from '@angular/core/testing';

import { FacilityFacadeService } from './facility-facade.service';

describe('FacilityFacadeService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [FacilityFacadeService]
    });
  });

  it('should be created', inject([FacilityFacadeService], (service: FacilityFacadeService) => {
    expect(service).toBeTruthy();
  }));
});
