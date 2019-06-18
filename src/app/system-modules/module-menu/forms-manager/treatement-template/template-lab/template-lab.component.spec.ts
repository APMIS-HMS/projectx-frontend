import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TemplateLabComponent } from './template-lab.component';

describe('TemplateLabComponent', () => {
  let component: TemplateLabComponent;
  let fixture: ComponentFixture<TemplateLabComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TemplateLabComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TemplateLabComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
