/**
 * 간단한 rehype 플러그인: ```mermaid 코드블록을 <pre class="mermaid">로 변환.
 * 클라이언트 mermaid.js가 startOnLoad: true로 렌더링.
 * Playwright/Chromium 불필요.
 */
import { visit } from 'unist-util-visit';

export default function rehypeMermaidSimple() {
  return (tree) => {
    visit(tree, 'element', (node, index, parent) => {
      // <pre><code class="language-mermaid">...</code></pre> 패턴 찾기
      if (
        node.tagName !== 'pre' ||
        !node.children?.[0] ||
        node.children[0].tagName !== 'code'
      ) return;

      const code = node.children[0];
      const className = code.properties?.className;
      if (!Array.isArray(className) || !className.includes('language-mermaid')) return;

      // 코드 텍스트 추출
      const text = code.children
        ?.filter(c => c.type === 'text')
        .map(c => c.value)
        .join('') ?? '';

      // <pre class="mermaid">로 교체
      node.properties = { className: ['mermaid'] };
      node.children = [{ type: 'text', value: text }];
    });
  };
}
