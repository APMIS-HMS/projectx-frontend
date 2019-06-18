import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DailyGmpComponent } from './daily-gmp.component';

describe('DailyGmpComponent', () => {
  let component: DailyGmpComponent;
  let fixture: ComponentFixture<DailyGmpComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DailyGmpComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DailyGmpComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
