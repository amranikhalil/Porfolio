# Senior-Level Tricks & Patterns

A living cheat sheet of every concept we've applied while leveling up this portfolio.
Re-read this any time you're about to write code — these are the reflexes that distinguish senior from junior.

---

## 🧠 The 3 mental anchors

Before any rule, internalize these three lenses. Every other trick below flows from them:

1. **"Does this code do anything?"** — If deleting it changes nothing the user can see, delete it.
2. **"Validate at boundaries, trust inside."** — Check inputs at the door (URL params, JSON files, API responses). After that, destructure with confidence.
3. **"One source of truth."** — One font-family declaration, one nav links array, one design token. Repetition = drift = bugs.

---

## ⚛️ React patterns

### Truthy check > equality check

```jsx
// ❌ Junior
{project.detaille != '' && <View />}

// ✅ Senior
{project.detaille && <View />}
```
**Why:** Handles `''`, `null`, `undefined`, `0` in one stroke. `!= ''` only handles one case AND uses loose equality.
**Mental image:** *"Truthy is the umbrella. Equality is one raindrop."*

### `&&` for conditional render, not ternary-with-null

```jsx
// ❌ Junior
{loaded ? <Item /> : null}

// ✅ Senior
{loaded && <Item />}
```

### Functional setState when next depends on previous

```jsx
// ❌ Junior — reads stale state
setCount(count + 1)

// ✅ Senior — always reads fresh state
setCount((c) => c + 1)
```
**Rule:** *Whenever the new value uses the old value, pass a function, not a value.* Survives batching, async, StrictMode double-invocation.
**This is the #1 React interview question.**

### Stable string keys, never array indexes

```jsx
// ❌ Junior
{items.map((item, i) => <Card key={i} />)}

// ✅ Senior
{items.map((item) => <Card key={item.slug} />)}
```
**Why:** Index keys break React's reconciliation when the list reorders, filters, or animates.

### Routes never hardcode their data

```jsx
// ❌ Junior — one route per project
<Route path="/Project1" element={<Detail/>} />
const images = ['carManagment.png', ...]   // hardcoded

// ✅ Senior — one route, any project
<Route path="/:slug" element={<Detail/>} />
const { slug } = useParams()
const project = projects.find(p => p.slug === slug)
```

### Defensive lookup before destructure

```jsx
// ❌ Junior — crashes on /UnknownRoute
const { title, images } = project.detaille

// ✅ Senior
if (!project || typeof project.detaille !== 'object') {
  return <NotFound />
}
const { title, images } = project.detaille
```

### Don't shadow outer names

```jsx
// ❌ Junior — inner `history` shadows the imported `history`
history.map((history, id) => <Row data={history} />)

// ✅ Senior
history.map((entry) => <Row data={entry} />)
```

### Inline constants with one call site

```jsx
// ❌ Junior — pointless indirection
const numberOfImage = 1
images.slice(idx, idx + numberOfImage)

// ✅ Senior
images.slice(idx, idx + 1)
```
**Rule:** *Abstraction has a cost. Only pay it when there's a reason.*

---

## 🔗 JavaScript & API gotchas

### `window.open` features is ONE comma-separated string

```js
// ❌ Junior — 'noreferrer' is silently ignored
window.open(url, '_blank', 'noopener', 'noreferrer')

// ✅ Senior
window.open(url, '_blank', 'noopener,noreferrer')
```
**Signature:** `window.open(url, target, features)` — exactly 3 args.

### `target="_blank"` ALWAYS pairs with `rel="noopener noreferrer"`

```jsx
<a href="https://github.com/..."
   target="_blank"
   rel="noopener noreferrer">GitHub</a>
```
**Why:** Without `noopener`, the new tab gets `window.opener` reference — malicious site can redirect your tab. `noreferrer` also prevents leaking the Referer header.
**Mental image:** *"Open a new tab? Cut the cord."*

### `!==` not `!=`

`!=` does type coercion (`0 != ''` is `false`). Use strict `!==` always unless you specifically want coercion.

---

## 🌐 HTML semantics

### Valid parent → child pairings

| Parent | Allowed direct children |
|---|---|
| `<ul>` `<ol>` `<menu>` | `<li>` only |
| `<table>` | `<thead>` `<tbody>` `<tfoot>` `<tr>` `<caption>` |
| `<tr>` | `<th>` `<td>` only |
| `<dl>` | `<dt>` `<dd>` (+ `<div>` as group) |
| `<picture>` | `<source>` then `<img>` |

