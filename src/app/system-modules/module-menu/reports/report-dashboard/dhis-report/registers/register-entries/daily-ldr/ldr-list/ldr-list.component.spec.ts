import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { LdrListComponent } from './ldr-list.component';

describe('LdrListComponent', () => {
  let component: LdrListComponent;
  let fixture: ComponentFixture<LdrListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ LdrListComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LdrListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
