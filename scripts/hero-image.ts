/**
 * Unsplash Hero 이미지 검색 + 다운로드 + 크레딧 자동 처리.
 *
 * 사용법:
 *   bun run scripts/hero-image.ts search "dark abstract technology"
 *   bun run scripts/hero-image.ts download <photo-id> <slug>
 *   bun run scripts/hero-image.ts auto <slug> "검색 키워드"
 */

import fs from 'node:fs';
import path from 'node:path';

const ACCESS_KEY = process.env.UNSPLASH_ACCESS_KEY;
if (!ACCESS_KEY) {
  console.error('UNSPLASH_ACCESS_KEY not set in .env');
  process.exit(1);
}

const HEROES_DIR = path.resolve('src/assets/heroes');
const CREDITS_FILE = path.resolve('src/assets/heroes/credits.json');

interface UnsplashPhoto {
  id: string;
  urls: { regular: string; small: string; raw: string };
  user: { name: string; username: string };
  links: { download_location: string };
  description: string | null;
  alt_description: string | null;
  width: number;
  height: number;
}

interface Credit {
  photoId: string;
  slug: string;
  photographer: string;
  photographerUrl: string;
  unsplashUrl: string;
  downloadedAt: string;
}

async function searchPhotos(query: string, perPage = 8): Promise<UnsplashPhoto[]> {
  const params = new URLSearchParams({
    query,
    per_page: String(perPage),
    orientation: 'landscape',
  });

  const res = await fetch(`https://api.unsplash.com/search/photos?${params}`, {
    headers: { Authorization: `Client-ID ${ACCESS_KEY}` },
  });

  if (!res.ok) {
    console.error(`Unsplash API error: ${res.status} ${res.statusText}`);
    process.exit(1);
  }

  const data = await res.json();
  return data.results as UnsplashPhoto[];
}

async function triggerDownload(photo: UnsplashPhoto): Promise<void> {
  await fetch(photo.links.download_location, {
    headers: { Authorization: `Client-ID ${ACCESS_KEY}` },
  });
}

async function downloadPhoto(photo: UnsplashPhoto, slug: string): Promise<string> {
  // Unsplash 가이드라인: 다운로드 트리거 필수
  await triggerDownload(photo);

  // 1200px 너비로 다운로드 (16:9 crop)
  const imageUrl = `${photo.urls.raw}&w=1200&h=675&fit=crop&crop=entropy&q=80&fm=jpg`;
  const res = await fetch(imageUrl);
  if (!res.ok) throw new Error(`Image download failed: ${res.status}`);

  const buffer = Buffer.from(await res.arrayBuffer());
  const filePath = path.join(HEROES_DIR, `${slug}.jpg`);
  fs.writeFileSync(filePath, buffer);

  // 크레딧 저장
  const credits: Credit[] = fs.existsSync(CREDITS_FILE)
    ? JSON.parse(fs.readFileSync(CREDITS_FILE, 'utf-8'))
    : [];

  credits.push({
    photoId: photo.id,
    slug,
    photographer: photo.user.name,
    photographerUrl: `https://unsplash.com/@${photo.user.username}`,
    unsplashUrl: `https://unsplash.com/photos/${photo.id}`,
    downloadedAt: new Date().toISOString(),
  });

  fs.writeFileSync(CREDITS_FILE, JSON.stringify(credits, null, 2));

  return filePath;
}

// --- CLI ---

const [command, ...args] = process.argv.slice(2);

if (command === 'search') {
  const query = args.join(' ');
  if (!query) { console.error('Usage: search <query>'); process.exit(1); }

  const photos = await searchPhotos(query);
  console.log(`\n🔍 "${query}" — ${photos.length}개 결과\n`);
  photos.forEach((p, i) => {
    console.log(`  [${i + 1}] ${p.id}`);
    console.log(`      ${p.alt_description || p.description || '(no description)'}`);
    console.log(`      by ${p.user.name} (@${p.user.username})`);
    console.log(`      ${p.width}x${p.height}`);
    console.log(`      preview: ${p.urls.small}`);
    console.log();
  });

} else if (command === 'download') {
  const [photoId, slug] = args;
  if (!photoId || !slug) { console.error('Usage: download <photo-id> <slug>'); process.exit(1); }

  // photo ID로 직접 조회
  const res = await fetch(`https://api.unsplash.com/photos/${photoId}`, {
    headers: { Authorization: `Client-ID ${ACCESS_KEY}` },
  });
  if (!res.ok) { console.error(`Photo not found: ${photoId}`); process.exit(1); }

  const photo = await res.json() as UnsplashPhoto;
  const filePath = await downloadPhoto(photo, slug);
  console.log(`✅ Downloaded: ${filePath}`);
  console.log(`📸 Photo by ${photo.user.name} on Unsplash`);
  console.log(`   Credit added to credits.json`);

} else if (command === 'auto') {
  const [slug, ...queryParts] = args;
  const query = queryParts.join(' ');
  if (!slug || !query) { console.error('Usage: auto <slug> "검색 키워드"'); process.exit(1); }

  console.log(`🔍 Searching: "${query}"`);
  const photos = await searchPhotos(query, 4);

  if (photos.length === 0) { console.error('No photos found'); process.exit(1); }

  console.log(`\n Found ${photos.length} options:\n`);
  photos.forEach((p, i) => {
    console.log(`  [${i + 1}] ${p.alt_description || '(no description)'} — by ${p.user.name}`);
    console.log(`      preview: ${p.urls.small}\n`);
  });

  // 첫 번째 사진을 자동 선택
  const selected = photos[0];
  const filePath = await downloadPhoto(selected, slug);
  console.log(`✅ Downloaded [1]: ${filePath}`);
  console.log(`📸 Photo by ${selected.user.name} on Unsplash`);
  console.log(`\nFrontmatter에 추가:`);
  console.log(`heroImage: '../../assets/heroes/${slug}.jpg'`);

} else {
  console.log(`
Unsplash Hero Image Tool

Commands:
  search <query>                — 이미지 검색 (8개 결과)
  download <photo-id> <slug>    — 특정 사진 다운로드
  auto <slug> "query"           — 검색 + 첫 번째 자동 다운로드

Examples:
  bun run scripts/hero-image.ts search "dark abstract network"
  bun run scripts/hero-image.ts download abc123 agents-md-makeshift-os
  bun run scripts/hero-image.ts auto agents-md-makeshift-os "dark abstract document stack"
  `);
}
