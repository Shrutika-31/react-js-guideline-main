import { LogLevel, PublicClientApplication } from '@azure/msal-browser';
import type { Configuration } from '@azure/msal-browser';

const clientId = import.meta.env.VITE_AZURE_CLIENT_ID as string;
// Fallback to 'organizations' to avoid undefined tenant errors
const tenantId = (import.meta.env.VITE_AZURE_TENANT_ID as string) || 'organizations';
// Redirect to /dashboard after successful login
const redirectUri = (import.meta.env.VITE_AZURE_REDIRECT_URI as string) || `${window.location.origin}/dashboard`;

export const msalConfig: Configuration = {
  auth: {
    clientId,
    authority: `https://login.microsoftonline.com/${tenantId}`,
    redirectUri
  },
  cache: {
    cacheLocation: 'localStorage',
    storeAuthStateInCookie: false
  },
  system: {
    loggerOptions: {
      loggerCallback: () => {},
      logLevel: LogLevel.Warning
    }
  }
};

export const pca = new PublicClientApplication(msalConfig);

export const loginRequest = {
  scopes: (import.meta.env.VITE_AZURE_SCOPES as string)?.split(',')?.map(s => s.trim()).filter(Boolean) || [
    'openid',
    'profile',
    'email'
  ]
};


