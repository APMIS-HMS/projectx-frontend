import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DailyLdrComponent } from './daily-ldr.component';

describe('DailyLdrComponent', () => {
  let component: DailyLdrComponent;
  let fixture: ComponentFixture<DailyLdrComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DailyLdrComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DailyLdrComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
