import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PersonAccountComponent } from './person-account.component';

describe('PersonAccountComponent', () => {
  let component: PersonAccountComponent;
  let fixture: ComponentFixture<PersonAccountComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PersonAccountComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PersonAccountComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
