import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PregnancyManagerComponent } from './pregnancy-manager.component';

describe('PregnancyManagerComponent', () => {
  let component: PregnancyManagerComponent;
  let fixture: ComponentFixture<PregnancyManagerComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PregnancyManagerComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PregnancyManagerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
