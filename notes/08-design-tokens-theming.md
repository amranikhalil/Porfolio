# §8 — Design Tokens + Theme Toggle

The most senior-grade pattern in the plan. This is where you stop thinking in pages and start thinking in systems. Below: every concept, fully explained.

---

## 1. Why design tokens (the system view)

### The junior way

```css
.button { background-color: #ed6955; }
.alert  { background-color: #ed6955; }
.heading::after { background-color: #ed6955; }
/* ...50 more files... */
```

Want to rebrand to a new accent color? **Touch every file.** Grep won't catch every variant ("#ED6955" vs "rgb(237, 105, 85)" vs "hsl(...)"). One missed reference = visible drift.

### The senior way

```css
:root { --color-accent: #ed6955; }

.button { background-color: var(--color-accent); }
.alert  { background-color: var(--color-accent); }
.heading::after { background-color: var(--color-accent); }
```

Rebrand = change ONE line. Every consumer updates automatically.

**This is just CSS custom properties.** The deeper senior move is *two-tier* tokens.

---

## 2. Two-tier token architecture

### The structure

```
TIER 1 — PRIMITIVE (raw values)
  --slate-900: #121e27;
  --orange-500: #ed6955;
  --space-4: 16px;

TIER 2 — SEMANTIC (meaning, references primitives)
  --color-bg: var(--slate-50);
  --color-accent: var(--orange-500);
  --color-text: var(--slate-900);

COMPONENTS consume only SEMANTIC tokens.
```

### Why two layers, not one?

When you introduce a theme (dark mode), the **meaning** stays the same. The "background" is still the background. Only its **value** changes:

```css
:root {
  --color-bg: var(--slate-50);    /* light theme bg */
}

[data-theme='dark'] {
  --color-bg: var(--slate-950);   /* dark theme bg */
}

.section {
  background-color: var(--color-bg);   /* doesn't change! */
}
```

The component CSS doesn't know about themes. It just reads `--color-bg`. The theme override swaps what that resolves to.

### Mental model

> *Primitives are paint cans on a shelf. Semantics are labels on the wall: "kitchen wall," "ceiling trim," "front door." The labels stay fixed; the paint in the can swaps when you change theme.*

### Naming primitives

```css
/* ❌ Bad — color names describe role, not value */
--accent: #ed6955;       /* what if "accent" changes to teal? */

/* ✅ Good — names describe value, role-agnostic */
--orange-500: #ed6955;
--orange-600: #d9543f;
--orange-700: #c14935;
```

Use a numeric scale (50, 100, 200... 900) like Tailwind. Most design tools follow this. **Memorize the scale** — it's a shared vocabulary.

### Naming semantics

```css
/* ❌ Bad — names describe value */
--gray-bg: ...;
--orange-button: ...;

/* ✅ Good — names describe role */
--color-bg: ...;
--color-accent: ...;
--color-on-accent: ...;       /* text color when ON the accent (e.g., white) */
--color-surface: ...;          /* cards, panels */
--color-text-muted: ...;       /* secondary text */
--color-border: ...;
```

The semantic name should make the consumer's intent clear:

```css
.button {
  background-color: var(--color-accent);     /* "I'm the brand button" */
  color: var(--color-on-accent);              /* "text that sits on the accent" */
}
```

Reads like a sentence. Self-documenting.

---

## 3. Token categories you'll need

Real design systems track:

| Category | Examples |
|---|---|
| Colors | `--color-bg`, `--color-accent`, `--color-text` |
| Spacing | `--space-1`, `--space-2`, ... `--space-9` |
| Radius | `--radius-sm`, `--radius-md`, `--radius-pill` |
| Shadows | `--shadow-sm`, `--shadow-md`, `--shadow-accent` |
| Type sizes | `--text-sm`, `--text-base`, `--text-lg` (optional) |
| Z-index | `--z-base`, `--z-nav`, `--z-modal` (optional) |

Start with colors + spacing + radius + shadows. Add the rest as needed.

### A spacing scale

```css
--space-1: 4px;
--space-2: 8px;
--space-3: 12px;
--space-4: 16px;
--space-5: 24px;
--space-6: 32px;
--space-7: 48px;
--space-8: 64px;
--space-9: 80px;
```

**Why a scale?** Constrains your choices. Five hardcoded `padding: 17px` in different components creates visual chaos. A scale (multiples of 4 or 8) creates rhythm.

