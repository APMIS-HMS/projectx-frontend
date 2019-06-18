import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ConsumableEntryComponent } from './consumable-entry.component';

describe('ConsumableEntryComponent', () => {
  let component: ConsumableEntryComponent;
  let fixture: ComponentFixture<ConsumableEntryComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ConsumableEntryComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ConsumableEntryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
<<<<<<< HEAD
});
=======
});
>>>>>>> ab0a644967becfaf526976c70c7d6612dab07fb6
