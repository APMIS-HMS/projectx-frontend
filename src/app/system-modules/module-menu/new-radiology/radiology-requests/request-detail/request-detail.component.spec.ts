import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { NewRadiologyRequestDetailComponent } from './request-detail.component';

describe('NewRadiologyRequestDetailComponent', () => {
	let component: NewRadiologyRequestDetailComponent;
	let fixture: ComponentFixture<NewRadiologyRequestDetailComponent>;

	beforeEach(async(() => {
		TestBed.configureTestingModule({
			declarations: [NewRadiologyRequestDetailComponent],
		}).compileComponents();
	}));

	beforeEach(() => {
		fixture = TestBed.createComponent(NewRadiologyRequestDetailComponent);
		component = fixture.componentInstance;
		fixture.detectChanges();
	});

	it('should be created', () => {
		expect(component).toBeTruthy();
	});
});
