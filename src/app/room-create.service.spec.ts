import { TestBed, inject } from '@angular/core/testing';

import { RoomCreateService } from './room-create.service';

describe('RoomCreateService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [RoomCreateService]
    });
  });

  it('should ...', inject([RoomCreateService], (service: RoomCreateService) => {
    expect(service).toBeTruthy();
  }));
});
