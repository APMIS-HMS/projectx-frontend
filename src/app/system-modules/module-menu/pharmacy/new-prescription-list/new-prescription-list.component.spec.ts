import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { NewPrescriptionListComponent } from './new-prescription-list.component';

describe('NewPrescriptionListComponent', () => {
  let component: NewPrescriptionListComponent;
  let fixture: ComponentFixture<NewPrescriptionListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ NewPrescriptionListComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NewPrescriptionListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
