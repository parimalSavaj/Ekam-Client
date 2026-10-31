# Client instructions

These are standing instructions for every change inside `client/`. The UI/UX section below is the finished Ekam design system. Read it before writing or changing any UI, and follow it without opening a new design discussion. When a rule here conflicts with an example in an older document, this file wins.

Stack: Next.js (App Router), React, TypeScript, Tailwind CSS v4, locally owned shadcn/ui components on Radix (`radix-ui`), `class-variance-authority`, `lucide-react`. No dark mode. Do not add UI libraries, fonts that need a network fetch, or CSS-in-JS.

## Repository rules

- All packages and configuration live in `client/`. Never import code or env values from `old-client/` or other sibling folders; `old-client/` is a behavioral reference only.
- Do not change API contracts, auth logic, routes, or product copy as part of a visual change.
- Add shadcn components with `npx shadcn@latest add <component>`, then immediately conform them to this file (see "Adding or adapting shared components"). Check `package.json` and the new file's imports afterwards: when `dropdown-menu` was added, the CLI installed an unrelated npm package named `cn` and imported `cn` from it instead of `@/lib/utils`.
- Completion checks for any change: `npm run lint`, `npm run typecheck`, `npm run build` must all pass. Stop any dev or start server you launched, including on failure. Leave user-started servers alone.

---

# UI/UX design system

## 1. Design philosophy

Ekam is a calm research workspace. It should feel minimal, sophisticated, trustworthy and comfortable for long reading sessions. Not a generic AI chatbot, not a colorful startup template, not a dense enterprise dashboard.

- Quiet by default: neutral slate surfaces, hairline borders, flat cards. Coral appears only where it means "act here" or "you are here".
- Editorial personality comes from one thing: the serif display heading. The rest of the interface is a plain, efficient sans-serif.
- One primary action per view. Everything else is outline, secondary, ghost or link.
- Hierarchy comes from size, weight, spacing and the neutral palette, not from extra color, shadow or animation.
- Public landing page and authenticated app must look like the same product: same tokens, same components, same radii, same focus and hover behavior.

## 2. Color system

All colors are semantic CSS variables in `src/app/globals.css` (`:root`), exposed to Tailwind through `@theme inline`. Use the Tailwind utilities (`bg-primary`, `text-muted-foreground`, `border-input`, ...). To change a color, edit the variable in `:root` only.

| Token | Value | Use | Contrast (verified) |
| --- | --- | --- | --- |
| `background` | `#FAFAFA` | Page canvas | |
| `foreground` | `#1E293B` | Primary text, selected pill fill | 14.0:1 on background |
| `card` | `#FFFFFF` | Raised surfaces: cards, dialogs, inputs, outline buttons | |
| `secondary` | `#F1F5F9` | Recessed areas: sidebar, auth backdrop, feature band, chips | 13.4:1 with foreground |
| `secondary-hover` / `secondary-active` | `#E2E8F0` / `#CBD5E1` | Hover / pressed fill for neutral controls | 11.9:1 foreground on hover |
| `muted` | `#F8FAFC` | Rarely needed subtle fill | |
| `muted-foreground` | `#4B5E77` | Secondary text, captions, placeholders | 6.3:1 on background, 6.0:1 on secondary |
| `primary` | `#B94C41` | The single main action, selected-state bar, focus ring | 5.0:1 with white; 4.8:1 as text on background |
| `primary-hover` | `#9F4237` | Primary hover, coral link hover decoration | 6.4:1 with white |
| `primary-active` | `#8A382E` | Primary pressed | 7.8:1 with white |
| `primary-soft` / `primary-soft-hover` | `#FBEDEA` / `#F6E0DB` | Selected nav item, tinted hover of the link variant | |
| `primary-soft-foreground` | `#8A382E` | Text on `primary-soft` | 6.9:1 |
| `primary-soft-border` | `#EFCBC5` | Decorative border on selected surfaces | decorative |
| `brand` | `#D86A5D` | The original Ekam coral. Decorative only (see below) | 3.3:1 on background |
| `border` | `#E2E8F0` | Hairline dividers and card borders | decorative |
| `input` | `#7C8CA3` | Boundary of form controls and outline buttons | 3.4:1 on white, 3.3:1 on background |
| `ring` | `#B94C41` | Focus indicator | 4.8:1 on background |
| `error`, `success`, `warning`, `info` | `#E11D48`, `#059669`, `#D97706`, `#2563EB` | Semantic base colors (icons, borders, solid destructive) | |
| `*-bg` / `*-foreground` | e.g. `#FEE2E2` / `#9F1239` | Soft surface and its text. Always use as a pair | 6.4:1 to 7.2:1 |
| `destructive` (+ `-hover`, `-active`) | derives from `error` | Destructive button | 4.7:1 with white |

