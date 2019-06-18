/* tslint:disable:no-unused-variable */

import { TestBed, async, inject } from '@angular/core/testing';
import { FeatureModuleService } from './feature-module.service';

describe('FeatureModuleService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [FeatureModuleService]
    });
  });

  it('should ...', inject([FeatureModuleService], (service: FeatureModuleService) => {
    expect(service).toBeTruthy();
  }));
});