```html
<!-- ❌ Junior -->
<ul>
  <div class="card">...</div>
</ul>

<!-- ✅ Senior -->
<ul>
  <li class="card">...</li>
</ul>
```

### Buttons, not divs/images with onClick

```jsx
// ❌ Junior — not keyboard-focusable, not announced as button
<img onClick={toggle} src="menu.png" />

// ✅ Senior
<button onClick={toggle} aria-label="Open menu">
  <HiMenu />
</button>
```

### Self-close childless elements

```jsx
<a href="..." className="icon"></a>   // ❌
<a href="..." className="icon" />     // ✅
```

### `<Link>` in React Router apps

```jsx
// ❌ Triggers a full page reload, loses state
<a href="/">Home</a>

// ✅ Client-side nav
<Link to="/">Home</Link>
```

---

## ♿ Accessibility

### Icon-only interactive elements need accessible names

```jsx
// ❌ Screen reader hears: "button"
<button onClick={prev}><GoChevronLeft /></button>

// ✅ Screen reader hears: "Previous image, button"
<button onClick={prev} aria-label="Previous image">
  <GoChevronLeft />
</button>
```

### Decorative imagery is hidden from a11y tree

```jsx
// Decorative background floating cloud
<div className="cloud" aria-hidden="true">
  <img src="cloud.svg" alt="" />
</div>

// Meaningful project screenshot
<img src="..." alt="Car management dashboard screenshot" />
```
**Rule:** *Empty `alt=""` = "I'm decorative, ignore me." Missing `alt` = violation.*

### Disclosure (collapsible) pattern

```jsx
<button
  aria-expanded={open}
  aria-controls="panel-id"
  onClick={toggle}
>Menu</button>
<ul id="panel-id" hidden={!open}>...</ul>
```

---

## 📦 JSON syntax (strict — stricter than JS)

| Allowed in JS | Allowed in JSON? |
|---|---|
| Trailing commas | ❌ No |
| Single quotes | ❌ No (double only) |
| Unquoted keys | ❌ No |
| Comments | ❌ No |
| Multi-line strings | ❌ No (use `\n`) |

```json
// ❌ INVALID — newline inside string
{ "intro": "Line one
            Line two" }

// ✅ VALID
{ "intro": "Line one Line two" }
{ "intro": "Line one\nLine two" }
```

---

## 🎨 CSS — fluid, modern, performant

### `clamp(min, ideal, max)` for fluid type

```css
/* One line replaces ~5 media queries */
font-size: clamp(2.5rem, 6vw, 4rem);
```
**Mental image:** *"Browser picks the middle value, never below min, never above max."*

### `scroll-margin-top` for sticky-header anchors

```css
:where([id]) {
  scroll-margin-top: 80px;   /* navbar height */
}
```
**Why:** Without it, clicking `#about` puts the heading *under* the sticky navbar.

### `:where()` for zero-specificity defaults

```css
:where(button, a) { transition: color 0.2s; }
```
Components can override without specificity wars.

### `min-height` to prevent layout shift

```css
.subtitle {
  min-height: 2.5rem;   /* reserves space for typed.js animation */
}
```

### `flex-shrink: 0` to lock dimensions in flex

```css
.heroImg {
  width: 320px;
  flex-shrink: 0;   /* don't let the photo squish */
}
```

### `column-reverse` on mobile

```css
@media (max-width: 900px) {
  .hero { flex-direction: column-reverse; }
}
```
**Mental image:** *Source order says text-first (SEO + a11y). Visual order shows image-first on mobile.*

### `transition` named properties, not `all`

```css
/* ❌ Junior — watches everything */
transition: all 0.2s ease;

/* ✅ Senior — explicit list */
transition: transform 0.2s ease, background-color 0.2s ease;
```

### Font stacks always end with a generic family

```css
font-family: 'Outfit', system-ui, -apple-system, 'Segoe UI', sans-serif;
```
**Mental image:** *"If Outfit fails, fall through the stack and land on whatever the OS has."*

### Font smoothing for macOS polish

```css
body {
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}
```

### Hover transforms — small, predictable

