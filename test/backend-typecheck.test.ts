import test from 'node:test';
import assert from 'node:assert/strict';
import { spawnSync } from 'node:child_process';
import { createRequire } from 'node:module';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

test('Amplify backend and its shared models pass NodeNext type checking', () => {
  const require = createRequire(import.meta.url);
  const result = spawnSync(process.execPath, [
    join(dirname(require.resolve('typescript/package.json')), 'bin', 'tsc'),
    '--project', 'amplify/tsconfig.json',
    '--noEmit'
  ], {
    cwd: fileURLToPath(new URL('../', import.meta.url)),
    encoding: 'utf8',
    timeout: 60_000
  });

  assert.ifError(result.error);
  assert.equal(result.status, 0, `Backend type checking failed:\n${result.stdout}${result.stderr}`);
});
