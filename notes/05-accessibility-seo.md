# §5 — Accessibility & SEO

The section that turns a portfolio from "looks nice" into "works for everyone and gets found on Google." Below: every concept we applied, with the mental model, examples, and gotchas to memorize.

---

## 1. Skip-to-content link

### The pattern

```jsx
// At the top of every layout, BEFORE the navbar
<a href="#main" className="skip-link">Skip to main content</a>

// Wrap your page body
<main id="main">
  ...page content...
</main>
```

```css
.skip-link {
  position: absolute;
  top: -100px;
  left: 16px;
  z-index: 100;
  /* ... visible styles ... */
  transition: top 0.2s ease;
}

.skip-link:focus {
  top: 16px;
  outline: 3px solid #fff;
  outline-offset: 2px;
}
```

### Mental model

> *A keyboard user lands on your page and hits Tab. **The first focusable element must be a "Skip to main content" link.** It slides into view, they hit Enter, they jump straight past your navbar.*

### Gotcha #1: don't use `display: none`

```css
/* ❌ WRONG — removes from accessibility tree, defeats the purpose */
.skip-link { display: none; }
.skip-link:focus { display: block; }

/* ✅ RIGHT — visually hidden but discoverable */
.skip-link { position: absolute; top: -100px; }
.skip-link:focus { top: 16px; }
```

### Gotcha #2: the target must be focusable or have `tabindex="-1"`

If the target `<main>` is a static container, the focus jumps there but doesn't *visibly* move. For predictable screen-reader behavior, add `tabindex="-1"` to make `<main>` programmatically focusable:

```jsx
<main id="main" tabIndex={-1}>...</main>
```

> *Optional but pro-level. We didn't add it here because `<main>` is implicitly understood by modern screen readers.*

---

## 2. `:focus-visible` vs `:focus`

### The pattern

```css
:focus { outline: none; }

:focus-visible {
  outline: 3px solid #ed6955;
  outline-offset: 3px;
  border-radius: 4px;
}
```

### Mental model

> Browsers detect whether focus came from **mouse click** or **keyboard tab**.
> - Mouse user → `:focus` fires (we hide the ring)
> - Keyboard user → `:focus-visible` fires (we show the ring)

### Why this matters

| Approach | Mouse UX | Keyboard UX | Verdict |
|---|---|---|---|
| Default browser outline | Ugly rings on every click | Visible focus | Works but ugly |
| `:focus { outline: none }` | Clean | **Breaks keyboard nav** | ❌ A11y violation |
| `:focus-visible` only | Clean | Visible focus | ✅ Senior solution |

### Gotcha: browser support

`:focus-visible` is supported in all modern browsers (Chrome 86+, Firefox 85+, Safari 15.4+). Older browsers fall back to `:focus`, which we set to `outline: none` — so they get no ring. For 99% of users in 2025, this is fine. If you ever target legacy browsers, use a `:focus:not(:focus-visible)` selector to scope the no-outline rule:

```css
/* Defensive — covers browsers without :focus-visible support */
:focus { outline: 3px solid #ed6955; }
:focus:not(:focus-visible) { outline: none; }
:focus-visible { outline: 3px solid #ed6955; }
```

---

## 3. `prefers-reduced-motion` — respect user motion preferences

### The pattern

```css
@media (prefers-reduced-motion: reduce) {
  *, *::before, *::after {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important;
    scroll-behavior: auto !important;
  }
}
```

### Mental model

> *Some users have vestibular disorders. Animation literally makes them dizzy or nauseous. Their OS exposes a "reduce motion" setting. Senior code respects it.*

### Why `0.01ms` instead of `0`

If you set `animation-duration: 0`, animations don't fire `animationend` events. Code listening for that event breaks. `0.01ms` is imperceptible to humans but fires events normally.

### What's NOT in the reduce-motion fix

Some things shouldn't even be globally killed — e.g., a critical loading spinner. If you have animations that *must* run even with reduce-motion on (rare), give them their own opt-in class.

```css
@media (prefers-reduced-motion: reduce) {
  .loader-spinner { /* still spin */ }
}
```

---

## 4. Semantic HTML — `<main>`, `<article>`, `<nav>`, `<footer>`

### What we did

```jsx
<>
  <Navbar />                    {/* <nav> internally */}
  <main id="main">
    <Hero />
    <About1 />
    <Experience />
    <Projects />
    <Contact />
  </main>
</>
```

For the Detail page:

```jsx
<main id="main">
  <article className={styles.wraper}>
    <h1>{title}</h1>
    ...case study content...
  </article>
  <Contact />
</main>
```

### Mental model

| Tag | Use for | Allowed per page |
|---|---|---|
| `<main>` | The one block of content unique to this page | **One** |
| `<header>` | Page or section header | One per `<section>`/`<article>` |
| `<footer>` | Page or section footer | One per `<section>`/`<article>` |
| `<nav>` | Major navigation block | Can be multiple |
| `<article>` | Self-contained composition (blog post, project case study) | Multiple |
| `<section>` | Thematic grouping with a heading | Multiple |
| `<aside>` | Sidebar, callout, related content | Multiple |

### Why this matters

