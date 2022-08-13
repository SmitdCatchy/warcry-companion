import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AbilitiesBottomSheetComponent } from './abilities-bottom-sheet.component';

describe('AbilitiesBottomSheetComponent', () => {
  let component: AbilitiesBottomSheetComponent;
  let fixture: ComponentFixture<AbilitiesBottomSheetComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AbilitiesBottomSheetComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AbilitiesBottomSheetComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
