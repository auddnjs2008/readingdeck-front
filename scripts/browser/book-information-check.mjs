// Runs Next and an isolated mock API; never accesses the real API or database.
import assert from 'node:assert/strict';
import { createServer } from 'node:http';
import { spawn } from 'node:child_process';
import { readFile, writeFile } from 'node:fs/promises';
const { chromium } = await import(process.env.PLAYWRIGHT_MODULE || 'playwright');
const origin = 'http://localhost:4410';
const isbn = '9780306406157';
const info = { isbn, title: '다시 읽는 책', authors: ['테스트 저자'], publisher: '출판사', publishedAt: '2020-01-02', description: '이 책은 생각과 독서에 관한 책입니다.', coverUrl: null };
const book = { id: 7, isbn, title: info.title, author: info.authors[0], publisher: info.publisher, contents: info.description, backgroundImage: null, status: 'reading', createdAt: '2026-09-21', cardCount: 0, progressPercent: 0 };
const node = { id: 1, type: 'card', order: 0, positionX: 0, positionY: 0, book, card: { id: 1, type: 'insight', thought: '다시 읽고 싶은 문장', quote: '책의 한 문장', pageStart: null, pageEnd: null } };
const post = { id: 1, deckId: 1, deckName: '공개 독서 덱', deckDescription: '', caption: null, deckMode: 'list', author: { id: 2, name: '다른 독자', profile: null }, createdAt: '2026-09-21', snapshot: { version: 1, deck: { id: 1, name: '공개 독서 덱', mode: 'list' }, nodes: [node], connections: [] } };
const state = { signedIn: false, owned: false, status: 200, creates: [], unknown: [] };
const api = createServer(async (req, res) => {
 res.setHeader('Access-Control-Allow-Origin', origin);
 res.setHeader('Access-Control-Allow-Credentials', 'true');
 res.setHeader('Access-Control-Allow-Headers', 'content-type');
 res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
 if (req.method === 'OPTIONS') { res.writeHead(204).end(); return; }
 const url = new URL(req.url, 'http://localhost');
 let status = 200, data;
 if (url.pathname === `/books/info/${isbn}`) { status = state.status; data = info; }
 else if (url.pathname.startsWith('/books/info/')) { status = 404; data = {}; }
 else if (url.pathname === '/me') { status = state.signedIn ? 200 : 401; data = { id: 1, name: '독자' }; }
 else if (url.pathname.includes('refresh')) { status = 401; data = {}; }
 else if (url.pathname === '/books/search') data = { documents: [{ title: info.title, authors: info.authors, publisher: info.publisher, contents: info.description, isbn: '0306406152 9780306406157', thumbnail: 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg"/%3E' }], meta: { is_end: true, pageable_count: 1, total_count: 1 } };
 else if (url.pathname === '/books' && req.method === 'POST') {
  let body = ''; for await (const chunk of req) body += chunk;
  state.creates.push(body); state.owned = true; data = book;
 } else if (url.pathname === '/books') data = { items: state.owned ? [book] : [], meta: { total: state.owned ? 1 : 0, page: 1, totalPages: 1 } };
 else if (url.pathname === '/books/7') data = book;
 else if (url.pathname === '/books/7/cards') data = { items: [], nextCursor: null, hasNext: false };
 else if (url.pathname === '/community/posts/1') data = post;
 else if (url.pathname === '/community/posts/1/comments') data = { items: [], nextCursor: null };
 else if (url.pathname === '/community/posts') data = { items: [], meta: { total: 0 }, nextCursor: null };
 else if (url.pathname === '/me/library-stats') data = { bookCount: 1, cardCount: 0 };
 else { state.unknown.push(`${req.method} ${url.pathname}`); status = 500; data = {}; }
 res.writeHead(status, { 'Content-Type': 'application/json' }).end(JSON.stringify(data));
});
const originalConfig = await readFile('tsconfig.json', 'utf8');
await new Promise(resolve => api.listen(4411, '127.0.0.1', resolve));
const next = spawn('node', ['node_modules/next/dist/bin/next', 'dev', '-p', '4410'], { env: { ...process.env, NEXT_PUBLIC_API_BASE_URL: 'http://127.0.0.1:4411', NEXT_DIST_DIR: '.next/book-info-check' }, stdio: ['ignore', 'pipe', 'pipe'] });
let logs = ''; next.stdout.on('data', chunk => logs += chunk); next.stderr.on('data', chunk => logs += chunk);
let browser;
try {
 await new Promise((resolve, reject) => {
  const timeout = setTimeout(() => { clearInterval(timer); reject(new Error(logs)); }, 60000);
  const timer = setInterval(() => { if (/Ready in/.test(logs)) { clearInterval(timer); clearTimeout(timeout); resolve(); } }, 100);
 });
 browser = await chromium.launch({ headless: true, channel: 'chrome' });
 for (const width of [390, 1280]) {
  state.signedIn = false; state.owned = false; state.status = 200; book.isbn = isbn;
  const context = await browser.newContext({ viewport: { width, height: 900 } });
  const page = await context.newPage();
  page.setDefaultTimeout(15000);
  const close = page.getByRole('button', { name: 'Close tanstack query devtools', exact: true });
  await page.addLocatorHandler(close, () => close.click());
  await page.goto(`${origin}/book-info/${isbn}`);
  await page.getByRole('heading', { name: info.title, exact: true }).waitFor();
  await page.getByRole('link', { name: '로그인하고 서재에 추가' }).waitFor();
  assert.equal(new URL(page.url()).pathname, `/book-info/${isbn}`);
  assert.ok(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth));
  await page.screenshot({ path: `/private/tmp/book-information-${width}.png`, fullPage: true });
  await page.goto(`${origin}/community/1`);
  await page.getByRole('link', { name: `${info.title} · 테스트 저자`, exact: true }).click();
  await page.getByRole('heading', { name: info.title, exact: true }).waitFor();
  await page.getByRole('link', { name: '로그인하고 서재에 추가' }).waitFor();
  await page.getByRole('button', { name: '돌아가기', exact: true }).click();
  await page.waitForURL(`${origin}/community/1`);
  state.signedIn = true;
  await page.goto(`${origin}/book-info/${isbn}`);
  await page.getByRole('button', { name: '내 서재에 추가', exact: true }).click();
  await page.waitForURL(`${origin}/books/7`);
  assert.match(state.creates.at(-1), /9780306406157/);
  await page.getByRole('link', { name: '책 소개 보기' }).click();
  await page.getByRole('link', { name: '내 기록 보기', exact: true }).waitFor();
  await page.getByRole('button', { name: '돌아가기', exact: true }).click();
  await page.waitForURL(`${origin}/books/7`);
  book.isbn = null;
  await page.goto(`${origin}/books/7/info`);
  await page.getByText(info.description, { exact: true }).waitFor();
  assert.equal(await page.getByText('출간일', { exact: true }).count(), 0);
  assert.equal(await page.getByText('ISBN', { exact: true }).count(), 0);
  await page.goto(`${origin}/book-info/invalid`);
  await page.getByRole('heading', { name: '책 정보를 찾을 수 없어요.' }).waitFor();
  state.status = 503;
  await page.goto(`${origin}/book-info/${isbn}`);
  await page.getByRole('button', { name: '다시 시도', exact: true }).waitFor();
  state.status = 200;
  await page.getByRole('button', { name: '다시 시도', exact: true }).click();
  await page.getByRole('heading', { name: info.title, exact: true }).waitFor();
  book.isbn = isbn;
  await page.goto(`${origin}/books/library`);
  await page.getByRole('button', { name: '새 책 추가', exact: true }).click();
  const dialog = page.getByRole('dialog');
  await dialog.getByPlaceholder('검색할 책 제목을 입력하세요').fill('다시');
  await dialog.getByRole('button', { name: /다시 읽는 책.*테스트 저자/ }).click();
  await dialog.getByRole('button', { name: '서재에 추가', exact: true }).click();
  await page.waitForURL(`${origin}/books/7`);
  assert.match(state.creates.at(-1), /0306406152 9780306406157/, '검색 ISBN이 생성 요청에 포함된다');
  await page.goto(`${origin}/books/library`);
  await page.getByRole('button', { name: '새 책 추가', exact: true }).click();
  await dialog.getByPlaceholder('검색할 책 제목을 입력하세요').fill('다시');
  await dialog.getByRole('button', { name: /다시 읽는 책.*테스트 저자/ }).click();
  await dialog.getByRole('button', { name: '직접 입력', exact: true }).click();
  await dialog.getByPlaceholder('저장할 책 제목을 입력하세요').fill('직접 기록한 다른 책');
  await dialog.getByRole('button', { name: '서재에 추가', exact: true }).click();
  await page.waitForURL(`${origin}/books/7`);
  assert.doesNotMatch(state.creates.at(-1), /name="isbn"/, '수동 등록에는 이전에 선택한 ISBN이 남지 않는다');
  book.isbn = null;
  await page.goto(`${origin}/community/1`);
  await page.getByRole('heading', { name: post.deckName, exact: true }).waitFor();
  assert.equal(await page.locator('a[href^="/book-info/"]').count(), 0, 'ISBN 없는 이전 공개 덱은 링크를 만들지 않는다');
  await context.close();
 }
 assert.deepEqual(state.unknown, []);
 console.log('PASS: 비로그인 책 정보·공개 덱/내 책 왕복·서재 추가/기존 책·ISBN 없는 책·404·실패 재시도·모바일/데스크톱');
} catch (error) { console.error(error, logs.slice(-5000)); throw error; }
finally {
 next.kill('SIGTERM');
 api.closeAllConnections();
 await new Promise(resolve => api.close(resolve));
 if (browser) await Promise.race([browser.close(), new Promise(resolve => setTimeout(resolve, 5000))]);
 await writeFile('tsconfig.json', originalConfig);
}
