import { TestBed, inject } from '@angular/core/testing';

import { CountryServiceFacadeService } from './country-service-facade.service';

describe('CountryServiceFacadeService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [CountryServiceFacadeService]
    });
  });

  it('should be created', inject([CountryServiceFacadeService], (service: CountryServiceFacadeService) => {
    expect(service).toBeTruthy();
  }));
});
