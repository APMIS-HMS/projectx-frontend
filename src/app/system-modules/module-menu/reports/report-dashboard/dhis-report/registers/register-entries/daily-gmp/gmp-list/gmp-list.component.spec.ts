import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { GmpListComponent } from './gmp-list.component';

describe('GmpListComponent', () => {
  let component: GmpListComponent;
  let fixture: ComponentFixture<GmpListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ GmpListComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(GmpListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