- Screen readers announce landmarks (`<main>`, `<nav>`) and let users jump between them
- Search engines weight `<main>` content higher than navigation/footer
- Browser "reader mode" extracts `<main>` and `<article>` text

### Junior trap

```jsx
{/* ❌ Junior — div soup */}
<div className="page">
  <div className="header">...</div>
  <div className="content">...</div>
  <div className="footer">...</div>
</div>

{/* ✅ Senior — semantic */}
<>
  <header>...</header>
  <main>...</main>
  <footer>...</footer>
</>
```

> *`<div>` and `<span>` should be your last choice, not your first. Reach for the semantic tag first; fall back to `<div>` only when nothing fits.*

---

## 5. Heading hierarchy

### The rule

```
h1   - Page title (ONE per page)
  h2 - Major section
    h3 - Subsection
      h4 - Smaller grouping
```

### What we did

```jsx
// Portfolio route (/)
<Hero>
  <h1>Khalil Amrani.</h1>      {/* The one h1 */}
</Hero>
<About1>
  <h2>About me</h2>             {/* Section heading */}
  <h3>Education</h3>            {/* Sub-grouping */}
</About1>
<Experience>
  <h2>Experience</h2>
  <h3>What I work with</h3>
</Experience>

// Detail route (/:slug)
<h1>{project.title}</h1>        {/* Different page, different h1 */}
<h2>Project purpose and goal</h2>
```

### Junior trap

Choosing heading level based on **visual size** rather than **semantic hierarchy**:

```jsx
{/* ❌ Junior — uses h3 because it should look smaller */}
<h3>About me</h3>

{/* ✅ Senior — uses h2 (semantic level), styles separately */}
<h2 className={styles.compactTitle}>About me</h2>
```

**Rule:** Use the right heading level for hierarchy. Use CSS to control size. **Never skip levels** (h2 → h4 with no h3).

---

## 6. Image attributes — the senior checklist

### The full set

```jsx
<img
  src={imageUrl}
  alt="Descriptive text or empty"
  width="320"
  height="400"
  loading="eager"      {/* or "lazy" */}
  decoding="async"
/>
```

### What each attribute does

| Attribute | Required? | Why |
|---|---|---|
| `src` | Yes | The image |
| `alt` | Yes | Screen-reader text. Empty `alt=""` for decorative. **Missing alt = a11y violation** |
| `width`/`height` | Strongly recommended | Browser reserves space BEFORE the image loads → no CLS |
| `loading="lazy"` | For below-fold images | Defers download until near viewport |
| `loading="eager"` | For above-fold (hero) | Loads immediately. Hero image should never lazy-load |
| `decoding="async"` | For below-fold | Decodes off the main thread |

### When to use `width`/`height` vs `aspect-ratio`

```jsx
{/* Fixed size known? Use width/height attrs */}
<img src="..." width="320" height="400" alt="..." />

{/* Variable size, container determines? Use aspect-ratio on wrapper */}
<div style={{ aspectRatio: '16 / 10' }}>
  <img src="..." alt="..." style={{ width: '100%', height: '100%' }} />
</div>
```

Both reserve space pre-load. Both prevent CLS. **Always do one or the other for images.**

### `alt` text — what to write

| Image | Bad alt | Good alt |
|---|---|---|
| Hero photo of you | `alt="image"` | `alt="Khalil Amrani"` |
| Decorative cloud SVG | (missing) | `alt=""` (decorative) |
| Project screenshot | `alt="screenshot"` | `alt="Car management dashboard screenshot"` |
| Logo of company you worked at | `alt="logo"` | `alt="Google logo"` |
| Icon next to text already saying "GitHub" | `alt="GitHub icon"` | `alt=""` (text already conveys it) |

> **Rule:** If a sighted user wouldn't lose information when the image fails, set `alt=""`. If they would, describe what they'd be missing.

---

## 7. ARIA — `aria-label`, `aria-expanded`, `aria-controls`

### Icon-only buttons/links

```jsx
{/* ❌ Junior — screen reader announces just "link" */}
<a href="https://github.com/...">
  <img src="github-icon.png" alt="" />
</a>

{/* ✅ Senior — gives the link a name */}
<a
  href="https://github.com/..."
  aria-label="GitHub profile"
  style={{ backgroundImage: 'url(github-icon.png)' }}
/>
```

### Disclosure (collapsible) pattern — like a menu

```jsx
<button
  type="button"
  onClick={toggle}
  aria-label={menuOpen ? 'Close menu' : 'Open menu'}
  aria-expanded={menuOpen}
  aria-controls="primary-nav"
>
  {menuOpen ? <CloseIcon /> : <MenuIcon />}
</button>

<ul id="primary-nav" hidden={!menuOpen}>...</ul>
```

| ARIA attr | Says to screen reader |
|---|---|
| `aria-label="Open menu"` | "Open menu, button" |
| `aria-expanded={true}` | "expanded" |
| `aria-expanded={false}` | "collapsed" |
| `aria-controls="primary-nav"` | "controls primary-nav" (lets jump-to-controlled-element work) |

### When to use ARIA — and when not to

