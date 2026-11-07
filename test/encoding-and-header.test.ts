import test from 'node:test';
import assert from 'node:assert/strict';
import { readdirSync, readFileSync } from 'node:fs';
import { join } from 'node:path';

function sourceFiles(directory: string): string[] {
  return readdirSync(directory, { withFileTypes: true }).flatMap((entry) => {
    const path = join(directory, entry.name);
    return entry.isDirectory() ? sourceFiles(path) : /\.(ts|tsx|css)$/.test(entry.name) ? [path] : [];
  });
}

test('browser-facing source avoids charset-sensitive display characters', () => {
  for (const file of sourceFiles('src')) {
    assert.doesNotMatch(readFileSync(file, 'utf8'), /[^\x00-\x7F]/, file);
  }
});

test('site header does not render the county selector', () => {
  const source = readFileSync('src/components/SiteHeader.tsx', 'utf8');

  assert.doesNotMatch(source, /Salt Lake County/);
  assert.doesNotMatch(source, /className="location"/);
});
