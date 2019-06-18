import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { InitializeStoreComponent } from './initialize-store.component';

describe('InitializeStoreComponent', () => {
  let component: InitializeStoreComponent;
  let fixture: ComponentFixture<InitializeStoreComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ InitializeStoreComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(InitializeStoreComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
