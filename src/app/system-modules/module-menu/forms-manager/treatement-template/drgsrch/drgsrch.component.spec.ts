import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DrgsrchComponent } from './drgsrch.component';

describe('DrgsrchComponent', () => {
  let component: DrgsrchComponent;
  let fixture: ComponentFixture<DrgsrchComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DrgsrchComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DrgsrchComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
