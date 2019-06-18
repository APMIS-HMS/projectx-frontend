import { TestBed, inject } from '@angular/core/testing';

import { FacilityTypeFacilityClassFacadeService } from './facility-type-facility-class-facade.service';

describe('FacilityTypeFacilityClassFacadeService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [FacilityTypeFacilityClassFacadeService]
    });
  });

  it('should be created', inject([FacilityTypeFacilityClassFacadeService], (service: FacilityTypeFacilityClassFacadeService) => {
    expect(service).toBeTruthy();
  }));
});
