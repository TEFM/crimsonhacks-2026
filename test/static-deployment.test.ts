import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';

test('default Amplify configuration builds and publishes the fixture-only frontend without deploying a backend', async () => {
  const config = await readFile(new URL('../amplify.yml', import.meta.url), 'utf8');
  assert.match(config, /preBuild:\s*\r?\n\s+commands:\s*\r?\n\s+- nvm use 24\s*\r?\n\s+- npm ci/);
  assert.match(config, /build:\s*\r?\n\s+commands:\s*\r?\n\s+- npm run build/);
  assert.match(config, /baseDirectory: dist/);
  assert.doesNotMatch(config, /pipeline-deploy/);
});

test('fixture-only controllers do not import the live bills client', async () => {
  const [dashboard, detail] = await Promise.all([
    readFile(new URL('../src/controllers/useDashboard.ts', import.meta.url), 'utf8'),
    readFile(new URL('../src/controllers/useBillDetail.ts', import.meta.url), 'utf8')
  ]);
  assert.doesNotMatch(dashboard, /billsApi|fetchBills/);
  assert.doesNotMatch(detail, /billsApi|fetchBill/);
  assert.match(dashboard, /Live legislative data is not requested in this deployment/);
});
