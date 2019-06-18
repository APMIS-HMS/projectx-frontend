import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RmNewRequestComponent } from './rm-new-request.component';

describe('RmNewRequestComponent', () => {
  let component: RmNewRequestComponent;
  let fixture: ComponentFixture<RmNewRequestComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RmNewRequestComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RmNewRequestComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
