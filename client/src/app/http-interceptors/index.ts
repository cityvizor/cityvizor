import { HTTP_INTERCEPTORS } from '@angular/common/http';

import { WithCredentialsInterceptor } from './with-credentials.interceptor';

/** Http interceptor providers in outside-in order */
export const httpInterceptorProviders = [
  { provide: HTTP_INTERCEPTORS, useClass: WithCredentialsInterceptor, multi: true },
];