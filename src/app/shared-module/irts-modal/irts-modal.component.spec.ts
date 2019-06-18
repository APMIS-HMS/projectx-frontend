import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { IrtsModalComponent } from './irts-modal.component';

describe('IrtsModalComponent', () => {
  let component: IrtsModalComponent;
  let fixture: ComponentFixture<IrtsModalComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ IrtsModalComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(IrtsModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
