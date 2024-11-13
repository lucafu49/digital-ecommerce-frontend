import { ApplicationConfig, provideZoneChangeDetection } from '@angular/core';
import { provideRouter } from '@angular/router';

import { routes } from './app.routes';
import { provideClientHydration } from '@angular/platform-browser';
import { provideHttpClient, withInterceptors, withFetch } from '@angular/common/http';
import { errorHandlerInterceptor } from './Interceptors/error-handler.interceptor';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { requestInterceptor } from './Interceptors/request.interceptor';

export const appConfig: ApplicationConfig = {
  providers: [provideZoneChangeDetection({ eventCoalescing: true }), provideRouter(routes), provideClientHydration(), provideHttpClient(withFetch(),withInterceptors
    ([errorHandlerInterceptor, requestInterceptor])), provideAnimationsAsync()]
};
