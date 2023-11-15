import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DescopeComponent } from './descope.component';
import createSdk from '@descope/web-js-sdk';
import { DescopeAuthConfig } from '../../types/types';
import { CUSTOM_ELEMENTS_SCHEMA, EventEmitter } from '@angular/core';
import mocked = jest.mocked;

jest.mock('@descope/web-js-sdk');
//Mock DescopeWebComponent
jest.mock('@descope/web-component', () => {
	return jest.fn(() => {
		// Create a mock DOM element
		return document.createElement('descope-wc');
	});
});

describe('DescopeComponent', () => {
	let component: DescopeComponent;
	let fixture: ComponentFixture<DescopeComponent>;
	let mockedCreateSdk: jest.Mock;
	const onSessionTokenChangeSpy = jest.fn();
	const onUserChangeSpy = jest.fn();
	const afterRequestHooksSpy = jest.fn();
	const mockConfig: DescopeAuthConfig = {
		projectId: 'someProject'
	};

	beforeEach(() => {
		mockedCreateSdk = mocked(createSdk);

		mockedCreateSdk.mockReturnValue({
			onSessionTokenChange: onSessionTokenChangeSpy,
			onUserChange: onUserChangeSpy,
			httpClient: {
				hooks: {
					afterRequest: afterRequestHooksSpy
				}
			}
		});

		TestBed.configureTestingModule({
			declarations: [DescopeComponent],
			schemas: [CUSTOM_ELEMENTS_SCHEMA],
			providers: [
				DescopeAuthConfig,
				{ provide: DescopeAuthConfig, useValue: mockConfig }
			]
		});

		fixture = TestBed.createComponent(DescopeComponent);
		component = fixture.componentInstance;
		component.projectId = '123';
		component.flowId = 'sign-in';
		component.locale = 'en-US';
		component.success = new EventEmitter<void>();
		component.error = new EventEmitter<void>();
		component.logger = { info: jest.fn(), error: jest.fn(), warn: jest.fn() };
		component.errorTransformer = jest.fn();
		fixture.detectChanges();
	});

	it('should create', () => {
		expect(component).toBeTruthy();
		const html: HTMLElement = fixture.nativeElement;
		const webComponentHtml = html.querySelector('descope-wc');
		expect(webComponentHtml).toBeDefined();
	});

	it('should correctly setup attributes based on inputs', () => {
		const html: HTMLElement = fixture.nativeElement;
		const webComponentHtml = html.querySelector('descope-wc')!;
		expect(webComponentHtml.getAttribute('project-id')).toStrictEqual('123');
		expect(webComponentHtml.getAttribute('flow-id')).toStrictEqual('sign-in');
		expect(webComponentHtml.getAttribute('locale')).toStrictEqual('en-US');
		expect(webComponentHtml.getAttribute('logger')).toBeDefined();
		expect(webComponentHtml.getAttribute('error-transformer')).toBeDefined();
		expect(webComponentHtml.getAttribute('redirect-url')).toBeNull();
	});

	it('should emit success when web component emits success', () => {
		const html: HTMLElement = fixture.nativeElement;
		const webComponentHtml = html.querySelector('descope-wc')!;

		component.success.subscribe(() => {
			expect(true).toBeTruthy();
			expect(afterRequestHooksSpy).toHaveBeenCalled();
		});
		webComponentHtml.dispatchEvent(
			new CustomEvent('success', {
				detail: { user: { name: 'user1' }, sessionJwt: 'session1' }
			})
		);
	});

	it('should emit error when web component emits error', () => {
		const html: HTMLElement = fixture.nativeElement;
		const webComponentHtml = html.querySelector('descope-wc')!;

		component.error.subscribe(() => {
			expect(true).toBeTruthy();
		});
		webComponentHtml.dispatchEvent(new CustomEvent('error'));
	});
});
