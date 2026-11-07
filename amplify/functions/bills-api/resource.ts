import { defineFunction, secret } from '@aws-amplify/backend';

export const billsApi = defineFunction({
  name: 'bills-api',
  entry: './handler.ts',
  runtime: 20,
  timeoutSeconds: 10,
  environment: {
    UTAH_LEGISLATURE_DEVELOPER_TOKEN: secret('UTAH_LEGISLATURE_DEVELOPER_TOKEN'),
    UTAH_LEGISLATURE_SESSION: process.env.UTAH_LEGISLATURE_SESSION || '2026GS'
  }
});
