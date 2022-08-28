import { TestBed } from '@angular/core/testing';

import { DialogGuard } from './dialog.guard';

describe('DialogGuard', () => {
  let guard: DialogGuard;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    guard = TestBed.inject(DialogGuard);
  });

  it('should be created', () => {
    expect(guard).toBeTruthy();
  });
});
