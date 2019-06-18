import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TemplateDrugComponent } from './template-drug.component';

describe('TemplateDrugComponent', () => {
  let component: TemplateDrugComponent;
  let fixture: ComponentFixture<TemplateDrugComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TemplateDrugComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TemplateDrugComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
