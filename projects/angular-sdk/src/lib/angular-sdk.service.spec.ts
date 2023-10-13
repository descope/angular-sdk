import { TestBed } from '@angular/core/testing';

import { DescopeAuthService } from './descope-auth.service';

describe('AngularSdkService', () => {
	let service: DescopeAuthService;

	beforeEach(() => {
		TestBed.configureTestingModule({});
		service = TestBed.inject(DescopeAuthService);
	});

	it('should be created', () => {
		expect(service).toBeTruthy();
	});
});
