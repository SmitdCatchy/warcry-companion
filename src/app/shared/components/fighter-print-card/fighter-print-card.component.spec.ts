import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FighterPrintCardComponent } from './fighter-print-card.component';

describe('FighterPrintCardComponent', () => {
  let component: FighterPrintCardComponent;
  let fixture: ComponentFixture<FighterPrintCardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ FighterPrintCardComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FighterPrintCardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
