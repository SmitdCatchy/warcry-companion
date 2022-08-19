import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BattlegroundsPageComponent } from './battlegrounds-page.component';

describe('BattlegroundsPageComponent', () => {
  let component: BattlegroundsPageComponent;
  let fixture: ComponentFixture<BattlegroundsPageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ BattlegroundsPageComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BattlegroundsPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
