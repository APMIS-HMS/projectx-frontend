import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TemplateNursingCareComponent } from './template-nursing-care.component';

describe('TemplateNursingCareComponent', () => {
  let component: TemplateNursingCareComponent;
  let fixture: ComponentFixture<TemplateNursingCareComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TemplateNursingCareComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TemplateNursingCareComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
