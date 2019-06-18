import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ReorderLevelComponent } from './reorder-level.component';

describe('ReorderLevelComponent', () => {
  let component: ReorderLevelComponent;
  let fixture: ComponentFixture<ReorderLevelComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ReorderLevelComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ReorderLevelComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
