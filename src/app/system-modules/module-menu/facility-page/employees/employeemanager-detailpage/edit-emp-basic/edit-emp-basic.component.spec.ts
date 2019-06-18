import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EditEmpBasicComponent } from './edit-emp-basic.component';

describe('EditEmpBasicComponent', () => {
  let component: EditEmpBasicComponent;
  let fixture: ComponentFixture<EditEmpBasicComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EditEmpBasicComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EditEmpBasicComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
