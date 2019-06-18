import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DailyIrtsComponent } from './daily-irts.component';

describe('DailyIrtsComponent', () => {
  let component: DailyIrtsComponent;
  let fixture: ComponentFixture<DailyIrtsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DailyIrtsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DailyIrtsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
