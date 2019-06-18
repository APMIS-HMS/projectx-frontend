import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { WardCheckInComponent } from './ward-check-in.component';

describe('WardCheckInComponent', () => {
  let component: WardCheckInComponent;
  let fixture: ComponentFixture<WardCheckInComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ WardCheckInComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(WardCheckInComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
