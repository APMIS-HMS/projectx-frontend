import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EditPhysicianOrderComponent } from './edit-physician-order.component';

describe('EditPhysicianOrderComponent', () => {
  let component: EditPhysicianOrderComponent;
  let fixture: ComponentFixture<EditPhysicianOrderComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EditPhysicianOrderComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EditPhysicianOrderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