```css
/* ❌ Junior — moves AWAY from cursor diagonally */
.btn:hover { transform: translate3d(20px, 20px, 0); }

/* ✅ Senior — subtle lift, button stays under cursor */
.btn:hover { transform: translateY(-2px); }
```

### Set `font-family` ONCE on `body`, let it cascade

```css
/* ❌ Junior — set everywhere */
.app { font-family: 'Outfit', ...; }
.hero { font-family: 'Outfit', ...; }
.card { font-family: 'Outfit', ...; }

/* ✅ Senior — set once, inherit */
body { font-family: 'Outfit', ...; }
```

### Display text gets tight tracking

```css
.hero-title {
  font-size: clamp(2.5rem, 6vw, 4rem);
  letter-spacing: -1px;   /* tighter at large sizes */
}
```

---

## 📡 Meta tags & SEO

### The non-negotiable five

```html
<meta charset="UTF-8" />
<meta name="viewport" content="width=device-width, initial-scale=1.0" />
<title>Name — Role</title>
<meta name="description" content="..." />
<link rel="icon" href="/favicon.svg" />
```

### Open Graph + Twitter for social shares

```html
<meta property="og:title" content="..." />
<meta property="og:description" content="..." />
<meta property="og:image" content="/og-image.png" />   <!-- 1200×630 -->

<meta name="twitter:card" content="summary_large_image" />
<meta name="twitter:image" content="/og-image.png" />
```
**Mental image:** *"The OG image is what shows up on LinkedIn. Bigger lever than your hero photo."*

### `theme-color` colors mobile URL bar

```html
<meta name="theme-color" content="#121e27" />
```

### Title format: `Name — Role` (em-dash, not hyphen)

Em-dash `—` is a semantic separator. Hyphen `-` is for compound words.

---

## ⚡ Performance

### Self-host fonts via `@fontsource`, not Google CDN

```js
// ❌ Google Fonts CDN — privacy + latency hit
@import url('https://fonts.googleapis.com/...');

// ✅ Self-hosted, only the weights you need
import '@fontsource/outfit/400.css'
import '@fontsource/outfit/700.css'
```

### SVG icons beat PNG icons

- One file, every resolution
- Smaller (for simple shapes)
- Color-controllable via `fill`
- Always include `viewBox` and `xmlns`

```svg
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64">
  <text x="32" y="44" text-anchor="middle">KA</text>
</svg>
```
**SVG gotcha:** `text` `y` attribute is the **baseline**, not the top. For 32px text on a 64px canvas, baseline ~44 looks visually centered.

### Don't ship dead code

- Unused files → delete
- Imports for libraries you no longer use → remove from package.json
- `useEffect` that initializes a library never applied → remove

---

## 🎯 UX & visual design

### One primary CTA per viewport

Two equally-styled buttons split attention. The user freezes and clicks neither.

```jsx
<button className="primary">Get in touch</button>
<a className="secondary">View projects →</a>
```
**Mental image:** *Primary = solid color block. Secondary = text with arrow. Eye lands on primary first.*

### Don't animate identity

Recruiters spend ~6 seconds on first screen. Make the name **instantly readable**. Animate the supporting line, not the headline.

```jsx
<h1>Khalil Amrani.</h1>                          {/* static */}
<h2>Software engineer — <span ref={typed} /></h2> {/* animated */}
```

### Photo on a portfolio matters

Humans hire humans. A hero with no face has half the connective tissue of one with a face. Even a generic illustration is better than empty space.

---

## 🧹 Code hygiene

### Don't ship template data

If your `history.json` contains "Google, Microsoft, Netflix" copied from a tutorial, recruiters see one of two things:
1. They believe you → check LinkedIn → reject for dishonesty
2. They recognize the tutorial → reject for not customizing

**Rule:** Replace tutorial seeds with reality, OR remove the section.

### File-surface vs file-size for rewrites

> *If fixing a file requires touching most of it, rewrite the whole file. Piecemeal edits to mostly-broken code are slower than starting clean.*

### Delete dead code aggressively

Git remembers. Don't comment out — delete. Don't `// kept just in case` — delete.

### "If I delete this, does the user see anything different?"

Apply to every line, every file, every dependency. If the answer is "no," it can probably go.

---

## 🌐 More CSS layout — added in §4

### Self-responsive grid (no media queries)

```css
.skills {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(140px, 1fr));
    gap: 12px;
}
```
**Translated:** Make columns at least 140px wide, pack as many as fit, share extra space equally.
- 1200px screen → ~8 columns
- 768px screen → ~5 columns
- 320px screen → 2 columns

