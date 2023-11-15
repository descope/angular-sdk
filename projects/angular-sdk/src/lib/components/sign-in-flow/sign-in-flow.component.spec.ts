import { ComponentFixture, TestBed } from '@angular/core/testing';
import { SignInFlowComponent } from './sign-in-flow.component';
import { MockComponent, ngMocks } from 'ng-mocks';
import { DescopeComponent } from '../descope/descope.component';

describe('SignInFlowComponent', () => {
	let component: SignInFlowComponent;
	let fixture: ComponentFixture<SignInFlowComponent>;

	beforeEach(() => {
		TestBed.configureTestingModule({
			declarations: [MockComponent(DescopeComponent), SignInFlowComponent]
		});

		fixture = TestBed.createComponent(SignInFlowComponent);
		component = fixture.componentInstance;
		fixture.detectChanges();
	});

	it('should create and be correctly configured', () => {
		expect(component).toBeTruthy();
		const mockComponent =
			ngMocks.find<DescopeComponent>('[flowId=sign-in]').componentInstance;
		expect(mockComponent.flowId).toStrictEqual('sign-in');
	});
});
