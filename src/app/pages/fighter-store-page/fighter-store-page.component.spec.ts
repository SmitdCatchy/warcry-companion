import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FighterStorePageComponent } from './fighter-store-page.component';

describe('FighterStorePageComponent', () => {
  let component: FighterStorePageComponent;
  let fixture: ComponentFixture<FighterStorePageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ FighterStorePageComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FighterStorePageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
