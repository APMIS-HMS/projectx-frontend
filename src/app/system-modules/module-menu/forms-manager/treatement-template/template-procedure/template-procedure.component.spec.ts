import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TemplateProcedureComponent } from './template-procedure.component';

describe('TemplateProcedureComponent', () => {
  let component: TemplateProcedureComponent;
  let fixture: ComponentFixture<TemplateProcedureComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TemplateProcedureComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TemplateProcedureComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
