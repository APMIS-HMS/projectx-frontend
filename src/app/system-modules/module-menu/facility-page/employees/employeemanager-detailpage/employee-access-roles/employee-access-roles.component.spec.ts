import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EmployeeAccessRolesComponent } from './employee-access-roles.component';

describe('EmployeeAccessRolesComponent', () => {
  let component: EmployeeAccessRolesComponent;
  let fixture: ComponentFixture<EmployeeAccessRolesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EmployeeAccessRolesComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EmployeeAccessRolesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
