import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ManufacturerManagerComponent } from './manufacturer-manager.component';

describe('ManufacturerManagerComponent', () => {
  let component: ManufacturerManagerComponent;
  let fixture: ComponentFixture<ManufacturerManagerComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ManufacturerManagerComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ManufacturerManagerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
