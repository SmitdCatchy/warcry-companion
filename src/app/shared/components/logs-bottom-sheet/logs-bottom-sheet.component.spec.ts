import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LogsBottomSheetComponent } from './logs-bottom-sheet.component';

describe('LogsBottomSheetComponent', () => {
  let component: LogsBottomSheetComponent;
  let fixture: ComponentFixture<LogsBottomSheetComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ LogsBottomSheetComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(LogsBottomSheetComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
