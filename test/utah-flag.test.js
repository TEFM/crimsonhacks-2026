import test from 'node:test';
import assert from 'node:assert/strict';
import { access, readFile } from 'node:fs/promises';

test('shared site header includes a locally bundled Utah state flag with accessible text', async () => {
  const header = await readFile(new URL('../src/components/SiteHeader.jsx', import.meta.url), 'utf8');

  await access(new URL('../src/assets/utah-state-flag.svg', import.meta.url));
  assert.match(header, /import utahStateFlag from '..\/assets\/utah-state-flag\.svg';/);
  assert.match(header, /<img className="state-flag" src=\{utahStateFlag\} alt="Utah state flag" \/>/);
});

test('dashboard and bill detail render the shared site header', async () => {
  const [dashboard, detail] = await Promise.all([
    readFile(new URL('../src/views/Dashboard.jsx', import.meta.url), 'utf8'),
    readFile(new URL('../src/views/BillDetail.jsx', import.meta.url), 'utf8')
  ]);

  assert.match(dashboard, /import \{ SiteHeader \} from '..\/components\/SiteHeader';/);
  assert.match(dashboard, /<SiteHeader \/>/);
  assert.match(detail, /import \{ SiteHeader \} from '..\/components\/SiteHeader';/);
  assert.match(detail, /<SiteHeader activePage="" \/>/);
});

test('dashboard and bill detail reuse the shared arrow icon', async () => {
  const [dashboard, detail, arrowIcon] = await Promise.all([
    readFile(new URL('../src/views/Dashboard.jsx', import.meta.url), 'utf8'),
    readFile(new URL('../src/views/BillDetail.jsx', import.meta.url), 'utf8'),
    readFile(new URL('../src/components/ArrowIcon.jsx', import.meta.url), 'utf8')
  ]);

  assert.match(dashboard, /import \{ ArrowIcon \} from '..\/components\/ArrowIcon';/);
  assert.match(detail, /import \{ ArrowIcon \} from '..\/components\/ArrowIcon';/);
  assert.doesNotMatch(dashboard, /function ArrowIcon/);
  assert.doesNotMatch(detail, /function ArrowIcon/);
  assert.match(arrowIcon, /export function ArrowIcon/);
});
