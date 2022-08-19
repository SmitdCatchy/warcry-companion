import { TestBed } from '@angular/core/testing';

import { BattlegroundsService } from './battlegrounds.service';

describe('BattlegroundsService', () => {
  let service: BattlegroundsService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(BattlegroundsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