**Zero `@media` rules for column counts.**
**Mental image:** *Junior writes 4 media queries to set columns. Senior writes one grid line.*

#### `auto-fit` vs `auto-fill`

- **`auto-fill`** — fills the row with empty tracks if there aren't enough items. Use when item count varies (e.g., a skill grid).
- **`auto-fit`** — collapses empty tracks; existing items stretch. Use when item count is fixed (e.g., 3 highlight tiles).

### Alternating layout via `:nth-child(even)`

```css
.project { grid-template-columns: 1fr 1.2fr; }

.project:nth-child(even) {
    grid-template-columns: 1.2fr 1fr;
}

.project:nth-child(even) .text { order: 2; }
```
Project 1 = text left, image right. Project 2 = flipped. Project 3 = original. **No JS, no duplicated markup, no class-name juggling.** Native browser pattern.

### CSS custom property passed from JS

```jsx
// In React
<li style={{ '--skill-color': '#F7DF1E' }}>
  <Icon />
</li>
```
```css
/* In CSS module */
.skill:hover { border-color: var(--skill-color); }
.skill .icon { color: var(--skill-color); }
```
**Why this beats inline styles everywhere:** Component CSS stays in the CSS file. Only the *dynamic value* bridges from JS. Multiple selectors can use the same custom property.

### Descendant hover — one trigger, multiple coordinated reactions

```css
.project:hover .imageWraper img {
    transform: scale(1.04);
}
```
Hovering anywhere on `.project` scales a nested `<img>`. **No JS needed.**

### `::after` for branded section underlines

```css
.title {
    position: relative;
    display: inline-block;
    padding-bottom: 10px;
}

.title::after {
    content: '';
    position: absolute;
    left: 0;
    bottom: 0;
    width: 60px;
    height: 4px;
    background-color: #ed6955;
}
```
**Why not `border-bottom`?** Border spans the entire text width. The `::after` lets you make a *short, branded* accent bar.
**Mental image:** *"Headings get a little orange flag underneath, not a full underline."*

---

## ⚛️ More React — added in §4

### Conditional prop spreading

```jsx
<a
  href={href}
  {...(isExternal(href) && {
    target: '_blank',
    rel: 'noopener noreferrer',
  })}
/>
```
**What this does:** If the condition is true, spread the prop object. If false, spread nothing (`&&` short-circuits to `false`, which spreads to no-op in React).

**Use when:** A group of props should be applied conditionally as a set. Cleaner than 3 separate ternaries.

### Single-source array + map for repeated structures

```jsx
const NAV_LINKS = [
  { href: '/#about', label: 'About' },
  { href: '/#experience', label: 'Experience' },
  ...
]

return (
  <ul>{NAV_LINKS.map(({ href, label }) => (
    <li key={href}><a href={href}>{label}</a></li>
  ))}</ul>
)
```
**Why:** Adding/removing a link is one array edit. Reordering is array reorder. **No copy-pasted JSX.**

---

## 🎯 Section color rhythm

A multi-section page needs visual rhythm. **Don't put two same-color sections next to each other** — the seam vanishes and the page feels endless.

```
Hero      →  dark navy   (#121e27)
About     →  off-white   (#fafafa)
Experience→  white       (#fff)
Projects  →  off-white   (#fafafa)
Contact   →  dark navy   (#121e27)
```

Pattern: **dark → light → light → light → dark.** Bookended by dark sections, alternating intensities in the middle. The visitor's eye gets natural pause points.

---

## 🚀 Senior reflexes summary card

When you sit down to write code, run this mental checklist:

1. ☐ Am I shadowing any outer name?
2. ☐ Are my React keys stable (slug/id), not indexes?
3. ☐ Does my state update depend on previous state? Use functional form.
4. ☐ Is this `<a target="_blank">`? Add `rel="noopener noreferrer"`.
5. ☐ Is this icon-only? Add `aria-label`.
6. ☐ Is this image decorative or meaningful? Match alt.
7. ☐ Am I about to repeat a font-family / color / spacing? Use a token / cascade.
8. ☐ Is there dead code I can delete right now?
9. ☐ Will this work on mobile? (viewport meta, breakpoints, touch targets)
10. ☐ One source of truth?

Pin this list. Read it before every PR.
