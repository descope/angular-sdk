import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProtectedComponent } from './protected.component';
import createSdk from '@descope/web-js-sdk';
import mocked = jest.mocked;
import { DescopeAuthConfig } from '../../../../angular-sdk/src/lib/types/types';

jest.mock('@descope/web-js-sdk');

describe('ProtectedComponent', () => {
	let component: ProtectedComponent;
	let fixture: ComponentFixture<ProtectedComponent>;

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
			declarations: [ProtectedComponent],
			providers: [
				DescopeAuthConfig,
				{ provide: DescopeAuthConfig, useValue: { projectId: 'test' } }
			]
		});
		fixture = TestBed.createComponent(ProtectedComponent);
		component = fixture.componentInstance;
		fixture.detectChanges();
	});

	it('should create', () => {
		expect(component).toBeTruthy();
	});
});
