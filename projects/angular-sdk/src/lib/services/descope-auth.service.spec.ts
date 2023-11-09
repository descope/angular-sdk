import { TestBed } from '@angular/core/testing';

import { DescopeAuthService } from './descope-auth.service';
import createSdk from '@descope/web-js-sdk';
import mocked = jest.mocked;
import { DescopeAuthConfig } from '../types/types';

jest.mock('@descope/web-js-sdk');

describe('DescopeAuthService', () => {
	let service: DescopeAuthService;
	let mockedCreateSdk: jest.Mock;
	let windowSpy: jest.SpyInstance;
	const onSessionTokenChangeSpy = jest.fn();
	const onUserChangeSpy = jest.fn();
	const getSessionTokenSpy = jest.fn();
	const getRefreshTokenSpy = jest.fn();
	const mockConfig: DescopeAuthConfig = {
		projectId: 'someProject'
	};

	beforeEach(() => {
		mockedCreateSdk = mocked(createSdk);
		windowSpy = jest.spyOn(window, 'window', 'get');

		mockedCreateSdk.mockReturnValue({
			onSessionTokenChange: onSessionTokenChangeSpy,
			onUserChange: onUserChangeSpy,
			getSessionToken: getSessionTokenSpy,
			getRefreshToken: getRefreshTokenSpy
		});

		TestBed.configureTestingModule({
			providers: [
				DescopeAuthConfig,
				{ provide: DescopeAuthConfig, useValue: mockConfig }
			]
		});
		service = TestBed.inject(DescopeAuthService);
	});

	afterEach(() => {
		getSessionTokenSpy.mockReset();
		getRefreshTokenSpy.mockReset();
	});

	it('should be created', () => {
		expect(service).toBeTruthy();
		expect(mockedCreateSdk).toHaveBeenCalledWith(
			expect.objectContaining(mockConfig)
		);
		expect(onSessionTokenChangeSpy).toHaveBeenCalled();
		expect(onUserChangeSpy).toHaveBeenCalled();
	});

	describe('getSessionToken', () => {
		it('should call getSessionToken from sdk', () => {
			service.getSessionToken();
			expect(getSessionTokenSpy).toHaveBeenCalled();
		});

		it('should warn when using getSessionToken in non browser environment', () => {
			const warnSpy = jest.spyOn(console, 'warn');
			windowSpy.mockImplementationOnce(() => undefined);

			service.getSessionToken();

			expect(warnSpy).toHaveBeenCalledWith(
				'Get session token is not supported in SSR'
			);
			expect(getSessionTokenSpy).not.toHaveBeenCalled();
		});
	});

	describe('getRefreshToken', () => {
		it('should call getRefreshToken from sdk', () => {
			service.getRefreshToken();
			expect(getRefreshTokenSpy).toHaveBeenCalled();
		});

		it('should warn when using getRefreshToken in non browser environment', () => {
			const warnSpy = jest.spyOn(console, 'warn');
			windowSpy.mockImplementationOnce(() => undefined);

			service.getRefreshToken();

			expect(warnSpy).toHaveBeenCalledWith(
				'Get refresh token is not supported in SSR'
			);
			expect(getRefreshTokenSpy).not.toHaveBeenCalled();
		});
	});
});
