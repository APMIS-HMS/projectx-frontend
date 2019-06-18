import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ScheduleFrmComponent } from './schedule-frm.component';

describe('ScheduleFrmComponent', () => {
  let component: ScheduleFrmComponent;
  let fixture: ComponentFixture<ScheduleFrmComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ScheduleFrmComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ScheduleFrmComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
