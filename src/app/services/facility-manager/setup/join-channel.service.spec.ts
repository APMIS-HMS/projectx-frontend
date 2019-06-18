import { TestBed, inject } from '@angular/core/testing';

import { JoinChannelService } from './join-channel.service';

describe('JoinChannelService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [JoinChannelService]
    });
  });

  it('should be created', inject([JoinChannelService], (service: JoinChannelService) => {
    expect(service).toBeTruthy();
  }));
});
