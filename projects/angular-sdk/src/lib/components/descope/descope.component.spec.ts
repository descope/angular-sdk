import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DescopeComponent } from './descope.component';
import createSdk from '@descope/web-js-sdk';
import mocked = jest.mocked;
import { DescopeAuthConfig } from '../../types/types';

jest.mock('@descope/web-js-sdk');
//Mock DescopeWebComponent
jest.mock('@descope/web-component', () => {
	return jest.fn(() => {
		const element = document.createElement('div'); // Create a mock DOM element
		element.setAttribute = jest.fn();
		element.addEventListener = jest.fn();
		return element;
	});
});

describe('DescopeComponent', () => {
	let component: DescopeComponent;
	let fixture: ComponentFixture<DescopeComponent>;
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
			declarations: [DescopeComponent],
			providers: [
				DescopeAuthConfig,
				{ provide: DescopeAuthConfig, useValue: mockConfig }
			]
		});

		fixture = TestBed.createComponent(DescopeComponent);
		component = fixture.componentInstance;
		fixture.detectChanges();
	});

	it('should create', () => {
		expect(component).toBeTruthy();
	});
});
