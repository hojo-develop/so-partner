# 想＆ / itotsugi.net renewal prototype

## Pages
- `index.html` — TOP v5 / BLUE LAYERS transition
- `web-production.html` — Webサイト制作 / approved Service Board pattern
- `web-operation.html` — Web運用・改善 / Service Board
- `works.html` — 制作実績一覧
- `works-sandbox.html` — 制作実績詳細のケーススタディ例（サンドボックス株式会社）
- `contact.html` — お問い合わせページ / UI完成（送信処理は未接続）

## Design policy
Service pages use the approved “Service Board” pattern: cobalt-centered visual system, compact centered intro, large English background typography, scan-first panel UI, readable Japanese body copy, and price guidance framed as reference amounts rather than actual client contract amounts.

Works index is designed for browsing/filtering. Works detail is story-led and SEO-friendly, with background, request, approach, build, after-launch, scope, period and comparable-work price guidance.


## Drafts
- `../_drafts/it-talent.html` — IT人材・組織支援 / 非公開下書き。サービス提供体制が固まるまで公開フォルダへ戻さない。


## INSIGHTS

- `insights.html`: INSIGHTS archive / category-facing index.
- `insight-seo-aio.html`: article-detail template populated with the first SEO / AIO sample article.
- `insights.css`: archive + article styles.

### Recommended CMS fields for INSIGHTS

- `title`
- `slug`
- `description`
- `category`
- `publishedAt`
- `updatedAt`
- `lead`
- `body` (rich editor)
- `authorName`
- `relatedInsights`
- `relatedService`
- `seoTitle` (optional override)
- `canonicalUrl` (optional override)
- `noindex` (draft / special cases)

When CMS integration is added, generate `BlogPosting` JSON-LD from the same fields and keep `dateModified` synchronized with visible update dates. The source/reference block is intentionally part of the article template for topics that depend on external or changing facts.


## 2026-09-26 update
- Added `insight-web-principles.html`: Webサイト制作で大切にしている5つのこと。
- Refined the shared header/navigation and implemented a full-screen cobalt mobile hamburger menu.
- Adjusted the mobile TOP HERO scroll timing so BLUE LAYERS react from the first scroll input.
- Corrected the PC PHILOSOPHY heading line breaks.
