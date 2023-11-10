// descope-interceptor.spec.ts
import { TestBed, inject } from '@angular/core/testing';
import {
    HttpClientTestingModule,
    HttpTestingController,
} from '@angular/common/http/testing';
import { HTTP_INTERCEPTORS, HttpClient } from '@angular/common/http';
import { of } from 'rxjs';
import {DescopeInterceptor} from "./descope.interceptor";
import {DescopeAuthService} from "./descope-auth.service";
import {DescopeAuthConfig} from "../types/types";
import createSdk from "@descope/web-js-sdk";
import mocked = jest.mocked;

jest.mock('@descope/web-js-sdk');

describe('DescopeInterceptor', () => {
    let interceptor: DescopeInterceptor;
    let authService: DescopeAuthService;
    let httpMock: HttpTestingController;
    let mockedCreateSdk: jest.Mock;


    beforeEach(() => {
        mockedCreateSdk = mocked(createSdk);
        mockedCreateSdk.mockReturnValue({
            onSessionTokenChange: jest.fn(),
            onUserChange: jest.fn(),
        });

        TestBed.configureTestingModule({
            imports: [HttpClientTestingModule],
            providers: [
                DescopeAuthService,
                DescopeInterceptor,
                {
                    provide: HTTP_INTERCEPTORS,
                    useClass: DescopeInterceptor,
                    multi: true,
                },
                {
                    provide: DescopeAuthConfig,
                    useValue: { pathsToIntercept: ['/api'], projectId: 'test' },
                },
            ],
        });

        interceptor = TestBed.inject(DescopeInterceptor);
        authService = TestBed.inject(DescopeAuthService);
        httpMock = TestBed.inject(HttpTestingController);
    });

    afterEach(() => {
        httpMock.verify();
    });

    it('should be created', () => {
        expect(interceptor).toBeTruthy();
    });

    it('should intercept requests for specified paths', inject(
        [HttpClient],
        (http: HttpClient) => {
            jest.spyOn(authService, 'getSessionToken').mockReturnValue('fakeToken');

            http.get('/api/data').subscribe();
            http.get('/other').subscribe();

            const req1 = httpMock.expectOne('/api/data');
            const req2 = httpMock.expectOne('/other');

            expect(req1.request.headers.get('Authorization')).toEqual('Bearer fakeToken');
            expect(req2.request.headers.get('Authorization')).toEqual(null);
            req1.flush({});
            req2.flush({});
        }
    ));

    it('should refresh token and retry request on 401 or 403 error', inject(
        [HttpClient],
        (http: HttpClient) => {
            jest.spyOn(authService, 'getSessionToken').mockReturnValue(null);
            const refreshSessionSpy = jest.spyOn(authService, 'refreshSession').mockReturnValue(of({ ok: true, data: { sessionJwt: 'newToken' } }));

            http.get('/api/data').subscribe();

            const req = httpMock.expectOne('/api/data');

            expect(req.request.headers.get('Authorization')).toEqual('Bearer newToken');
            expect(refreshSessionSpy).toHaveBeenCalled()
            req.flush({}, {status: 401, statusText: 'Not authorized'});
        }
    ));

    it('should throw an error if refreshing the session fails', inject(
        [HttpClient],
        (http: HttpClient) => {
            jest.spyOn(authService, 'getSessionToken').mockReturnValue(null);
            jest.spyOn(authService, 'refreshSession').mockReturnValue(of({ ok: false, data: undefined }));

            http.get('/api/data').subscribe(
                () => {},
                (error) => {
                    expect(error.message).toEqual('Could not refresh session!');
                }
            );

            httpMock.expectNone('/api/data');
        }
    ));
});
