import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PrescribedTableComponent } from './prescribed-table.component';

describe('PrescribedTableComponent', () => {
  let component: PrescribedTableComponent;
  let fixture: ComponentFixture<PrescribedTableComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PrescribedTableComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PrescribedTableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
