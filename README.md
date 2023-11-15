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

## Usage

### Import `DescopeAuthModule` to your application

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
            projectId: "<your_project_id>"
        })
    ],
    bootstrap: [AppComponent]
})
export class AppModule {}

```

### Use Descope to render specific flow

You can use **default flows** or **provide flow id** directly to the descope component

#### 1. Default flows

`app.component.html`
```angular2html
<descope-sign-in-flow
        projectId="<your_project_id>"
        (success)="onSuccess()"
        (error)="onError()"
></descope-sign-in-flow>
```

`app.component.ts`
```ts
import { Component } from '@angular/core';

@Component({
	selector: 'app-root',
	templateUrl: './app.component.html'
})
export class AppComponent {

	onSuccess() {
		console.log('SUCCESSFULLY LOGGED IN FROM WEB COMPONENT');
	}

	onError() {
		console.log('ERROR FROM LOG IN FLOW FROM WEB COMPONENT');
	}
}

```

#### 2. Provide flow id

```angular2html
<descope
        projectId="<your_project_id>"
        flowId="<your_flow_id>"
        (success)="<your_success_function>"
        (error)="<your_error_function>"
        // theme can be "light", "dark" or "os", which auto select a theme based on the OS theme. Default is "light"
        // theme="dark"
        
        // locale can be any supported locale which the flow's screen translated to, if not provided, the locale is taken from the browser's locale.
        // locale="en"
        
        // debug can be set to true to enable debug mode
        // debug="true"
        
        // tenant ID for SSO (SAML) login. If not provided, Descope will use the domain of available email to choose the tenant
        // tenant=<tenantId>

        // Redirect URL for OAuth and SSO (will be used when redirecting back from the OAuth provider / IdP), or for "Magic Link" and "Enchanted Link" (will be used as a link in the message sent to the the user)
        // redirectUrl=<redirectUrl>
    
        // telemetryKey=<telemtry_key>
    
        // autoFocus can be true, false or "skipFirstScreen". Default is true.
        // - true: automatically focus on the first input of each screen
        // - false: do not automatically focus on screen's inputs
        // - "skipFirstScreen": automatically focus on the first input of each screen, except first screen
        // autoFocus="skipFirstScreen"
    
        // errorTransformer is a function that receives an error object and returns a string. The returned string will be displayed to the user.
        // NOTE: errorTransformer is not required. If not provided, the error object will be displayed as is.
        // Example:
        // errorTransformer = (error: { text: string; type: string }): string => {
        //     const translationMap: { [key: string]: string } = {
        //         SAMLStartFailed: 'Failed to start SAML flow'
        //     };
        //     return translationMap[error.type] || error.text;
        // };
        // ...
        // errorTransformer={errorTransformer}
        // ...
    

        // logger is an object describing how to log info, warn and errors.
        // NOTE: logger is not required. If not provided, the logs will be printed to the console.
        // Example:
        // const logger = {
        // 	info: (title: string, description: string, state: any) => {
        //      console.log(title, description, JSON.stringify(state));
        //  },
        // 	warn: (title: string, description: string) => {
        //      console.warn(title);
        //  },
        // 	error: (title: string, description: string) => {
        //      console.error('OH NOO');
        //  },
        // }
        // ...
        // logger={logger}
        // ...
