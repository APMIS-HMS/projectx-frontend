import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { InavailabilityComponent } from './inavailability.component';

describe('InavailabilityComponent', () => {
  let component: InavailabilityComponent;
  let fixture: ComponentFixture<InavailabilityComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ InavailabilityComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(InavailabilityComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
