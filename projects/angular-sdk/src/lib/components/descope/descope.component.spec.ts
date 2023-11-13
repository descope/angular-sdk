import {ComponentFixture, fakeAsync, TestBed} from '@angular/core/testing';

import { DescopeComponent } from './descope.component';
import createSdk from '@descope/web-js-sdk';
import { DescopeAuthConfig } from '../../types/types';
import {CUSTOM_ELEMENTS_SCHEMA, EventEmitter} from '@angular/core';
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
	const mockConfig: DescopeAuthConfig = {
		projectId: 'someProject'
	};
	const errorMock = new EventEmitter<void>

	beforeEach(() => {
		mockedCreateSdk = mocked(createSdk);

		mockedCreateSdk.mockReturnValue({
			onSessionTokenChange: onSessionTokenChangeSpy,
			onUserChange: onUserChangeSpy
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
		component.flowId='sign-in';
		component.locale='en-US';
		component.error = new EventEmitter<void>
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
		expect(webComponentHtml.getAttribute('redirect-url')).toBeNull();
	});

	it('should emit error when web component emits error', () => {
		const html: HTMLElement = fixture.nativeElement;
		const webComponentHtml = html.querySelector('descope-wc')!;

		component.error.subscribe(() => {
			expect(true).toBeTruthy();
		})
		webComponentHtml.dispatchEvent(new CustomEvent('error'));

	});

});
