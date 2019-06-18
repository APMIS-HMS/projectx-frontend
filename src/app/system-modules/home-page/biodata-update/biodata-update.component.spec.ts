import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BiodataUpdateComponent } from './biodata-update.component';

describe('BiodataUpdateComponent', () => {
  let component: BiodataUpdateComponent;
  let fixture: ComponentFixture<BiodataUpdateComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BiodataUpdateComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BiodataUpdateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
