/**
 * OG 이미지 자동 생성 스크립트.
 * prebuild 체인에서 실행. 각 포스트에 대해 1200x630 PNG 생성.
 * 디자인: B+C 조합 — gradient glow + geometric corner accents.
 */
import satori from 'satori';
import sharp from 'sharp';
import { readFileSync, writeFileSync, mkdirSync, existsSync } from 'fs';
import matter from 'gray-matter';
import { globSync } from 'fs';

const POSTS_DIR = './src/content/blog';
const OUTPUT_DIR = './public/og';
const WIDTH = 1200;
const HEIGHT = 630;

const LATIN_FONT_PATH = './public/fonts/InstrumentSans-SemiBold.ttf';
const LATIN_FONT_URL = 'https://cdn.jsdelivr.net/fontsource/fonts/instrument-sans@latest/latin-600-normal.ttf';
const KR_FONT_PATH = './public/fonts/NotoSansKR-Bold.ttf';
const KR_FONT_URL = 'https://cdn.jsdelivr.net/fontsource/fonts/noto-sans-kr@latest/korean-700-normal.ttf';

async function downloadFont(path: string, url: string): Promise<ArrayBuffer> {
  if (existsSync(path)) {
    return readFileSync(path).buffer as ArrayBuffer;
  }
  console.log(`Downloading font: ${path}...`);
  const res = await fetch(url);
  const buf = await res.arrayBuffer();
  mkdirSync('./public/fonts', { recursive: true });
  writeFileSync(path, Buffer.from(buf));
  return buf;
}

async function loadFonts() {
  const [latin, kr] = await Promise.all([
    downloadFont(LATIN_FONT_PATH, LATIN_FONT_URL),
    downloadFont(KR_FONT_PATH, KR_FONT_URL),
  ]);
  return { latin, kr };
}

const categoryLabels: Record<string, string> = {
  essay: 'Essay',
  tutorial: 'Tutorial',
  research: 'Research',
  note: 'Note',
};

interface PostMeta {
  slug: string;
  title: string;
  category: string;
  tags: string[];
  pubDate: string;
}

function getPostsMeta(): PostMeta[] {
  const files = globSync(`${POSTS_DIR}/*.md`);
  return files
    .map(file => {
      const content = readFileSync(file, 'utf-8');
      const { data } = matter(content);
      if (data.draft) return null;
      const slug = file.replace(`${POSTS_DIR}/`, '').replace('.md', '');
      return {
        slug,
        title: data.title || slug,
        category: data.category || 'essay',
        tags: data.tags || [],
        pubDate: data.pubDate ? new Date(data.pubDate).toISOString().split('T')[0] : '',
      };
    })
    .filter(Boolean) as PostMeta[];
}

function cornerAccents() {
  return [
    // top-left
    { type: 'div' as const, props: { style: { position: 'absolute' as const, top: '20px', left: '20px', width: '48px', height: '3px', background: '#3B82F6' } } },
    { type: 'div' as const, props: { style: { position: 'absolute' as const, top: '20px', left: '20px', width: '3px', height: '48px', background: '#3B82F6' } } },
    // bottom-right
    { type: 'div' as const, props: { style: { position: 'absolute' as const, bottom: '20px', right: '20px', width: '48px', height: '3px', background: '#3B82F6' } } },
    { type: 'div' as const, props: { style: { position: 'absolute' as const, bottom: '20px', right: '20px', width: '3px', height: '48px', background: '#3B82F6' } } },
  ];
}

function gradientOrbs() {
  return [
    { type: 'div' as const, props: { style: { position: 'absolute' as const, top: '-60px', right: '-60px', width: '400px', height: '400px', background: 'radial-gradient(circle, rgba(59,130,246,0.16) 0%, transparent 65%)', display: 'flex' as const } } },
    { type: 'div' as const, props: { style: { position: 'absolute' as const, bottom: '-100px', left: '-60px', width: '300px', height: '300px', background: 'radial-gradient(circle, rgba(59,130,246,0.06) 0%, transparent 65%)', display: 'flex' as const } } },
  ];
}

