# Dwi Sapta Utama ERP visual direction

## Identity

Operational ERP for Aqua distribution depots in Bali. Interface must feel dependable, structured, fast to scan, and suitable for daily warehouse, purchasing, sales, and finance work.

## Aesthetic

SAP Fiori-inspired enterprise UI. Use clear hierarchy, compact information density, strong alignment, restrained decoration, and predictable interaction patterns. This is an inspiration and usability direction, not a claim of SAP ownership or official SAP implementation.

## Personality

Precise, calm, practical, accountable.

## Palette

- Deep navy: `#0b2447`, `#0f2744`. Shell, sidebar, high-level navigation.
- Fiori blue: `#0a6ed1`. Primary action, active navigation, links, focus indication when contrast passes.
- Page background: `#f5f7fa`. Main workspace.
- Surface: `#ffffff`. Cards, tables, forms.
- Text: slate or charcoal with WCAG-readable contrast.
- Semantic colors: green for success, amber for warning, red for error, blue for information. Use only when state carries meaning.

Keep active palette restrained. Do not add gradients, neon colors, glows, decorative blobs, or dark mode unless product requirement gives them purpose.

## Typography

Use existing project typography and Tailwind defaults unless a real readability or brand requirement justifies change. Prefer clear sans-serif text, compact labels, readable table values, and sentence case. Avoid decorative display typography and excessive uppercase.

## Layout

- Use application shell: header, sidebar, breadcrumb or page context, workspace.
- Use 8px-based spacing rhythm where it fits existing components.
- Use modest radius and restrained elevation. Surfaces should remain grounded.
- Prefer tables, forms, filter bars, metric summaries, object headers, status indicators, and responsive lists because they match ERP workflows.
- Layout must reflow without horizontal page overflow. Tables may scroll horizontally only inside an intentional table region.
- Sidebar footer stays at bottom when navigation content is short. Navigation list scrolls independently when content is long.

## Components

- Reuse existing shared components before creating new ones.
- Buttons need explicit action labels. Do not add decorative arrows or generic AI badges.
- Icons must clarify function or status. No icon-only control without accessible label or tooltip.
- Status badges show real mock state. Do not use color as the only state signal.
- Empty, loading, error, disabled, hover, focus, and active states need deliberate behavior where applicable.
- Keep forms keyboard accessible and focus-visible.

## Motion

Use minimal motion for state change, drawer transition, submenu expansion, and feedback. Never animate decoration continuously without functional purpose. Respect `prefers-reduced-motion` when adding custom motion.

## Copy

Use Indonesian for user-facing product copy unless existing screen context requires another language. Write specific operational labels: `Buat Purchase Order`, `Terima Barang`, `Simpan Perubahan`. Avoid hype, fake metrics, filler, and claims unsupported by PoC data.

## Design decision test

Every non-standard visual technique needs a product reason tied to hierarchy, identity, readability, or workflow. If removing a decoration does not reduce clarity, remove it.
