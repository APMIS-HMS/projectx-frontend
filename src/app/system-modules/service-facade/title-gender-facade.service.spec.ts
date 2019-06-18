import { TestBed, inject } from '@angular/core/testing';

import { TitleGenderFacadeService } from './title-gender-facade.service';

describe('TitleGenderFacadeService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [TitleGenderFacadeService]
    });
  });

  it('should be created', inject([TitleGenderFacadeService], (service: TitleGenderFacadeService) => {
    expect(service).toBeTruthy();
  }));
});
