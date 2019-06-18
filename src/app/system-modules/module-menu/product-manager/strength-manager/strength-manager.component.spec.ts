import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { StrengthManagerComponent } from './strength-manager.component';

describe('StrengthManagerComponent', () => {
  let component: StrengthManagerComponent;
  let fixture: ComponentFixture<StrengthManagerComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ StrengthManagerComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(StrengthManagerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
