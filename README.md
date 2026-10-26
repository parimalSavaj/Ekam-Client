# Ekam client

Next.js, React, and TypeScript starter with the first Ekam landing screen.

## Run locally

Use Node.js 20.9 or newer. From `client/`:

```bash
npm install
npm run dev
```

Open http://localhost:3000. No environment variables or backend are required.

## Checks and production

```bash
npm run lint
npm run typecheck
npm run build
npm start
```

The public landing page has its own header. Future platform screens use a full-height left sidebar without a top header; the root layout does not include the landing header.

UI uses Tailwind CSS v4 and locally owned shadcn components (Button, Card, Dialog, Tabs, Input, Label, Badge, Alert), customized with the Ekam slate-and-coral palette. Add future shadcn components using `npx shadcn@latest add <component>`, then conform them to the design system.

**Design rules for humans and AI agents live in [`AGENTS.md`](./AGENTS.md).** Read it before changing any UI: it documents the color tokens, typography, spacing, component variants, interaction states, accessibility requirements and the checklist for new features.

## Theme colors

Edit the `:root` tokens in `src/app/globals.css` to change the theme. Tailwind/shadcn colors and the shadows derive from these tokens. `AGENTS.md` holds the full table with contrast ratios.

| Token | Color |
| --- | --- |
| `--background` | `#FAFAFA` |
| `--secondary` | `#F1F5F9` |
| `--secondary-hover` / `--secondary-active` | `#E2E8F0` / `#CBD5E1` |
| `--card` | `#FFFFFF` |
| `--muted` | `#F8FAFC` |
| `--foreground` | `#1E293B` |
| `--muted-foreground` | `#4B5E77` |
| `--primary` | `#B94C41` |
| `--primary-foreground` | `#FFFFFF` |
| `--primary-hover` / `--primary-active` | `#9F4237` / `#8A382E` |
| `--primary-soft` / `--primary-soft-hover` | `#FBEDEA` / `#F6E0DB` |
| `--primary-soft-foreground` / `--primary-soft-border` | `#8A382E` / `#EFCBC5` |
| `--brand` (decorative coral only) | `#D86A5D` |
| `--border` | `#E2E8F0` |
| `--input` (form control boundary) | `#7C8CA3` |
| `--ring` | `#B94C41` |

Semantic colors are separate from the primary action color:

| Base token | Color | Soft background | Text on soft background | Intended use |
| --- | --- | --- | --- | --- |
| `--error` | `#E11D48` | `--error-bg: #FEE2E2` | `--error-foreground: #9F1239` | Errors and destructive actions |
| `--success` | `#059669` | `--success-bg: #D1FAE5` | `--success-foreground: #065F46` | Successful uploads or completed synchronization |
| `--warning` | `#D97706` | `--warning-bg: #FEF3C7` | `--warning-foreground: #92400E` | Confidence or rate-limit warnings |
| `--info` | `#2563EB` | `--info-bg: #DBEAFE` | `--info-foreground: #1E40AF` | Informational and processing states |

These tokens expose Tailwind utilities such as `text-error`, `bg-success`, `border-warning`, and `text-info`. `--destructive` references `--error`, so shadcn destructive buttons stay synchronized with the error palette; their hover and pressed colors are derived from it. Reserve coral for primary actions and selected states. Semantic components should include a clear text label or icon (use the `Alert` and `Badge` components), and text/background combinations need contrast checks before use; these base colors are not universally suitable for small text.

For banners, pair `bg-success-bg` with `text-success-foreground` (or the corresponding error, warning, or info tokens). These foregrounds are dark text colors for soft surfaces, not text colors for solid semantic buttons. Use `bg-muted` for code/citation surfaces, `border-input` for form controls, and `ring-ring` for focus indicators.

Primary buttons are white on `#B94C41` (5.0:1, WCAG AA for normal text; hover 6.4:1, pressed 7.8:1). The earlier `#D86A5D` coral measured 3.42:1 with white and no longer carries text or controls. It remains as `--brand` for decoration only: the wordmark dot, large display text, and small illustrations. Form control borders use `--input` (3.4:1 on white) so fields remain visible; `--border` is for decorative hairlines.

Notebook examples are interactive illustrations. Google login and account settings now connect to the Express backend. Real notebooks come in later migration stages. All packages and configuration belong to this client repo; no `old-*` files or environment values are loaded.

Agents must stop any client server they start after testing, including on failure. Leave user-started servers alone.

## Google login

Set `NEXT_PUBLIC_AUTH_URL=http://localhost:5000` in the client-local `.env`. This is the browser-facing Express origin; no secrets belong in client configuration. Use `/login` for Google-only login, `/app` for the authenticated landing screen, and `/account` for profile/session settings. Both first-time and returning users choose Login with Google. No registration/password forms or mail service are present.

Run the full local stack with root `make start`; it applies server migrations first. Production must provide NEXT_PUBLIC_AUTH_URL at build time and use HTTPS with frontend/API on the same site. The backend enforces cookie sessions independently of the client UI. Builds use Webpack, matching the Docker development setup and avoiding local Turbopack worker issues on Windows.
