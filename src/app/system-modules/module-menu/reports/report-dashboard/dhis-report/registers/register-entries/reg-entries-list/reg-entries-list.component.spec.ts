import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RegEntriesListComponent } from './reg-entries-list.component';

describe('RegEntriesListComponent', () => {
  let component: RegEntriesListComponent;
  let fixture: ComponentFixture<RegEntriesListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RegEntriesListComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RegEntriesListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