> **Rule:** *If your padding value isn't in the scale, you're probably wrong, not the scale.*

---

## 4. The `[data-theme='dark']` selector pattern

### Why `data-theme` attribute?

```jsx
<html data-theme="dark">
```

```css
[data-theme='dark'] {
  --color-bg: var(--slate-950);
}
```

Why not a class?

```jsx
<html class="dark">       <!-- Tailwind's pattern -->
```

Both work. `data-theme` is slightly more semantic (it *is* a piece of data about the page). Tailwind chose `class` for compactness. **Pick one and be consistent.**

### Why on `<html>` not `<body>`?

`html` is the highest-level element. Tokens defined on `:root` (which targets `<html>`) cascade everywhere. Putting the theme there means the override applies to literally everything.

If you put it on `<body>`, scoped overrides inside `<body>` work — but elements outside `<body>` (rare but possible, like `<dialog>` backdrop pseudo-element) won't see them.

### Setting it from JS

```js
document.documentElement.dataset.theme = 'dark'
// equivalent to:
document.documentElement.setAttribute('data-theme', 'dark')
```

`documentElement` is the `<html>` element. `dataset` is the camelCase JS interface to `data-*` attributes.

---

## 5. The `useTheme` hook — full pattern

```js
import { useState, useEffect, useCallback } from 'react'

const STORAGE_KEY = 'theme'

const getInitialTheme = () => {
  if (typeof window === 'undefined') return 'light'

  const stored = window.localStorage.getItem(STORAGE_KEY)
  if (stored === 'light' || stored === 'dark') return stored

  const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches
  return prefersDark ? 'dark' : 'light'
}

export const useTheme = () => {
  const [theme, setTheme] = useState(getInitialTheme)

  useEffect(() => {
    document.documentElement.dataset.theme = theme
    window.localStorage.setItem(STORAGE_KEY, theme)
  }, [theme])

  const toggleTheme = useCallback(() => {
    setTheme((prev) => (prev === 'dark' ? 'light' : 'dark'))
  }, [])

  return { theme, toggleTheme }
}
```

### Walk through

**A. The preference cascade in `getInitialTheme`**

```
1. User has clicked the toggle before? → use stored choice
2. No stored choice? → use OS preference (prefers-color-scheme)
3. No OS preference? → default to light
```

**Memorize this hierarchy:** *Explicit user choice > implicit system preference > sensible default.* It applies to virtually every user-preference system.

**B. The SSR guard**

```js
if (typeof window === 'undefined') return 'light'
```

`window` is undefined during server-side rendering (Next.js, Remix). This guard makes the hook SSR-safe **for free**. Costs one line, prevents a future-you migration headache.

**C. `useEffect` syncs state → side effects**

```js
useEffect(() => {
  document.documentElement.dataset.theme = theme
  localStorage.setItem('theme', theme)
}, [theme])
```

State is the source of truth. DOM and localStorage are sinks. **Don't write to DOM in event handlers.** Let the effect own the sync.

**D. `useCallback` on `toggleTheme`**

```js
const toggleTheme = useCallback(() => {
  setTheme((prev) => prev === 'dark' ? 'light' : 'dark')
}, [])
```

Stable function identity across renders. If we pass `toggleTheme` to a memoized child via `React.memo`, the child doesn't re-render unnecessarily.

**E. Functional setState**

`setTheme((prev) => ...)` not `setTheme(theme === 'dark' ? ...)`. Same rule from §1's tricks.md — *if new state depends on previous state, use the function form*.

---

## 6. The `ThemeToggle` component

```jsx
export const ThemeToggle = () => {
  const { theme, toggleTheme } = useTheme()
  const isDark = theme === 'dark'

  return (
    <button
      type="button"
      onClick={toggleTheme}
      aria-label={isDark ? 'Switch to light theme' : 'Switch to dark theme'}
      title={isDark ? 'Switch to light theme' : 'Switch to dark theme'}
    >
      {isDark ? <HiSun /> : <HiMoon />}
    </button>
  )
}
```

### Things to notice

1. **`type="button"`** — without it, in a form context the default is `type="submit"`, which would submit a form. Junior bug.
2. **Dynamic `aria-label`** — when the toggle changes state, the label tells the screen reader what it WILL do, not what it just did.
3. **`title` attribute** — tooltip on hover for mouse users. Reinforces affordance.
4. **Sun icon in dark mode** = "click me to go light." Moon in light mode = "click me to go dark." **Affordance: show the destination, not the current state.** This is a senior microcopy decision.