Rules:

- `primary` is the only interactive coral. Use `brand` (`#D86A5D`) only for non-interactive decoration: the wordmark dot, the hero italic phrase (display size, 3:1 is enough for large text), small illustrative icons, and the intro dot. Never use `brand` for body text, small text, buttons, links, borders of controls, or focus.
- White text is allowed on `primary`, `primary-hover`, `primary-active` and `destructive` only. For text on a coral tint use `primary-soft-foreground` on `primary-soft`.
- `border` is for decoration. Anything a user must perceive as a control boundary (text input, outline button) uses `border-input`.
- Status colors: pair `bg-*-bg` with `text-*-foreground`, include an icon or a text label, and use the `Alert` or `Badge` component. Never rely on color alone. Never use `error` for anything but errors and destructive actions; never use `success` for decoration.
- Selected state is `primary-soft` + `primary-soft-foreground` (+ a `primary` inset bar in navigation). Pill tabs are selected by a `foreground` fill.
- Avoid: hardcoded hex or `rgb()` values, Tailwind palette colors (`bg-slate-100`, `text-red-500`), `black`/`white` literals (use tokens), gradients, new accent hues, coral (`primary`) text on `secondary-hover` or darker (4.1:1; use `primary-hover` there), `muted-foreground` text on `secondary-active` (4.47:1, switch the text to `foreground` while pressed), opacity to fake a lighter text color.
- Surface layering, outermost to innermost: `background` (page) -> `secondary` (recessed regions, sidebar) -> `card` (raised). Do not nest a card inside a card.

## 3. Typography

Fonts are system stacks (no network fetch, no layout shift), defined in `@theme inline`:

- `font-sans`: `ui-sans-serif, system-ui, -apple-system, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif` (default on `body`).
- `font-serif`: `Georgia, "Times New Roman", Times, serif`. Display headings only.

| Role | Classes / source | Size / line height |
| --- | --- | --- |
| Landing hero h1 | `.hero h1` in `styles/landing.css`; serif, weight 400, tracking -0.04em | 48-64px / 1.05 |
| Page title (h1, app and auth) | `PageHeader`, or `font-serif text-3xl font-normal tracking-tight` (`sm:text-4xl` in `PageHeader`) | 30-36px |
| Landing section title (h2) | `.section-intro h2`; serif | 20px |
| Card / dialog / section heading (h2, h3) | `text-lg font-semibold leading-snug` (`CardTitle`, `DialogTitle`) | 18px |
| Body | default (`text-base`) | 16px / 1.6 |
| UI text, labels, buttons, nav, form text | `text-sm` (+ `font-medium` for controls and labels) | 14px |
| Secondary description | `text-sm text-muted-foreground` | 14px |
| Caption, meta, badge | `text-xs` | 12px |
| Eyebrow | `.eyebrow` (12px, 600, tracking 0.12em, uppercase, `muted-foreground`) | 12px |

Rules:

