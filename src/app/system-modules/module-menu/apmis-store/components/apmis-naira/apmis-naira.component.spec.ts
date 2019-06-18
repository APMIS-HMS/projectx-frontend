import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ApmisNairaComponent } from './apmis-naira.component';

describe('ApmisNairaComponent', () => {
  let component: ApmisNairaComponent;
  let fixture: ComponentFixture<ApmisNairaComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ApmisNairaComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ApmisNairaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
