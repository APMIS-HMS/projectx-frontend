import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { GenericManagerComponent } from './generic-manager.component';

describe('GenericManagerComponent', () => {
  let component: GenericManagerComponent;
  let fixture: ComponentFixture<GenericManagerComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ GenericManagerComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(GenericManagerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