- Exactly one `h1` per page, rendered by `PageHeader` (app) or the page's hero/auth card. Do not skip heading levels.
- Minimum text size is 12px (`text-xs`). Never use arbitrary sizes such as `text-[11px]`, and no all-caps text outside `.eyebrow` and the existing landing labels.
- Serif is for display headings (h1, landing h2). Do not use serif for buttons, labels, tables, form text, or card headings.
- Headings already get `text-wrap: balance` and paragraphs `text-wrap: pretty` from `globals.css`. Long, unbreakable strings (emails, user agents, URLs) get `wrap-anywhere`.
- Line length for reading text stays under about 70 characters: use `max-w-3xl` or narrower for prose and settings.

## 4. Spacing, layout, radius, elevation

- Spacing follows the Tailwind 4px scale. Use `gap-*`, `p-*`, `space-y-*` with standard steps (1, 2, 3, 4, 5, 6, 8, 10, 12, 16). No arbitrary values like `p-[13px]`. In plain CSS use rem multiples of `0.25rem`.
- Vertical rhythm: related items `gap-2`/`gap-3`; items inside a card `gap-4`; cards in a page `gap-6`; page header to content `mb-8` (built into `PageHeader`).
- Radius tokens: `rounded-sm` 6px (chips, tiny elements), `rounded-md` 8px (buttons, inputs, nav items, alerts), `rounded-lg` 12px (cards, dialogs), `rounded-xl` 16px (large feature surfaces only: auth card, landing feature band, preview plate), `rounded-full` (pills, badges, avatars). Do not invent other radii.
- Elevation: cards are flat (border only). `shadow-raised` is for the auth card and interactive-card hover; `shadow-overlay` is for floating layers: dialogs, menus and the file drop overlay; `shadow-preview` is for the landing notebook illustration. Do not put shadows on inline elements, buttons, or nested panels.
- Containers: the landing shell is capped at `85rem` (`.landing-shell`). The platform shell gives each page `max-w-6xl`; settings and prose pages wrap themselves in `max-w-3xl`. Page padding: `px-4 py-8` on phones, `sm:px-8 sm:py-12`, `lg:px-12`.
- Responsive: design mobile first; design tablet and phone layouts on purpose, not by squeezing desktop. Required widths to check: 320, 390, 768, 1024, 1440. No horizontal page scroll at any width (use `min-w-0`, `grid-cols-1`, `wrap-anywhere` for long content).
- Platform navigation is a full-height left sidebar with no top header: `w-64` from `sm` up; below `sm` it collapses to an `w-20` rail with icon above a 12px label and the wordmark hidden (`Brand compact`). Keep that pattern for new destinations.
- Public pages use the landing header; authenticated pages never render it.

## 5. Components

Use and extend what exists. All shared primitives are in `src/components/ui`; shared composites are listed below.

