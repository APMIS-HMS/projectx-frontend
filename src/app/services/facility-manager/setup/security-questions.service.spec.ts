import { TestBed, inject } from '@angular/core/testing';

import { SecurityQuestionsService } from './security-questions.service';

describe('SecurityQuestionsService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [SecurityQuestionsService]
    });
  });

  it('should be created', inject([SecurityQuestionsService], (service: SecurityQuestionsService) => {
    expect(service).toBeTruthy();
  }));
});
