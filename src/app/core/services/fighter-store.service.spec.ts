import { TestBed } from '@angular/core/testing';

import { FighterStoreService } from './fighter-store.service';

describe('FighterStoreService', () => {
  let service: FighterStoreService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(FighterStoreService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
