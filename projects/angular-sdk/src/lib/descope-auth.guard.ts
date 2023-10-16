import { inject } from '@angular/core';

import { DescopeAuthService } from './descope-auth.service';

export const descopeAuthGuard = () => {
	const authService = inject(DescopeAuthService);
	return authService.isLoggedIn();
};
