import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { OptionScopeLevelComponent } from './option-scope-level.component';

describe('OptionScopeLevelComponent', () => {
  let component: OptionScopeLevelComponent;
  let fixture: ComponentFixture<OptionScopeLevelComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ OptionScopeLevelComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(OptionScopeLevelComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