| Need | Use | Notes |
| --- | --- | --- |
| Any button or button-like link | `Button` (`ui/button.tsx`) | Variants: `default`, `destructive`, `outline`, `secondary`, `ghost`, `link`. Sizes: `sm` (36px), `default` (40px), `lg` (44px), `icon-sm`/`icon`/`icon-lg`. Use `asChild` with `Link` or `<a>` for navigation. `loading` shows a spinner and disables |
| Surface / panel | `Card`, `CardHeader`, `CardTitle` (`asChild` with `<h2>`), `CardDescription`, `CardContent`, `CardFooter` | Padding comes from `--card-padding` (16px phones, 24px from `sm`). `interactive` only when the entire card is a link or button |
| Text field | `Input` + `Label` (`htmlFor`/`id`) | 40px high, `border-input`. Never style a raw `<input>` |
| Multi-line text field | `Textarea` + `Label` (`htmlFor`/`id`) | Same border, surface and 16px-on-phones text as `Input`; at least 96px high and resizable in height only. Show a character count when `maxLength` is small. Never style a raw `<textarea>` |
| Inline message | `Alert` (`info`, `success`, `warning`, `error`) | Has icon + text; errors use `role="alert"`, others `role="status"` |
| Status label | `Badge` (`neutral`, `success`, `warning`, `error`, `info`) | Always contains text |
| Modal | `Dialog` + `DialogContent`, `DialogHeader`, `DialogTitle`, `DialogDescription`, `DialogFooter` | Title and description are required for accessibility. Put the safe action first in `DialogFooter`, the primary or destructive action last. `DialogContent` returns focus to whatever had it when the dialog opened, also for dialogs opened from state or a menu (Radix alone only does this for `DialogTrigger`). Put a form inside its own component within `DialogContent` so it starts fresh on every open |
| Destructive confirmation | `ConfirmDeleteDialog` (`components/platform/confirm-delete-dialog.tsx`) | Every delete goes through it. The description names what is destroyed; buttons are "Keep ..." and "Delete permanently". It stays open while the request runs and shows its error. Pass `focusAfterDelete` when the button that opened it disappears with the deleted item (a list row) |
| Secondary actions menu | `ActionMenu` (`components/platform/action-menu.tsx`) on `DropdownMenu` (`ui/dropdown-menu.tsx`) | An ellipsis icon button with an accessible name ("Workspace actions", "Actions for report.pdf"): `outline` in page headers, `ghost` in list rows. Entries are actions, links (open in a new tab) or separators; destructive entries come last after a separator and open a `ConfirmDeleteDialog`. The primary action stays a visible button, never only in the menu. Use `DropdownMenu` directly only for something that is not a list of actions |
| Tabs / content switcher | `Tabs` + `TabsList variant="default" \| "line" \| "pill"` | `default` for small segmented switches, `line` for page sections, `pill` for content switchers. Never put `overflow-*` on `TabsList`: it clips the focus ring of the tabs. A `TabsContent` whose content has its own buttons, links or fields passes `tabIndex={-1}` and `focus-visible:outline-none`, so the whole panel never shows a ring; a panel with nothing operable inside keeps Radix's default tab stop and ring |
| Logo | `Brand` (`components/brand.tsx`) | The only place the wordmark is drawn. Pass `href`, `label`, `compact` |
| Breadcrumb trail | `Breadcrumbs` (`components/platform/breadcrumbs.tsx`) | Every nested authenticated page (a page below a list page) puts it above `PageHeader`, for example Workspaces / Product team / Handbook. Parents are links, the last item is the current page (`aria-current="page"`). Do not add separate "back" buttons |
| Page title block | `PageHeader` (`components/platform/page-header.tsx`) | Eyebrow, serif h1, description, `meta` (counts and dates, as a `DotList`) and `actions`. Every authenticated page starts with it. Actions: at most one `default` button, then an `ActionMenu` for the rest. On phones the actions are one row: give the primary button `max-sm:flex-1` and move other visible buttons into the menu (`max-sm:hidden` on the button, an entry with `className: "sm:hidden"` in the menu) |
| Section of a page | `SectionHeader` (`components/platform/section-header.tsx`) | The section's h2 with an optional count and controls on the right. The h2 can take focus from code (`tabIndex={-1}`, no outline), for example after the item that had focus was deleted |
| Facts in one line | `DotList` (`components/platform/dot-list.tsx`) | "PDF · 12 MB · Added 30 Oct 2026". Lines break only between facts, never inside one |
| No content yet | `EmptyState` (`components/platform/empty-state.tsx`) | Icon, a heading that says what to do, one sentence on why, optional actions. When the page header already holds the primary action, the empty state's buttons are `outline`. A drop target adds `border-dashed border-input` |
| Loading and failed first load | `CardGridPlaceholder`, `RowListPlaceholder`, `HeaderPlaceholder` (`components/platform/loading-placeholders.tsx`); `LoadError` (`components/platform/load-error.tsx`) | Placeholders are static `bg-secondary` shapes in the real layout, with an `sr-only` label and `aria-busy`; they never pulse. `LoadError` is the error `Alert` plus an outline "Try again" |
| Login / session stage | `AuthScreen` + `AuthCard` (`components/auth/auth-screen.tsx`) | Renders the page `<main>` |
| App shell and sidebar | `PlatformShell` (`components/auth/platform-shell.tsx`) | Add destinations with `SidebarLink`; selected state comes from `aria-current` |

