/**
 * 밈 생성 도구 (imgflip API).
 *
 * 사용법:
 *   bun run scripts/meme.ts list                              — 인기 밈 템플릿 20개
 *   bun run scripts/meme.ts search "drake"                    — 템플릿 검색
 *   bun run scripts/meme.ts create <template> <slug> "top" "bottom"  — 밈 생성 + 다운로드
 *   bun run scripts/meme.ts create drake my-meme "위 텍스트" "아래 텍스트"
 */

import fs from 'node:fs';
import path from 'node:path';

const USERNAME = process.env.IMGFLIP_USERNAME;
const PASSWORD = process.env.IMGFLIP_PASSWORD;
const MEMES_DIR = path.resolve('src/assets/memes');

// 자주 쓰는 밈 별칭
const ALIASES: Record<string, string> = {
  'drake': '181913649',
  'distracted': '112126428',
  'distracted-boyfriend': '112126428',
  'buttons': '87743020',
  'uno': '217743513',
  'bernie': '222403160',
  'exit': '124822590',
  'always-has-been': '252600902',
  'anakin': '322841258',
  'balloon': '131087935',
  'gru': '131940431',
  'handshake': '135256802',
  'escobar': '80707627',
  'disaster-girl': '97984',
  'skeleton': '4087833',
  'everywhere': '91538330',
  'spongebob': '102156234',
  'batman': '438680',
  'change-my-mind': '129242436',
  'woman-cat': '188390779',
  'trade-offer': '309868304',
};

interface MemeTemplate {
  id: string;
  name: string;
  url: string;
  width: number;
  height: number;
  box_count: number;
}

async function getTemplates(): Promise<MemeTemplate[]> {
  const res = await fetch('https://api.imgflip.com/get_memes');
  const data = await res.json();
  return data.data.memes;
}

async function createMeme(templateId: string, texts: string[]): Promise<string> {
  if (!USERNAME || !PASSWORD) {
    console.error('IMGFLIP_USERNAME / IMGFLIP_PASSWORD not set in .env');
    process.exit(1);
  }

  const params = new URLSearchParams({
    template_id: templateId,
    username: USERNAME,
    password: PASSWORD,
  });

  texts.forEach((text, i) => {
    params.append(`boxes[${i}][text]`, text);
    params.append(`boxes[${i}][color]`, '#ffffff');
    params.append(`boxes[${i}][outline_color]`, '#000000');
  });

  const res = await fetch('https://api.imgflip.com/caption_image', {
    method: 'POST',
    body: params,
  });

  const data = await res.json();
  if (!data.success) {
    console.error('imgflip error:', data.error_message);
    process.exit(1);
  }

  return data.data.url;
}

async function downloadImage(url: string, slug: string): Promise<string> {
  const res = await fetch(url);
  const buffer = Buffer.from(await res.arrayBuffer());
  const filePath = path.join(MEMES_DIR, `${slug}.jpg`);
  fs.writeFileSync(filePath, buffer);
  return filePath;
}

function resolveTemplate(input: string): string {
  if (ALIASES[input]) return ALIASES[input];
  if (/^\d+$/.test(input)) return input;
  console.error(`Unknown template: "${input}". Use 'list' or 'search' to find templates.`);
  console.error(`Aliases: ${Object.keys(ALIASES).join(', ')}`);
  process.exit(1);
}

// --- CLI ---

const [command, ...args] = process.argv.slice(2);

if (command === 'list') {
  const templates = await getTemplates();
  console.log('\n인기 밈 템플릿 Top 20:\n');
  templates.slice(0, 20).forEach((t, i) => {
    const alias = Object.entries(ALIASES).find(([, id]) => id === t.id)?.[0];
    console.log(`  [${i + 1}] ${t.id}  ${t.name} (${t.box_count} boxes)${alias ? ` → alias: "${alias}"` : ''}`);
  });

} else if (command === 'search') {
  const query = args.join(' ').toLowerCase();
  if (!query) { console.error('Usage: search <query>'); process.exit(1); }
  const templates = await getTemplates();
  const matches = templates.filter(t => t.name.toLowerCase().includes(query));
  console.log(`\n"${query}" 검색 결과: ${matches.length}개\n`);
  matches.forEach(t => {
    const alias = Object.entries(ALIASES).find(([, id]) => id === t.id)?.[0];
    console.log(`  ${t.id}  ${t.name} (${t.box_count} boxes)${alias ? ` → "${alias}"` : ''}`);
  });

} else if (command === 'create') {
  const [templateInput, slug, ...texts] = args;
  if (!templateInput || !slug || texts.length === 0) {
    console.error('Usage: create <template|alias> <slug> "text1" "text2" ...');
    console.error('Example: create drake my-meme "회의에서 일 논의" "회의 끝나고 진짜 일"');
    process.exit(1);
  }

  const templateId = resolveTemplate(templateInput);
  console.log(`Generating meme (template: ${templateId})...`);

  const imageUrl = await createMeme(templateId, texts);
  const filePath = await downloadImage(imageUrl, slug);

  console.log(`\n✅ Meme created: ${filePath}`);
  console.log(`\n마크다운에 삽입:`);
  console.log(`![${texts.join(' / ')}](../../assets/memes/${slug}.jpg)`);

} else {
  console.log(`
Meme Generator (imgflip API)

Commands:
  list                                    — 인기 템플릿 20개
  search <query>                          — 템플릿 검색
  create <template> <slug> "text" "text"  — 밈 생성 + 다운로드

Templates (aliases):
  drake, distracted, buttons, uno, bernie, exit, always-has-been,
  anakin, balloon, gru, handshake, escobar, skeleton, spongebob,
  batman, change-my-mind, woman-cat, trade-offer

Examples:
  bun run scripts/meme.ts create drake work-meeting "회의에서 일 논의" "회의 끝나고 진짜 일"
  bun run scripts/meme.ts create change-my-mind ai-lab "AI는 두뇌가 아니라 실험실이다"
  `);
}
