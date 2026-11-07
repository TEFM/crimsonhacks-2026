import test from 'node:test';
import assert from 'node:assert/strict';
import { access, readFile } from 'node:fs/promises';

test('HTML entry point targets the TypeScript application module', async () => {
  const html = await readFile(new URL('../index.html', import.meta.url), 'utf8');

  assert.match(html, /src="\/src\/main\.tsx"/);
  await access(new URL('../src/main.tsx', import.meta.url));
});
