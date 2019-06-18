import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DailyOpdComponent } from './daily-opd.component';

describe('DailyOpdComponent', () => {
  let component: DailyOpdComponent;
  let fixture: ComponentFixture<DailyOpdComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DailyOpdComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DailyOpdComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
