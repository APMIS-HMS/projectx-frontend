import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FluidTypeComponent } from './fluid-type.component';

describe('FluidTypeComponent', () => {
  let component: FluidTypeComponent;
  let fixture: ComponentFixture<FluidTypeComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FluidTypeComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FluidTypeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
