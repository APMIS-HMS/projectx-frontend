import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { NoprescriptionComponent } from './noprescription.component';

describe('NoprescriptionComponent', () => {
  let component: NoprescriptionComponent;
  let fixture: ComponentFixture<NoprescriptionComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ NoprescriptionComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NoprescriptionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
