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

UI uses Tailwind CSS and locally owned shadcn Button, Card, Dialog, and Tabs components, customized with the agreed Ekam palette. Add future shadcn components using `npx shadcn@latest add <component>`.

## Theme colors

Edit the `:root` tokens in `src/app/globals.css` to change the theme. Tailwind/shadcn colors and the preview shadow derive from these tokens.

| Token | Color |
| --- | --- |
| `--background` | `#FAFAFA` |
| `--secondary` | `#F1F5F9` |
| `--card` | `#FFFFFF` |
| `--muted` | `#F8FAFC` |
| `--foreground` | `#1E293B` |
| `--muted-foreground` | `#4B5E77` |
| `--primary` | `#D86A5D` |
| `--primary-foreground` | `#FFFFFF` |
| `--primary-hover` | `#BE5A4F` |
| `--border` | `#E2E8F0` |
| `--input` | `#CBD5E1` |
| `--ring` | `#D86A5D` |
| `--secondary-hover` | `#E2E8F0` |

Semantic colors are separate from the primary action color:

| Base token | Color | Soft background | Text on soft background | Intended use |
| --- | --- | --- | --- | --- |
| `--error` | `#E11D48` | `--error-bg: #FEE2E2` | `--error-foreground: #9F1239` | Errors and destructive actions |
| `--success` | `#059669` | `--success-bg: #D1FAE5` | `--success-foreground: #065F46` | Successful uploads or completed synchronization |
| `--warning` | `#D97706` | `--warning-bg: #FEF3C7` | `--warning-foreground: #92400E` | Confidence or rate-limit warnings |
| `--info` | `#2563EB` | `--info-bg: #DBEAFE` | `--info-foreground: #1E40AF` | Informational and processing states |

These tokens expose Tailwind utilities such as `text-error`, `bg-success`, `border-warning`, and `text-info`. `--destructive` references `--error`, so shadcn destructive buttons stay synchronized with the error palette; their hover color is derived from it. Reserve coral for primary actions. Semantic components should include a clear text label or icon, and text/background combinations need contrast checks before use; these base colors are not universally suitable for small text.

For banners, pair `bg-success-bg` with `text-success-foreground` (or the corresponding error, warning, or info tokens). These foregrounds are dark text colors for soft surfaces, not text colors for solid semantic buttons. Use `bg-muted` for code/citation surfaces, `border-input` for form controls, and `ring-ring` for focus indicators. The landing preview shows the input border token but remains an illustration; real chat controls will be added with platform features.

Primary buttons use the requested white-on-coral combination. Its normal-state contrast is approximately 3.42:1, below the 4.5:1 target for small text; it is not an accessibility-compliant small-text pairing. Small text links use the foreground color with a coral underline instead. Increasing font weight alone does not fix insufficient color contrast.

Notebook examples are interactive illustrations. Authentication, real notebooks, and backend connections come in later migration stages. All packages and configuration belong to this client repo; no `old-*` files or environment values are loaded.

Agents must stop any client server they start after testing, including on failure. Leave user-started servers alone.
