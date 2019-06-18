import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DrugOrdersetComponent } from './drug-orderset.component';

describe('DrugOrdersetComponent', () => {
  let component: DrugOrdersetComponent;
  let fixture: ComponentFixture<DrugOrdersetComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DrugOrdersetComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DrugOrdersetComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
