import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AngularSdkComponent } from './angular-sdk.component';
import {DescopeAuthConfig} from "./descope-auth.module";

describe('AngularSdkComponent', () => {
	let component: AngularSdkComponent;
	let fixture: ComponentFixture<AngularSdkComponent>;

	beforeEach(() => {
		TestBed.configureTestingModule({
			declarations: [AngularSdkComponent],
			providers: [
				DescopeAuthConfig,
				{ provide: DescopeAuthConfig, useValue: { projectId: "test" } }
			]
		});
		fixture = TestBed.createComponent(AngularSdkComponent);
		component = fixture.componentInstance;
		fixture.detectChanges();
	});

	it('should create', () => {
		expect(component).toBeTruthy();
	});
});
