import { TestBed } from '@angular/core/testing';

import { WarbandService } from './warband.service';

describe('WarbandService', () => {
  let service: WarbandService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(WarbandService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
