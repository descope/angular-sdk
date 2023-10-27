import { ILogger } from '@descope/web-component';

export class DescopeAuthConfig {
    projectId = '';
    baseUrl?: string;
    sessionTokenViaCookie?: boolean
}

export type { ILogger };
