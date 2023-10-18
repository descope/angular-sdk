import { TestBed } from '@angular/core/testing';

import { DescopeAuthService } from './descope-auth.service';
import {DescopeAuthConfig} from "./descope-auth.module";

describe('AngularSdkService', () => {
	let service: DescopeAuthService;

	beforeEach(() => {
		TestBed.configureTestingModule({
      providers: [
        DescopeAuthConfig,
        { provide: DescopeAuthConfig, useValue: { projectId: "someProject" } }
      ]
    });
		service = TestBed.inject(DescopeAuthService);
	});

	it('should be created', () => {
		expect(service).toBeTruthy();
	});
});
