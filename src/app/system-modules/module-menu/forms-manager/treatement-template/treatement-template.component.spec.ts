import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TreatementTemplateComponent } from './treatement-template.component';

describe('TreatementTemplateComponent', () => {
  let component: TreatementTemplateComponent;
  let fixture: ComponentFixture<TreatementTemplateComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TreatementTemplateComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TreatementTemplateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
