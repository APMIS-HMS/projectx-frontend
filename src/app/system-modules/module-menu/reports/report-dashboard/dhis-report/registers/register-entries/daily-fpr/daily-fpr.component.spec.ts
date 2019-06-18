import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DailyFprComponent } from './daily-fpr.component';

describe('DailyFprComponent', () => {
  let component: DailyFprComponent;
  let fixture: ComponentFixture<DailyFprComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DailyFprComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DailyFprComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
