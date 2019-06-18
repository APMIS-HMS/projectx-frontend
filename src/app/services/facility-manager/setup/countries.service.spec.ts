/* tslint:disable:no-unused-variable */

import { TestBed, async, inject } from '@angular/core/testing';
import { CountriesService } from './countries.service';

describe('CountriesService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [CountriesService]
    });
  });

  it('should ...', inject([CountriesService], (service: CountriesService) => {
    expect(service).toBeTruthy();
  }));
});