Specific standards:

- Buttons: one `default` button per view. Secondary actions are `outline` (visible boundary) or `ghost`/`link` (low emphasis). Destructive actions use `destructive` and need a confirmation step. Icon-only buttons need `aria-label` or an `sr-only` label and use an `icon-*` size. Icons inside buttons are 16px (`size-4`, automatic) and carry `aria-hidden="true"`.
- Links in prose: underlined or clearly different from body text. Links styled as buttons use `Button asChild`.
- Forms: every control has a visible `Label`; use `autoComplete`, `required`, `maxLength` where relevant; show validation errors in an `Alert` near the form or with `aria-invalid` on the field. Inputs use 16px text on phones (built in).
- Cards: use `CardTitle asChild` with a real heading element. Do not add extra shadows, gradients or colored borders (the only approved colored card border is `border-error/30` for the danger zone).
- Modals: one dialog at a time, no stacked dialogs, close button is built in. Destructive confirmation dialogs name the thing being destroyed.
- Navigation: sidebar links use `SidebarLink`; the current page is marked with `aria-current="page"`. Landing header links use the `.landing-nav` styles.
- Page structure: a page's own actions (create, upload, rename, delete) live in its `PageHeader`, not in a Settings tab. Add tabs only when a page has two or more areas people use often (for example Sources and Chat on a knowledge base).
- Grids of records (workspaces, knowledge bases): `WorkspaceCard` and `KnowledgeBaseCard` pattern. The whole card is a link (`Card interactive`), with a 40px tile (monogram or decorative icon), the name as a real heading, one line of detail, and a bordered footer with "Open" and an arrow that nudges 2px on hover.
- Lists of records (sources): one `Card` holding divided rows. A row has a 40px decorative icon tile (hidden below `sm` so the name gets the width), the name (`wrap-anywhere`), a status `Badge` followed by a `DotList` of details, and a row `ActionMenu`. Newest first. A `pill` tab filter appears only when the list holds more than one kind of record.
- File upload: a `Button` opens a hidden `<input type="file" multiple hidden>`, and files can also be dropped anywhere on the page (`useFileDrop` plus `DropOverlay` in `components/sources/`). Files are checked in the browser first, then sent one at a time by `useUploadQueue`; `UploadTray` shows waiting, uploading and failed files with the reason, "Try again" when it can help, and remove. Finished files join the list, and one success `Alert` sums them up. Keyboard and screen reader users use the button; drop is an extra.
- Landing-only CSS (`src/styles/landing.css`) is for the marketing composition and the illustration. Do not use landing classes in the app, and do not restyle `Button`, `Card` or `Tabs` there.

## 6. Interaction rules

One behavior per state across all components.