async function generateOgImage(post: PostMeta, fonts: { latin: ArrayBuffer; kr: ArrayBuffer }) {
  const categoryLabel = categoryLabels[post.category] || post.category;

  const svg = await satori(
    {
      type: 'div',
      props: {
        style: {
          width: '100%', height: '100%', display: 'flex', flexDirection: 'column',
          justifyContent: 'space-between', padding: '48px 56px',
          background: '#0A0A0B', fontFamily: 'Instrument Sans, Noto Sans KR',
          position: 'relative',
        },
        children: [
          ...gradientOrbs(),
          ...cornerAccents(),
          // Top: brand + category
          {
            type: 'div',
            props: {
              style: { display: 'flex', justifyContent: 'space-between', alignItems: 'center' },
              children: [
                { type: 'span', props: { style: { fontSize: '34px', color: '#E8E8ED', fontWeight: 700 }, children: 'mirlim.blog' } },
                { type: 'span', props: { style: { fontSize: '18px', color: '#3B82F6', border: '1px solid rgba(59,130,246,0.4)', padding: '6px 16px', borderRadius: '6px', letterSpacing: '0.04em' }, children: categoryLabel } },
              ],
            },
          },
          // Center: title
          {
            type: 'h1',
            props: {
              style: { fontSize: '54px', color: '#E8E8ED', lineHeight: 1.2, margin: 0 },
              children: post.title,
            },
          },
          // Bottom: tagline
          {
            type: 'div',
            props: {
              style: { display: 'flex', justifyContent: 'space-between', alignItems: 'center' },
              children: [
                { type: 'span', props: { style: { fontSize: '20px', color: '#6B6B76' }, children: 'AI/AX 시대의 생각을 기록합니다' } },
              ],
            },
          },
        ],
      },
    },
    {
      width: WIDTH, height: HEIGHT,
      fonts: [
        { name: 'Instrument Sans', data: fonts.latin, style: 'normal' as const, weight: 600 },
        { name: 'Noto Sans KR', data: fonts.kr, style: 'normal' as const, weight: 700 },
      ],
    },
  );

  const png = await sharp(Buffer.from(svg)).png().toBuffer();
  const outPath = `${OUTPUT_DIR}/${post.slug}.png`;
  writeFileSync(outPath, png);
  return outPath;
}

async function generateDefaultOg(fonts: { latin: ArrayBuffer; kr: ArrayBuffer }) {
  const svg = await satori(
    {
      type: 'div',
      props: {
        style: {
          width: '100%', height: '100%', display: 'flex', flexDirection: 'column',
          justifyContent: 'space-between', padding: '48px 56px',
          background: '#0A0A0B', fontFamily: 'Instrument Sans, Noto Sans KR',
          position: 'relative',
        },
        children: [
          ...gradientOrbs(),
          ...cornerAccents(),
          // Top: empty spacer
          { type: 'div', props: { style: { display: 'flex' } } },
          // Center: brand hero
          {
            type: 'div',
            props: {
              style: { display: 'flex', flexDirection: 'column', gap: '16px' },
              children: [
                { type: 'h1', props: { style: { fontSize: '64px', color: '#E8E8ED', lineHeight: 1.2, margin: 0 }, children: 'mirlim.blog' } },
                { type: 'p', props: { style: { fontSize: '28px', color: '#6B6B76', margin: 0 }, children: 'AI/AX 시대의 생각을 기록합니다' } },
              ],
            },
          },
          // Bottom: MCP badge
          {
            type: 'div',
            props: {
              style: { display: 'flex', alignItems: 'center', gap: '12px' },
              children: [
                { type: 'span', props: { style: { fontSize: '18px', color: '#3B82F6', border: '1px solid rgba(59,130,246,0.4)', padding: '6px 16px', borderRadius: '6px' }, children: 'MCP' } },
                { type: 'span', props: { style: { fontSize: '20px', color: '#6B6B76' }, children: 'AI 에이전트도 읽을 수 있는 블로그' } },
              ],
            },
          },
        ],
      },
    },
    {
      width: WIDTH, height: HEIGHT,
      fonts: [
        { name: 'Instrument Sans', data: fonts.latin, style: 'normal' as const, weight: 600 },
        { name: 'Noto Sans KR', data: fonts.kr, style: 'normal' as const, weight: 700 },
      ],
    },
  );
  const png = await sharp(Buffer.from(svg)).png().toBuffer();
  writeFileSync(`${OUTPUT_DIR}/default.png`, png);
}

async function main() {
  mkdirSync(OUTPUT_DIR, { recursive: true });
  const fonts = await loadFonts();
  const posts = getPostsMeta();

  // Always regenerate all (design changes affect every image)
  console.log(`Generating OG images for ${posts.length} posts...`);
  for (const post of posts) {
    const path = await generateOgImage(post, fonts);
    console.log(`  done: ${path}`);
  }

  await generateDefaultOg(fonts);
  console.log(`  done: ${OUTPUT_DIR}/default.png`);

  console.log('OG images complete.');
}

main().catch(console.error);
