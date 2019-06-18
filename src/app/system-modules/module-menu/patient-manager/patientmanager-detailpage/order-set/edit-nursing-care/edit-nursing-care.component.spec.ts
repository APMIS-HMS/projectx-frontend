import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EditNursingCareComponent } from './edit-nursing-care.component';

describe('EditNursingCareComponent', () => {
  let component: EditNursingCareComponent;
  let fixture: ComponentFixture<EditNursingCareComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EditNursingCareComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EditNursingCareComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
