import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DailyAntenatalComponent } from './daily-antenatal.component';

describe('DailyAntenatalComponent', () => {
  let component: DailyAntenatalComponent;
  let fixture: ComponentFixture<DailyAntenatalComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DailyAntenatalComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DailyAntenatalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
