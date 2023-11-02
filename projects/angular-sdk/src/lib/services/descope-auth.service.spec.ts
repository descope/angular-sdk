import { TestBed } from '@angular/core/testing';

import { DescopeAuthService } from './descope-auth.service';
import createSdk from '@descope/web-js-sdk';
import mocked = jest.mocked;
import { DescopeAuthConfig } from '../types/types';

jest.mock('@descope/web-js-sdk');

describe('DescopeAuthService', () => {
	let service: DescopeAuthService;
	let mockedCreateSdk: jest.Mock;
	const onSessionTokenChangeSpy = jest.fn();
	const onUserChangeSpy = jest.fn();
	const mockConfig: DescopeAuthConfig = {
		projectId: 'someProject'
	};

	beforeEach(() => {
		mockedCreateSdk = mocked(createSdk);

		mockedCreateSdk.mockReturnValue({
			onSessionTokenChange: onSessionTokenChangeSpy,
			onUserChange: onUserChangeSpy
		});

		TestBed.configureTestingModule({
			providers: [
				DescopeAuthConfig,
				{ provide: DescopeAuthConfig, useValue: mockConfig }
			]
		});
		service = TestBed.inject(DescopeAuthService);
	});

	it('should be created', () => {
		expect(service).toBeTruthy();
		expect(mockedCreateSdk).toHaveBeenCalledWith(
			expect.objectContaining(mockConfig)
		);
		expect(onSessionTokenChangeSpy).toHaveBeenCalled();
		expect(onUserChangeSpy).toHaveBeenCalled();
	});
});
