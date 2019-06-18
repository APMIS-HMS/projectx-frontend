/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

import { ApmisStoreCheckInComponent } from './apmis-store-check-in.component';

describe('ApmisStoreCheckInComponent', () => {
	let component: ApmisStoreCheckInComponent;
	let fixture: ComponentFixture<ApmisStoreCheckInComponent>;

	beforeEach(
		async(() => {
			TestBed.configureTestingModule({
				declarations: [ ApmisStoreCheckInComponent ]
			}).compileComponents();
		})
	);

	beforeEach(() => {
		fixture = TestBed.createComponent(ApmisStoreCheckInComponent);
		component = fixture.componentInstance;
		fixture.detectChanges();
	});

	it('should create', () => {
		expect(component).toBeTruthy();
	});
});
