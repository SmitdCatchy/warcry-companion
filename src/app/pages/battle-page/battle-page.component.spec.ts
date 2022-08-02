import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BattlePageComponent } from './battle-page.component';

describe('BattlePageComponent', () => {
  let component: BattlePageComponent;
  let fixture: ComponentFixture<BattlePageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ BattlePageComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BattlePageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
