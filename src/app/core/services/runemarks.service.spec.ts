import { TestBed } from '@angular/core/testing';

import { RunemarksService } from './runemarks.service';

describe('RunemarksService', () => {
  let service: RunemarksService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(RunemarksService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
