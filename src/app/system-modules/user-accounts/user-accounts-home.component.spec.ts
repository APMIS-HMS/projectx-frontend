import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { UserAccountsHomeComponent } from './user-accounts-home.component';

describe('UserAccountsHomeComponent', () => {
  let component: UserAccountsHomeComponent;
  let fixture: ComponentFixture<UserAccountsHomeComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ UserAccountsHomeComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(UserAccountsHomeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
