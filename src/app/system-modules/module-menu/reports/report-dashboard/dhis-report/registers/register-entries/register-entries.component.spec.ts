import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RegisterEntriesComponent } from './register-entries.component';

describe('RegisterEntriesComponent', () => {
  let component: RegisterEntriesComponent;
  let fixture: ComponentFixture<RegisterEntriesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RegisterEntriesComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RegisterEntriesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
