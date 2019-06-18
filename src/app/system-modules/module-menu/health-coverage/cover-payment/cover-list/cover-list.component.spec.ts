import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CoverListComponent } from './cover-list.component';

describe('CoverListComponent', () => {
  let component: CoverListComponent;
  let fixture: ComponentFixture<CoverListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CoverListComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CoverListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