> **First rule of ARIA: don't use ARIA.** If a native element does the job (`<button>`, `<a>`, `<label>`), use that. ARIA is for closing gaps semantic HTML can't.

| You'd use ARIA | If you can't avoid it |
|---|---|
| `<div onClick>` — needs `role="button"`, `tabindex`, ARIA states | Just use `<button>` |
| Custom dropdown with `<div>` markup | Implement full ARIA combobox spec OR use a library |
| Icon-only button | `aria-label` is necessary — icons have no inherent text |

---

## 8. `aspect-ratio` for CLS prevention

### The modern way

```css
.image-wrapper {
  aspect-ratio: 16 / 10;
  /* or: aspect-ratio: 1.6; */
  width: 100%;
}
```

### What CLS is

> **Cumulative Layout Shift** — Google's metric for "elements jumping around as the page loads." Bad for UX and SEO. Caused by images, fonts, embeds loading after the rest of the page.

### Why aspect-ratio fixes it

Before `aspect-ratio` (browser support 2021+), we used the "padding-bottom hack":

```css
/* ❌ The OLD way (still works, but archaic) */
.wrapper {
  position: relative;
  padding-bottom: 56.25%;  /* 16:9 = 9/16 = 0.5625 */
}
.wrapper img {
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
}
```

Now:

```css
/* ✅ The NEW way */
.wrapper { aspect-ratio: 16 / 9; }
```

One line, no positioning gymnastics.

### Common aspect ratios to memorize

| Ratio | Use for |
|---|---|
| `16 / 9` | Video, hero banners |
| `4 / 3` | Older photos, screenshots |
| `1 / 1` | Avatars, square cards |
| `3 / 2` | DSLR photos |
| `21 / 9` | Cinematic banners |

---

## 9. `object-fit` — `cover` vs `contain`

### The difference

```css
.wrapper {
  aspect-ratio: 16 / 10;
  width: 100%;
}

.image-cover img {
  object-fit: cover;     /* fill box, crop overflow */
}

.image-contain img {
  object-fit: contain;   /* fit inside box, letterbox empty space */
}
```

### Mental model

> The box is a window frame. The image is a photo.
> - **`cover`** — blow up the photo until it fills the frame, even if edges get cropped
> - **`contain`** — shrink the photo to fit inside the frame, leaving empty space around it

### When to use each

| `cover` | `contain` |
|---|---|
| Hero banners (subject is centered) | Screenshots (UI chrome matters) |
| Product photos (background can be cropped) | Logos (whole shape must show) |
| Avatars (face is centered, anyway) | Diagrams |
| Profile photos with safe crop zone | Anything with text or edges that matter |

### The bug we just fixed

```css
/* ❌ Cars + chess screenshots were getting zoomed/cropped */
.imageWraper img { object-fit: cover; }

/* ✅ Now they show in full, letterboxed by background color */
.imageWraper img {
  object-fit: contain;
  max-width: 100%;
  max-height: 100%;
}
```

---

## 10. `robots.txt`

### Minimal valid

```
User-agent: *
Allow: /
```

### With a sitemap (when you have one)

```
User-agent: *
Allow: /

Sitemap: https://yourdomain.com/sitemap.xml
```

### Blocking specific paths

```
User-agent: *
Disallow: /admin/
Disallow: /api/
```

> **Senior caveat:** `robots.txt` is a *suggestion*, not enforcement. Well-behaved crawlers (Google, Bing) respect it. Malicious bots ignore it. Don't put security-sensitive paths in there — by listing them, you've told attackers where to look.

---

## 11. Cheat sheet — the §5 reflex card

Before any PR ships, run this list:

1. ☐ Is there a skip-to-content link?
2. ☐ Is the main content wrapped in `<main id="main">`?
3. ☐ Is there exactly **one** `<h1>` per page?
4. ☐ Do headings follow hierarchy (no skipped levels)?
5. ☐ Does every `<img>` have `alt`? Decorative ones get `alt=""`.
6. ☐ Does every interactive icon-only element have `aria-label`?
7. ☐ Are images using `width`/`height` or wrapper `aspect-ratio`?
8. ☐ Are below-fold images `loading="lazy"`?
9. ☐ Is `:focus-visible` styled? `:focus` set to `outline: none`?
10. ☐ Does the page respect `prefers-reduced-motion`?
11. ☐ Is there a `robots.txt`?
12. ☐ Are external links `target="_blank" rel="noopener noreferrer"`?

If all 12 are ✅, your Lighthouse Accessibility + SEO scores will hit 95+.

---

## What a Lighthouse audit will catch if you skip any

| Skipped item | Lighthouse penalty |
|---|---|
| No alt text | "Image elements do not have [alt] attributes" |
| Multiple h1 | "Heading elements are not in a sequentially-descending order" |
| Missing meta description | "Document does not have a meta description" |
| Outline removed from focus | "Some interactive elements have a focus indicator that doesn't have sufficient contrast" |
| No `width`/`height` on img | "Image elements do not have explicit `width` and `height`" |
| `target="_blank"` without `rel` | "Links to cross-origin destinations are unsafe" |

Memorize these — they're the same items 90% of portfolio audits flag.
