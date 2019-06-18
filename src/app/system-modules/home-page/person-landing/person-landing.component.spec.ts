import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PersonLandingComponent } from './person-landing.component';

describe('PersonLandingComponent', () => {
  let component: PersonLandingComponent;
  let fixture: ComponentFixture<PersonLandingComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PersonLandingComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PersonLandingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
