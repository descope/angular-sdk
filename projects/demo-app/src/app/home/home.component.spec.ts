import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HomeComponent } from './home.component';
import { DescopeAuthConfig } from '../../../../angular-sdk/src/lib/descope-auth.module';
import createSdk from '@descope/web-js-sdk';
import mocked = jest.mocked;

jest.mock('@descope/web-js-sdk');

describe('HomeComponent', () => {
	let component: HomeComponent;
	let fixture: ComponentFixture<HomeComponent>;

	let mockedCreateSdk: jest.Mock;
	const onSessionTokenChangeSpy = jest.fn();
	const onUserChangeSpy = jest.fn();

	beforeEach(() => {
		mockedCreateSdk = mocked(createSdk);
		mockedCreateSdk.mockReturnValue({
			onSessionTokenChange: onSessionTokenChangeSpy,
			onUserChange: onUserChangeSpy
		});

		TestBed.configureTestingModule({
			declarations: [HomeComponent],
			providers: [
				DescopeAuthConfig,
				{ provide: DescopeAuthConfig, useValue: { projectId: 'test' } }
			]
		});
		fixture = TestBed.createComponent(HomeComponent);
		component = fixture.componentInstance;
		fixture.detectChanges();
	});

	it('should create', () => {
		expect(component).toBeTruthy();
	});
});
