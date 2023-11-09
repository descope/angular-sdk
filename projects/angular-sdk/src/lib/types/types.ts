import { ILogger } from '@descope/web-component';

export class DescopeAuthConfig {
	projectId = '';
	baseUrl?: string;
	sessionTokenViaCookie?: boolean;
	pathsToIntercept?: string[];
}

export type { ILogger };
