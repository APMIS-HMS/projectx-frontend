import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TemplatePhysicianOrderComponent } from './template-physician-order.component';

describe('TemplatePhysicianOrderComponent', () => {
  let component: TemplatePhysicianOrderComponent;
  let fixture: ComponentFixture<TemplatePhysicianOrderComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TemplatePhysicianOrderComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TemplatePhysicianOrderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
