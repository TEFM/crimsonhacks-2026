import { defineBackend } from '@aws-amplify/backend';
import { HttpApi, HttpMethod, CorsHttpMethod } from 'aws-cdk-lib/aws-apigatewayv2';
import { HttpLambdaIntegration } from 'aws-cdk-lib/aws-apigatewayv2-integrations';
import { Stack } from 'aws-cdk-lib';
import { billsApi } from './functions/bills-api/resource.js';

const backend = defineBackend({ billsApi });
const apiStack = backend.createStack('bills-api-stack');
const billsIntegration = new HttpLambdaIntegration('BillsLambdaIntegration', backend.billsApi.resources.lambda);

const billsHttpApi = new HttpApi(apiStack, 'BillsHttpApi', {
  apiName: 'beehive-brief-bills',
  createDefaultStage: true,
  corsPreflight: {
    allowMethods: [CorsHttpMethod.GET],
    allowOrigins: ['*'],
    allowHeaders: ['content-type']
  }
});

billsHttpApi.addRoutes({
  path: '/api/bills',
  methods: [HttpMethod.GET],
  integration: billsIntegration
});

billsHttpApi.addRoutes({
  path: '/api/bills/{proxy+}',
  methods: [HttpMethod.GET],
  integration: billsIntegration
});

backend.addOutput({
  custom: {
    billsApi: {
      endpoint: billsHttpApi.url,
      region: Stack.of(billsHttpApi).region
    }
  }
});
