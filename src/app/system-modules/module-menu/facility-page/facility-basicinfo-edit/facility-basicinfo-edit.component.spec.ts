import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FacilityBasicinfoEditComponent } from './facility-basicinfo-edit.component';

describe('FacilityBasicinfoEditComponent', () => {
  let component: FacilityBasicinfoEditComponent;
  let fixture: ComponentFixture<FacilityBasicinfoEditComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FacilityBasicinfoEditComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FacilityBasicinfoEditComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