---

## 7. The token sweep — replacing hex everywhere

### Before

```css
.skill {
  padding: 14px 16px;
  background-color: #fff;
  border: 1px solid #e5e7eb;
  border-radius: 10px;
  color: #3a4654;
}
```

### After

```css
.skill {
  padding: var(--space-3) var(--space-4);
  background-color: var(--color-surface);
  border: 1px solid var(--color-border);
  border-radius: var(--radius-md);
  color: var(--color-text-soft);
}
```

**Every component CSS module went through this transformation.** Same visual output, infinitely more flexible.

### Verification step

```bash
# After your sweep, run this:
grep -rE '#[0-9a-fA-F]{3,8}\b' src --include='*.css'
```

If anything matches outside `var.css`, you missed a sweep target. **For our portfolio, only `var.css` has hex values now.**

---

## 8. CSS custom property passed from JS (the §4 pattern reused)

Recall from §4:

```jsx
<li style={{ '--skill-color': '#F7DF1E' }}>
```

```css
.skill { --skill-color: var(--color-text); }   /* default */
.skill:hover { border-color: var(--skill-color); }
.skill .icon { color: var(--skill-color); }
```

**Mental note:** custom properties bridge JS data to CSS. They cascade, can be overridden inline, and respect specificity. The senior CSS use case isn't just theming — it's **any dynamic styling that the cascade can express better than inline styles.**

---

## 9. Performance: CSS variables are RUNTIME

### Tradeoff

| Approach | Build cost | Runtime cost |
|---|---|---|
| Sass variables (`$accent`) | Compile-time substitution | None — value is baked in |
| CSS custom properties (`var(--accent)`) | None | Lookup at render |
| Tailwind classes | None | Different runtime model |

CSS custom properties have a tiny runtime cost — the browser looks them up every paint. For a normal portfolio it's imperceptible (microseconds). For a 60fps animation toggling theme, it can become noticeable.

**Reality:** for 99% of work, the dynamic flexibility wins. Only worry about runtime cost when profiling shows it matters.

---

## 10. Bonus: animating theme transitions

```css
:root {
  /* tokens... */
}

html {
  transition: background-color 0.3s ease, color 0.3s ease;
}

* {
  transition: background-color 0.3s ease, border-color 0.3s ease;
}
```

**Be careful** — `*` selector is broad and can animate things you didn't intend (input focus rings, etc.). Better scoped:

```css
.section, .card, button {
  transition: background-color 0.3s, color 0.3s, border-color 0.3s;
}
```

We didn't add transitions in this build because the toggle should feel instant. **Senior call:** instant on click feels more responsive than animated.

---

## 11. The §8 reflex card

Before writing any new component CSS:

1. ☐ Is there a token for the color I'm about to type? Use it.
2. ☐ Is the spacing value in the scale (4, 8, 12, 16, 24, 32, 48, 64, 80)?
3. ☐ If I'm adding a hex value, am I in `var.css` (the only place that's allowed)?
4. ☐ Does this component need to look different in dark mode? It probably doesn't — semantics handle it.
5. ☐ Did I add a new primitive that should be exposed semantically?

After any refactor:

```bash
grep -rE '#[0-9a-fA-F]{3,8}\b' src --include='*.css'
```

The result should only show `var.css`. If it shows anything else, you missed a sweep.

---

## 12. Things deferred / future improvements

- **System theme change listener** — currently we only check `prefers-color-scheme` on initial load. If a user changes their OS theme while the tab is open, we don't react. Add a `matchMedia(...).addEventListener('change', ...)` to do this.
- **Theme transition animation** — see §10 above
- **`<meta name="theme-color">` swap** — update the mobile URL bar color when theme changes
- **Per-section overrides** — if a specific section ALWAYS needs to be dark (like a "night mode" gallery), wrap it in `<section data-theme="dark">` to scope just that subtree

---

## 13. Why this section signals "senior"

A junior portfolio has `#ed6955` written in 30 places.
A mid-level portfolio uses CSS custom properties for ~5 colors.
A senior portfolio has a two-tier token system, themes, persisted preferences, and a useTheme hook.

**You can now talk about design systems in interviews.** The vocabulary — primitives, semantics, role tokens, theme remapping — is what design system engineers use at Stripe, Vercel, GitHub. You speak their language.
