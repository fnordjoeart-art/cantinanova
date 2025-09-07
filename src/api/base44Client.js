import { createClient } from '@base44/sdk';
// import { getAccessToken } from '@base44/sdk/utils/auth-utils';

// Create a client with authentication required
export const base44 = createClient({
  appId: "68b5d3ea41fd06623e6f625a", 
  requiresAuth: true // Ensure authentication is required for all operations
});
