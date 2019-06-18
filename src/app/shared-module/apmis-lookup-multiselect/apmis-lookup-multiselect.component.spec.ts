import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ApmisLookupMultiselectComponent } from './apmis-lookup-multiselect.component';

describe('ApmisLookupMultiselectComponent', () => {
  let component: ApmisLookupMultiselectComponent;
  let fixture: ComponentFixture<ApmisLookupMultiselectComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ApmisLookupMultiselectComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ApmisLookupMultiselectComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