| State | Rule |
| --- | --- |
| Default | Use the variant's resting style. Interactive elements must be distinguishable without hover (fill, boundary, or underline) |
| Hover | Neutral controls: step up one surface (`secondary` -> `secondary-hover`). Primary: `primary-hover`. Destructive: `destructive-hover`. `link` variant: tint to `primary-soft`, text to `primary-soft-foreground`, underline thickens to 2px in `primary-hover`. Optional 2px icon nudge via `group-hover/button:translate-*-0.5` on directional arrows only |
| Focus-visible | Single global rule in `globals.css`: `2px solid var(--ring)` with `2px` offset. Do not add `outline-none`, `focus:ring-*`, or custom rings. Inputs additionally switch to `border-ring`. Non-interactive containers that only receive programmatic focus (`<main tabIndex={-1}>`, the dialog panel) may suppress their outline; nothing a user can operate may. The one deliberate exception is `line` tabs: by the owner's decision they draw no ring, and keyboard focus shows as the `secondary-hover` fill (the same fill as hover), or `primary-soft-hover` on the selected tab |
| Active / pressed | One step darker than hover (`primary-active`, `secondary-active`, `destructive-active`, `primary-soft-hover`) |
| Selected | `primary-soft` + `primary-soft-foreground` for navigation and toggle buttons (`aria-pressed`); `foreground` fill for pill tabs; `primary-soft` fill + `primary-soft-foreground` text + `primary` underline for line tabs |
| Disabled | `disabled` attribute (not just a style); 50% opacity and no pointer events are built in. Always keep the reason discoverable (inline message or label) |
| Loading | `Button loading` (spinner + `aria-busy` + disabled). Keep the label, optionally change the wording ("Connecting to Google..."). Only the clicked button shows the spinner |
| Error | `Alert variant="error"` for messages; `aria-invalid` on the field. Text must say what happened and what to do |

Motion:

- Transitions are 150ms, `ease-out` (`--default-transition-duration`), applied through `transition-colors` (or `transition-[border-color,box-shadow]`). Dialogs use the built-in `tw-animate-css` enter/exit at 200ms.
- Animate only color, background, border, shadow, and small 2px translations. No scaling, bouncing, parallax, glow, or looping animation except the loading spinner.
- `prefers-reduced-motion: reduce` is handled globally (durations collapse, smooth scroll off). Add `motion-reduce:transition-none` / `motion-reduce:animate-none` to any custom transform or animation.

## 7. Accessibility requirements

Target WCAG 2.2 AA. This file and the automated checks below do not replace testing with assistive technology.

- Contrast: text 4.5:1 (3:1 for text of 24px+ or 18.66px bold); UI boundaries, icons and focus indicators 3:1. Check new token pairs before using them and record them in the table in section 2.
- Keyboard: every action works with the keyboard in a logical order; visible focus on every interactive element; no keyboard traps; dialogs return focus on close (Radix handles this).
- Skip link and landmarks: the root layout provides "Skip to main content". Every page has exactly one `<main id="main-content" tabIndex={-1}>`. Use `<nav aria-label>` for navigation, and `aria-current="page"` for the current destination.
- Targets: interactive controls are at least 40px tall (`default`), never under 24px; prefer `lg` (44px) for primary calls to action.
- Images and icons: decorative icons `aria-hidden="true"`; informative images have `alt`. Meaning is never carried by color alone.
- Forms: labels, `autoComplete`, accessible error text, and `role="alert"`/`role="status"` messages.
- Reflow: content works at 320px width and 200% zoom without horizontal scrolling or clipped text.
- Motion: see section 6. No auto-playing or flashing content.
- Responsive images and text: use relative units; never lock heights on text containers (buttons use `min-h-*` so wrapped labels grow).

## 8. Implementation conventions

Where things live:

- Tokens, theme, base styles, focus rule, `.eyebrow`, reduced motion: `src/app/globals.css`.
- Landing page layout CSS: `src/styles/landing.css` (imported by `globals.css`, inside `@layer components`).
- Shared primitives: `src/components/ui/*`. Cross-page composites: `src/components/brand.tsx`, `src/components/platform/*`, `src/components/auth/*`.
- Page-specific components: `src/components/<area>/`.
- Calls to the Express API: `src/lib/api-client.ts` (`apiRequest`, `ApiRequestError`, `errorMessage`) plus one `src/lib/<feature>-api.ts` per feature. They send the session cookie and reuse `NEXT_PUBLIC_AUTH_URL`; show `errorMessage(cause)` in an `Alert`. Do not add a data-fetching library without approval.
- `cn()` from `@/lib/utils` merges class names.

