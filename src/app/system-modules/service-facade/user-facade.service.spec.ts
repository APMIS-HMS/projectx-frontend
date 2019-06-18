import { TestBed, inject } from '@angular/core/testing';

import { UserFacadeService } from './user-facade.service';

describe('UserFacadeService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [UserFacadeService]
    });
  });

  it('should be created', inject([UserFacadeService], (service: UserFacadeService) => {
    expect(service).toBeTruthy();
  }));
});
