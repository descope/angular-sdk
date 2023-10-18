import { TestBed } from '@angular/core/testing';

import { DescopeAuthService } from './descope-auth.service';
import { DescopeAuthConfig } from './descope-auth.module';

jest.mock('@descope/web-js-sdk');

describe('AngularSdkService', () => {
	let service: DescopeAuthService;
	// Create a mock for the createSdk function
	const createSdkMock = jest.fn();

	beforeEach(() => {
		TestBed.configureTestingModule({
			providers: [
				DescopeAuthConfig,
				{ provide: DescopeAuthConfig, useValue: { projectId: 'someProject' } }
			]
		});
		service = TestBed.inject(DescopeAuthService);
	});

	it('should be created', () => {
		expect(service).toBeTruthy();
	});
});
