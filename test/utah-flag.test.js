import test from 'node:test';
import assert from 'node:assert/strict';
import { access, readFile } from 'node:fs/promises';

test('dashboard includes a locally bundled Utah state flag with accessible text', async () => {
  const dashboard = await readFile(new URL('../src/views/Dashboard.jsx', import.meta.url), 'utf8');

  await access(new URL('../src/assets/utah-state-flag.svg', import.meta.url));
  assert.match(dashboard, /import utahStateFlag from '..\/assets\/utah-state-flag\.svg';/);
  assert.match(dashboard, /<img className="state-flag" src=\{utahStateFlag\} alt="Utah state flag" \/>/);
});
