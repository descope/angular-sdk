# Descope SDK for Angular

The Descope SDK for Angular provides convenient access to the Descope for an application written on top of Angular. You can read more on the [Descope Website](https://descope.com).

## Requirements

- The SDK supports Angular version 16 and above.
- A Descope `Project ID` is required for using the SDK. Find it on the [project page in the Descope Console](https://app.descope.com/settings/project).

## Installing the SDK

Install the package with:

```bash
npm i --save @descope/angular-sdk
```

Add Descope type definitions to your `tsconfig.ts`

```
  "compilerOptions": {
    "typeRoots": ["./node_modules/@descope"],
    <other options>
  }
```

## Usage

### NgModule - Import `DescopeAuthModule` to your application

`app.module.ts`

```ts
import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppComponent } from './app.component';
import { DescopeAuthModule } from '@descope/angular-sdk';

@NgModule({
	declarations: [AppComponent],
	imports: [
		BrowserModule,
		DescopeAuthModule.forRoot({
			projectId: '<your_project_id>'
		})
	],
	bootstrap: [AppComponent]
})
export class AppModule {}
```

### Standalone Mode - Configure Descope SDK for your application

`main.ts`

```ts
import { bootstrapApplication } from '@angular/platform-browser';
import { AppComponent } from './app/app.component';
import { DescopeAuthConfig } from '@descope/angular-sdk';

bootstrapApplication(AppComponent, {
	providers: [
		{ provide: DescopeAuthConfig, useValue: { projectId: '<your_project_id>' } }
	]
}).catch((err) => console.error(err));
```

### Use Descope to render specific flow

You can use **default flows** or **provide flow id** directly to the descope component

#### 1. Default flows

`app.component.html`

```angular2html
<descope-sign-in-flow
        (success)="onSuccess($event)"
        (error)="onError($event)"
        (ready)="onReady()"
></descope-sign-in-flow>
<!-- Optionally, you can show/hide loading indication until the flow page is ready -->
<div
  *ngIf="isLoading"
  class="loading-indicator"
  style="display: flex; justify-content: center; align-items: center;"
>
  Loading...
</div>
```

`app.component.ts`

```ts
import { Component } from '@angular/core';

@Component({
	selector: 'app-root',
	templateUrl: './app.component.html'
})
export class AppComponent {
	// Optionally, you can show/hide loading indication until the flow page is ready
	// See usage in onReady() method and the html template
	isLoading = true;

	onSuccess(e: CustomEvent) {
		console.log('SUCCESSFULLY LOGGED IN', e.detail);
	}

	onError(e: CustomEvent) {
		console.log('ERROR FROM LOG IN FLOW', e.detail);
	}

	onReady() {
		this.isLoading = false;
	}
}
```

#### 2. Provide flow id

```angular2html
<descope
     flowId="<your_flow_id>"
     (success)="<your_success_function>"
     (error)="<your_error_function>"
<!-- theme can be "light", "dark" or "os", which auto select a theme based on the OS theme. Default is "light"
     theme="dark"

     locale can be any supported locale which the flow's screen translated to, if not provided, the locale is taken from the browser's locale.
     locale="en"

     debug can be set to true to enable debug mode
     debug="true"

     tenant ID for SSO (SAML) login. If not provided, Descope will use the domain of available email to choose the tenant
     tenant=<tenantId>

     Redirect URL for OAuth and SSO (will be used when redirecting back from the OAuth provider / IdP), or for "Magic Link" and "Enchanted Link" (will be used as a link in the message sent to the the user)
     redirectUrl=<redirectUrl>

     telemetryKey=<telemtry_key>

     autoFocus can be true, false or "skipFirstScreen". Default is true.
     - true: automatically focus on the first input of each screen
     - false: do not automatically focus on screen's inputs
     - "skipFirstScreen": automatically focus on the first input of each screen, except first screen
     autoFocus="skipFirstScreen"

     errorTransformer is a function that receives an error object and returns a string. The returned string will be displayed to the user.
     NOTE: errorTransformer is not required. If not provided, the error object will be displayed as is.
     Example:
     errorTransformer = (error: { text: string; type: string }): string => {
         const translationMap: { [key: string]: string } = {
             SAMLStartFailed: 'Failed to start SAML flow'
         };
         return translationMap[error.type] || error.text;
     };
     ...
     errorTransformer={errorTransformer}

    form is an object the initial form context that is used in screens inputs in the flow execution.
    Used to inject predefined input values on flow start such as custom inputs, custom attributes and other inputs.
    Keys passed can be accessed in flows actions, conditions and screens prefixed with "form.".
    NOTE: form is not required. If not provided, 'form' context key will be empty before user input.
    Example:
    form={{ email: "predefinedname@domain.com",  firstName: "test", "customAttribute.test": "aaaa", "myCustomInput": 12 }}

    client is an object the initial client context in the flow execution.
    Keys passed can be accessed in flows actions and conditions prefixed with "client.".
    NOTE: client is not required. If not provided, context key will be empty.
    Example:
    client={{ version: "1.2.0" }}

     logger is an object describing how to log info, warn and errors.
     NOTE: logger is not required. If not provided, the logs will be printed to the console.
     Example:
     const logger = {
     	info: (title: string, description: string, state: any) => {
          console.log(title, description, JSON.stringify(state));
      },
     	warn: (title: string, description: string) => {
          console.warn(title);
      },
     	error: (title: string, description: string) => {
          console.error('OH NOO');
      },
     }
     ...
     logger={logger}-->
></descope>
```

#### Standalone Mode

All components in the sdk are standalone, so you can use them by directly importing them to your components.

### Use the `DescopeAuthService` and its exposed fields (`descopeSdk`, `session$`, `user$`) to access authentication state, user details and utilities

This can be helpful to implement application-specific logic. Examples:

- Render different components if current session is authenticated
- Render user's content
- Logout button

`app.component.html`

```angular2html
<p *ngIf="!isAuthenticated"> You are not logged in</p>
<button *ngIf="isAuthenticated" (click)="logout()">LOGOUT</button>
<p>User: {{userName}}</p>
```

`app.component.ts`

```ts
import { Component, OnInit } from '@angular/core';
import { DescopeAuthService } from '@descope/angular-sdk';

@Component({
	selector: 'app-home',
	templateUrl: './app.component.html',
	styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
	isAuthenticated: boolean = false;
	userName: string = '';

	constructor(private authService: DescopeAuthService) {}

	ngOnInit() {
		this.authService.session$.subscribe((session) => {
			this.isAuthenticated = session.isAuthenticated;
		});
		this.authService.user$.subscribe((descopeUser) => {
			if (descopeUser.user) {
				this.userName = descopeUser.user.name ?? '';
			}
		});
	}

	logout() {
		this.authService.descopeSdk.logout();
	}
}
```

### Session Refresh

`DescopeAuthService` provides `refreshSession` and `refreshUser` methods that triggers a single request to the Descope backend to attempt to refresh the session or user. You can use them whenever you want to refresh the session/user. For example you can use `APP_INITIALIZER` provider to attempt to refresh session and user on each page refresh:

`app.module.ts`

```ts
import { APP_INITIALIZER, NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppComponent } from './app.component';
import { DescopeAuthModule, DescopeAuthService } from '@descope/angular-sdk';
import { zip } from 'rxjs';

export function initializeApp(authService: DescopeAuthService) {
	return () => zip([authService.refreshSession(), authService.refreshUser()]);
}

@NgModule({
	declarations: [AppComponent],
	imports: [
		BrowserModule,
		DescopeAuthModule.forRoot({
			projectId: '<your_project_id>'
		})
	],
	providers: [
		{
			provide: APP_INITIALIZER,
			useFactory: initializeApp,
			deps: [DescopeAuthService],
			multi: true
		}
	],
	bootstrap: [AppComponent]
})
export class AppModule {}
```

#### Standalone Mode Note:

You can use the same approach with `APP_INITIALIZER` in standalone mode, by adding it to `providers` array of the application.

### Descope Interceptor

You can also use `DescopeInterceptor` to attempt to refresh session on each HTTP request that gets `401` or `403` response:

`app.module.ts`

```ts
import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppComponent } from './app.component';
import {
	HttpClientModule,
	provideHttpClient,
	withInterceptors
} from '@angular/common/http';
import { DescopeAuthModule, descopeInterceptor } from '@descope/angular-sdk';

@NgModule({
	declarations: [AppComponent],
	imports: [
		BrowserModule,
		HttpClientModule,
		DescopeAuthModule.forRoot({
			projectId: '<your_project_id>',
			pathsToIntercept: ['/protectedPath']
		})
	],
	providers: [provideHttpClient(withInterceptors([descopeInterceptor]))],
	bootstrap: [AppComponent]
})
export class AppModule {}
```

`DescopeInterceptor`:

- is configured for requests that urls contain one of `pathsToIntercept`. If not provided it will be used for all requests.
- attaches session token as `Authorization` header in `Bearer <token>` format
- if requests get response with `401` or `403` it automatically attempts to refresh session
- if refresh attempt is successful, it automatically retries original request, otherwise it fails with original error

**For more SDK usage examples refer to [docs](https://docs.descope.com/build/guides/client_sdks/)**

### Session token server validation (pass session token to server API)

When developing a full-stack application, it is common to have private server API which requires a valid session token:

![session-token-validation-diagram](https://docs.descope.com/static/SessionValidation-cf7b2d5d26594f96421d894273a713d8.png)

Note: Descope also provides server-side SDKs in various languages (NodeJS, Go, Python, etc). Descope's server SDKs have out-of-the-box session validation API that supports the options described bellow. To read more about session validation, Read [this section](https://docs.descope.com/build/guides/gettingstarted/#session-validation) in Descope documentation.

You can securely communicate with your backend either by using `DescopeInterceptor` or manually adding token to your requests (ie. by using `DescopeAuthService.getSessionToken()` helper function)

### Helper Functions

You can also use the following helper methods on `DescopeAuthService` to assist with various actions managing your JWT.

- `getSessionToken()` - Get current session token.
- `getRefreshToken()` - Get current refresh token.
- `isAuthenticated()` - Returns boolean whether user is authenticated
- `refreshSession` - Force a refresh on current session token using an existing valid refresh token.
- `refreshUser` - Force a refresh on current user using an existing valid refresh token.
- `getJwtRoles(token = getSessionToken(), tenant = '')` - Get current roles from an existing session token. Provide tenant id for specific tenant roles.
- `getJwtPermissions(token = getSessionToken(), tenant = '')` - Fet current permissions from an existing session token. Provide tenant id for specific tenant permissions.

### Refresh token lifecycle

Descope SDK is automatically refreshes the session token when it is about to expire. This is done in the background using the refresh token, without any additional configuration.

If the Descope project settings are configured to manage tokens in cookies.
you must also configure a custom domain, and set it as the `baseUrl` in `DescopeAuthModule`.

### Descope Guard

`angular-sdk` provides a convenient route guard that prevents from accessing given route for users that are not authenticated:

```ts
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { ProtectedComponent } from './protected/protected.component';
import { descopeAuthGuard } from '@descope/angular-sdk';
import { LoginComponent } from './login/login.component';

const routes: Routes = [
	{
		path: 'step-up',
		component: ProtectedComponent,
		canActivate: [descopeAuthGuard],
		data: { descopeFallbackUrl: '/' }
	},
	{ path: 'login', component: LoginComponent },
	{ path: '**', component: HomeComponent }
];

@NgModule({
	imports: [RouterModule.forRoot(routes, { enableTracing: false })],
	exports: [RouterModule]
})
export class AppRoutingModule {}
```

If not authenticated user tries to access protected route they will be redirected to `descopeFallbackUrl`

## Code Example

You can find an example angular app in the [examples folder](./projects/demo-app).

### Setup

To run the examples, create `environment.development.ts` file in `environments` folder.

```ts
import { Env } from './conifg';

export const environment: Env = {
	descopeProjectId: '<your_project_id>'
};
```

Find your Project ID in the [Descope console](https://app.descope.com/settings/project).

### Run Example

Run the following command in the root of the project to build and run the example:

```bash
npm i && npm start
```

### Example Optional Env Variables

See the following table for customization environment variables for the example app:

| Env Variable        | Description                                                                                                   | Default value     |
| ------------------- | ------------------------------------------------------------------------------------------------------------- | ----------------- |
| descopeFlowId       | Which flow ID to use in the login page                                                                        | **sign-up-or-in** |
| descopeBaseUrl      | Custom Descope base URL                                                                                       | None              |
| descopeTheme        | Flow theme                                                                                                    | None              |
| descopeLocale       | Flow locale                                                                                                   | Browser's locale  |
| descopeRedirectUrl  | Flow redirect URL for OAuth/SSO/Magic Link/Enchanted Link                                                     | None              |
| descopeTenantId     | Flow tenant ID for SSO/SAML                                                                                   | None              |
| descopeDebugMode    | **"true"** - Enable debugger</br>**"false"** - Disable flow debugger                                          | None              |
| descopeStepUpFlowId | Step up flow ID to show to logged in user (via button). e.g. "step-up". Button will be hidden if not provided | None              |
| descopeTelemetryKey | **String** - Telemetry public key provided by Descope Inc                                                     | None              |
| descopeBackendUrl   | Url to your test backend app in case you want to test e2e                                                     | None              |

Example `environment.development.ts` file:

```ts
import { Env } from './conifg';

export const environment: Env = {
	descopeProjectId: '<your_project_id>',
	descopeBaseUrl: '<your_base_url>',
	descopeFlowId: 'sign-in',
	descopeDebugMode: false,
	descopeTheme: 'os',
	descopeLocale: 'en_US',
	descopeRedirectUrl: '<your_redirect_url>',
	descopeTelemetryKey: '<your_telemetry_key>',
	descopeStepUpFlowId: 'step-up',
	descopeBackendUrl: 'http://localhost:8080/protected'
};
```

## Troubleshooting

If you encounter warning during build of your application:

```
▲ [WARNING] Module 'lodash.get' used by 'node_modules/@descope/web-component/node_modules/@descope/core-js-sdk/dist/index.esm.js' is not ESM
```

add `lodash.get` to allowed CommonJS dependencies in `angular.json`

```json
"architect": {
	"build": {
		"builder": "@angular-devkit/build-angular:browser",
		"options": {
			"allowedCommonJsDependencies": ["lodash.get"],
			<other_options>
		}
		<other_config>
	}
	<other_config>
}
```

## FAQ

### I updated the user in my backend, but the user / session token are not updated in the frontend

The Descope SDK caches the user and session token in the frontend. If you update the user in your backend (using Descope Management SDK/API for example), you can call `me` / `refresh` from `descopeSdk` member of `DescopeAuthService` to refresh the user and session token. Example:

```ts
import { DescopeAuthService } from '@descope/angular-sdk';

export class MyComponent {
	// ...
	constructor(private authService: DescopeAuthService) {}

	handleUpdateUser() {
		myBackendUpdateUser().then(() => {
			this.authService.descopeSdk.me();
			// or
			this.authService.descopeSdk.refresh();
		});
	}
}
```

## Learn More

To learn more please see the [Descope Documentation and API reference page](https://docs.descope.com/).

## Contact Us

If you need help you can email [Descope Support](mailto:support@descope.com)

## License

The Descope SDK for Angular is licensed for use under the terms and conditions of the [MIT license Agreement](./LICENSE).