></descope>
```

### Use the `DescopeAuthService` and its exposed fields (`sdk`, `descopeSession$`, `descopeUser$`) to access authentication state, user details and utilities

This can be helpful to implement application-specific logic. Examples:

- Render different components if current session is authenticated
- Render user's content
- Logout button

`app.component.html`
```angular2html
<p *ngIf="!isAuthenticated"> You are not logged in</p>
<button *ngIf="isAuthenticated" (click)="logout()">LOGOUT</button>
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

    constructor(private authService: DescopeAuthService) {}

    ngOnInit() {
        this.authService.descopeSession$.subscribe((session) => {
            this.isAuthenticated = session.isAuthenticated;
        });
    }

    logout() {
        this.authService.sdk.logout();
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
            projectId: "<your_project_id>"
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

You can also use `DescopeInterceptor` to attempt to refresh session on each HTTP request that gets `401` or `403` response:

`app.module.ts`
```ts
import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppComponent } from './app.component';

import { HTTP_INTERCEPTORS, HttpClientModule } from '@angular/common/http';
import { DescopeAuthModule, DescopeInterceptor } from '@descope/angular-sdk';

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
	providers: [
		{
			provide: HTTP_INTERCEPTORS,
			useClass: DescopeInterceptor,
			multi: true
		}
	],
	bootstrap: [AppComponent]
})
export class AppModule {}
```

`DescopeInterceptor`:
* is configured for requests that urls contain one of `pathsToIntercept`
* attaches session token as `Authorization` header in `Bearer <token>` format
* if requests get with `401` or `403` it automatically attempts to refresh session
* if refresh attempt is successful, it automatically retries original request, otherwise it fails with original error



**For more SDK usage examples refer to [docs](https://docs.descope.com/build/guides/client_sdks/)**

### Session token server validation (pass session token to server API)

When developing a full-stack application, it is common to have private server API which requires a valid session token:

![session-token-validation-diagram](https://docs.descope.com/static/SessionValidation-cf7b2d5d26594f96421d894273a713d8.png)

Note: Descope also provides server-side SDKs in various languages (NodeJS, Go, Python, etc). Descope's server SDKs have out-of-the-box session validation API that supports the options described bellow. To read more about session validation, Read [this section](https://docs.descope.com/build/guides/gettingstarted/#session-validation) in Descope documentation.

There are 2 ways to achieve that:

1. Using `getSessionToken` to get the token, and pass it on the `Authorization` Header (Recommended)
2. Passing `sessionTokenViaCookie` boolean prop to the `AuthProvider` component (Use cautiously, session token may grow, especially in cases of using authorization, or adding custom claim)

#### 1. Using `getSessionToken` to get the token

An example for api function, and passing the token on the `Authorization` header:

```js
import { getSessionToken } from '@descope/react-sdk';

// fetch data using back
// Note: Descope backend SDKs support extracting session token from the Authorization header
export const fetchData = async () => {
	const sessionToken = getSessionToken();
	const res = await fetch('/path/to/server/api', {
		headers: {
			Authorization: `Bearer ${sessionToken}`
		}
	});
	// ... use res
};
```

An example for component that uses `fetchData` function from above

```js
// Component code
import { fetchData } from 'path/to/api/file'
import { useCallback } from 'react'

const Component = () => {
    const onClick = useCallback(() => {
        fetchData()
    },[])
    return (
        {...}
        {
            // button that triggers an API that may use session token
            <button onClick={onClick}>Click Me</button>
        }
    )
}
```

#### 2. Passing `sessionTokenViaCookie` boolean prop to the `AuthProvider`

Passing `sessionTokenViaCookie` prop to `AuthProvider` component. Descope SDK will automatically store session token on the `DS` cookie.

Note: Use this option if session token will stay small (less than 1k). Session token can grow, especially in cases of using authorization, or adding custom claims

Example:

```js
import { AuthProvider } from '@descope/react-sdk';

const AppRoot = () => {
	return (
		<AuthProvider projectId="my-project-id" sessionTokenViaCookie>
			<App />
		</AuthProvider>
	);
};
```

Now, whenever you call `fetch`, the cookie will automatically be sent with the request. Descope backend SDKs also support extracting the token from the `DS` cookie.

Note:
The session token cookie is set as a [`Secure`](https://datatracker.ietf.org/doc/html/rfc6265#section-5.2.5) cookie. It will be sent only over HTTPS connections.
In addition, some browsers (e.g. Safari) may not store `Secure` cookie if the hosted page is running on an HTTP protocol.

### Helper Functions

You can also use the following functions to assist with various actions managing your JWT.

`getSessionToken()` - Get current session token.
`getRefreshToken()` - Get current refresh token.
`refresh(token = getRefreshToken())` - Force a refresh on current session token using an existing valid refresh token.
`getJwtRoles(token = getSessionToken(), tenant = '')` - Get current roles from an existing session token. Provide tenant id for specific tenant roles.
`getJwtPermissions(token = getSessionToken(), tenant = '')` - Fet current permissions from an existing session token. Provide tenant id for specific tenant permissions.

### Refresh token lifecycle

Descope SDK is automatically refreshes the session token when it is about to expire. This is done in the background using the refresh token, without any additional configuration.

If the Descope project settings are configured to manage tokens in cookies.
you must also configure a custom domain, and set it as the `baseUrl` prop in the `AuthProvider` component. See the above [`AuthProvider` usage](https://github.com/descope/react-sdk#wrap-your-app-with-auth-provider) for usage example.

## Code Example

You can find an example react app in the [examples folder](./examples).

### Setup

To run the examples, set your `Project ID` by setting the `DESCOPE_PROJECT_ID` env var or directly
in the sample code.
Find your Project ID in the [Descope console](https://app.descope.com/settings/project).

```bash
export DESCOPE_PROJECT_ID=<Project-ID>
```

Alternatively, put the environment variable in `.env` file in the project root directory.
See bellow for an `.env` file template with more information.

### Run Example

Run the following command in the root of the project to build and run the example:

```bash
npm i && npm start
```

### Example Optional Env Variables

See the following table for customization environment variables for the example app:

| Env Variable            | Description                                                                                                   | Default value     |
| ----------------------- | ------------------------------------------------------------------------------------------------------------- | ----------------- |
| DESCOPE_FLOW_ID         | Which flow ID to use in the login page                                                                        | **sign-up-or-in** |
| DESCOPE_BASE_URL        | Custom Descope base URL                                                                                       | None              |
| DESCOPE_THEME           | Flow theme                                                                                                    | None              |
| DESCOPE_LOCALE          | Flow locale                                                                                                   | Browser's locale  |
| DESCOPE_REDIRECT_URL    | Flow redirect URL for OAuth/SSO/Magic Link/Enchanted Link                                                     | None              |
| DESCOPE_TENANT_ID       | Flow tenant ID for SSO/SAML                                                                                   | None              |
| DESCOPE_DEBUG_MODE      | **"true"** - Enable debugger</br>**"false"** - Disable flow debugger                                          | None              |
| DESCOPE_STEP_UP_FLOW_ID | Step up flow ID to show to logged in user (via button). e.g. "step-up". Button will be hidden if not provided | None              |
| DESCOPE_TELEMETRY_KEY   | **String** - Telemetry public key provided by Descope Inc                                                     | None              |
|                         |                                                                                                               |                   |

Example for `.env` file template:

```
# Your project ID
DESCOPE_PROJECT_ID="<Project-ID>"
# Login flow ID
DESCOPE_FLOW_ID=""
# Descope base URL
DESCOPE_BASE_URL=""
# Set flow theme to dark
DESCOPE_THEME=dark
# Set flow locale, default is browser's locale
DESCOPE_LOCALE=""
# Flow Redirect URL
DESCOPE_REDIRECT_URL=""
# Tenant ID
DESCOPE_TENANT_ID=""
# Enable debugger
DESCOPE_DEBUG_MODE=true
# Show step-up flow for logged in user
DESCOPE_STEP_UP_FLOW_ID=step-up
# Telemetry key
DESCOPE_TELEMETRY_KEY=""
```

## Learn More

To learn more please see the [Descope Documentation and API reference page](https://docs.descope.com/).

## Contact Us

If you need help you can email [Descope Support](mailto:support@descope.com)

## License

The Descope SDK for Angular is licensed for use under the terms and conditions of the [MIT license Agreement](./LICENSE).
