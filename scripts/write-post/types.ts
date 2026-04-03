/**
 * Post Compiler 파이프라인 스키마 정의.
 * 디자인 문서의 RunManifest, Brief, Review 인터페이스 구현.
 */

export interface RunManifest {
  id: string;
  topic: string;
  status:
    | 'researching'
    | 'briefing'
    | 'drafting'
    | 'reviewing'
    | 'compiling'
    | 'completed'
    | 'failed';
  phase: number;
  createdAt: string;
  updatedAt: string;
  slug?: string;
  error?: string;
}

export interface BriefAngle {
  id: string;
  description: string;
  noveltyScore: number;
}

export interface BriefReference {
  slug: string;
  relevance: string;
}

export interface BriefConcept {
  name: string;
  related: string[];
  isNew: boolean;
}

export interface Brief {
  angles: BriefAngle[];
  audience: string;
  keyClaims: string[];
  references: BriefReference[];
  concepts: BriefConcept[];
  titleOptions: string[];
  heroImagePrompt?: string;
  memeStrategy?: MemeStrategy;
  selectedAngle?: string;
  selectedTitle?: string;
}

export interface SlopPattern {
  pattern: string;
  location: string;
  original: string;
  fixed: string;
}

export interface Review {
  noveltyScore: number;
  reproducibilityScore: number;
  slopPatterns: SlopPattern[];
  verdict: 'pass' | 'revise' | 'reject';
  comments: string[];
}

export interface MemePlacement {
  afterSection: string;
  concept: string;
  suggestedFormat: string;
}

export interface MemeStrategy {
  useMemes: boolean;
  reason: string;
  placements: MemePlacement[];
}

export interface Recommendation {
  topic: string;
  reason: string;
  suggestedCategory: string;
  relatedConcepts: string[];
}