How to work:

- Default to Tailwind utilities that reference tokens. Write custom CSS only for the landing composition. Custom CSS goes in `@layer components` so Tailwind utilities in JSX can override it. Unlayered CSS beats utilities and breaks `className` overrides.
- Size and color of a Button come from `variant` and `size`. Do not pass `h-*`, `px-*`, `bg-*`, `rounded-*` or `text-*` color/size classes to `Button`. Layout classes (`w-full`, `mt-6`, `justify-self-start`) are fine.
- No `dark:` classes. Tailwind v4's `dark:` follows the OS setting and would half-apply a theme that does not exist.
- Adding a variant: add it to the existing `cva` definition in the component (for example `buttonVariants`), using tokens only, covering default, hover, active, focus (inherited), disabled and loading. Document it in section 5 of this file. Never create a second button/card/dialog component.
- Adding a token: add it to `:root`, expose it in `@theme inline`, verify contrast, then add it to the table in section 2. A new token needs a functional reason, not a visual one.
- Adding a shared component: put it in `components/ui` if it is a generic primitive, otherwise in a feature folder. Match the file conventions (`data-slot`, `cn`, `cva`, `React.ComponentProps`).
- Adding a page: authenticated pages go in `src/app/(platform)/`, start with `PageHeader`, lay out content with `Card`s on a `grid gap-6`, and cap prose or forms with `max-w-3xl`. Add the destination to the sidebar with `SidebarLink`.
- Adding a shadcn component: run the CLI, then replace `dark:` classes, black/white literals, `ring-*` focus styles, non-token radii and shadows, and arbitrary sizes with the rules in this file before committing.

## 9. Anti-patterns (do not do these)

- Hardcoded colors (`#...`, `rgb()`, `bg-slate-*`, `text-red-*`, `bg-black/50`); use tokens.
- A new button style, a custom hover color, or a custom radius on one screen. Reuse `Button` variants.
- Two coral solid buttons competing in one view; coral text for small body copy; `brand` coral on anything interactive.
- Custom focus rings, `outline-none` without a replacement, hover-only affordances for essential actions.
- Arbitrary spacing and sizes (`mt-[13px]`, `text-[11px]`, `w-[437px]`); text below 12px.
- Shadows on resting cards, shadows on buttons, nested cards, decorative gradients, glow effects, scale-on-hover.
- Serif text outside display headings; ALL CAPS body text; more than the documented type roles.
- Unlayered CSS that targets shared components; copying landing CSS into the app.
- Color-only status (a red border with no message); empty icon-only buttons with no accessible name.
- Fixed-height text containers, `whitespace-nowrap` on long labels in narrow containers, content that only fits at 1440px.
- Adding dark-mode classes, new fonts that require a network fetch, or new UI dependencies without approval.

## 10. Checklist before finishing any UI work

1. Reused existing components and variants; no new one-off styles. Colors, radii, shadows and type sizes come from tokens and the scales above.
2. New or changed color pairs meet contrast (4.5:1 text, 3:1 UI) and are listed in section 2.
3. One `h1`; heading levels in order; a visible label for every form control; accessible names for icon-only controls.
4. Every interactive element has hover, active, focus-visible, disabled and (where async) loading behavior from section 6, and works by keyboard only.
5. Checked at 320, 390, 768, 1024 and 1440 widths: no horizontal scroll, no clipped or overlapping content, targets at least 24px (ideally 40px+).
6. Long text (emails, names, user agents) wraps instead of overflowing.
7. Animations are the approved 150ms color/shadow/2px-translate type, with reduced-motion handled.
8. No `dark:` classes, no unlayered custom CSS affecting shared components, no hardcoded colors.
9. `npm run lint`, `npm run typecheck` and `npm run build` pass.
10. If you introduced a token, variant or component, you updated this file in the same change.
