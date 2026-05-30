# §7 — Asset URL Correctness

The invisible bug. Worked in dev, broke in prod. Below: how Vite handles assets, what we changed, and how to never get caught again.

---

## 1. The bug we just fixed

### The original code (broken)

```js
// src/util.js
export const getImageUrl = (path) => {
  return new URL(`/assets/${path}`, import.meta.url).href
}
```

### What it does in dev (works by accident)

`import.meta.url` in dev = `http://localhost:5173/src/util.js`
Resolving `/assets/hero/02.jpg` against that URL → `http://localhost:5173/assets/hero/02.jpg`
Vite serves `/assets/` from disk in dev — found ✅

### What it does in production (broken)

After `vite build`, the file becomes `dist/assets/index-Bn1GX7gD.js`
`import.meta.url` = `https://yoursite.com/assets/index-Bn1GX7gD.js`
Resolving `/assets/hero/02.jpg` against that URL → `https://yoursite.com/assets/hero/02.jpg` (because absolute paths ignore the base)

This *actually works* IF `assets/` is copied to `dist/`. **But Vite doesn't copy `src/assets/`.** Only `public/` is copied as-is to `dist/`. So in prod, all images 404.

**This is the kind of bug that ships and breaks the site silently** — works locally, breaks live.

---

## 2. Vite's two correct patterns for assets

### Pattern A: `public/` directory

Files in `public/` are copied to `dist/` **as-is, with no processing**.

```
public/
├── robots.txt          → /robots.txt
├── favicon.svg         → /favicon.svg
└── assets/
    └── hero/02.jpg     → /assets/hero/02.jpg
```

**Reference in code:**

```jsx
<img src="/assets/hero/02.jpg" />          // plain string path
<img src={`/assets/${filename}`} />        // template literal
```

**Pros:**
- Simple, plain string paths
- Works for runtime-dynamic paths (filename from JSON)
- No bundler involvement

**Cons:**
- No optimization (no hashing for cache-busting, no compression)
- Filename in URL = full URL changes break

**When to use:**
- Many images with paths built from data (your case)
- Large files (videos, big images)
- Files that need to be referenced by an exact known URL

### Pattern B: explicit `import`

```jsx
import heroImage from '../assets/hero/02.jpg'

<img src={heroImage} />
```

**What Vite does:**
- Hashes the filename → `hero-02-DkM653hc.jpg`
- Optimizes if possible (small images get inlined as data URIs)
- Returns the hashed URL string
- Includes the file in the build output

**Pros:**
- Cache-busted URLs (filename hash changes when content changes)
- Build optimization (tree-shaking, inlining small assets)
- Compile-time error if file doesn't exist

**Cons:**
- One `import` per file
- Doesn't work for runtime-dynamic paths

**When to use:**
- Fixed asset references (logos, icons used in code)
- Critical assets that benefit from cache-busting

### The wrong pattern we had

```js
// ❌ Don't do this
return new URL(`/assets/${path}`, import.meta.url).href
```

`new URL(specifier, baseUrl)` does work for *relative* paths to bundled assets:

```js
// ✅ This actually works in Vite
new URL('./hero.jpg', import.meta.url).href
```

But our absolute `/assets/...` form was neither bundled nor public — falling through both systems.

---

## 3. The fix we applied

```js
// src/util.js — after
export const getImageUrl = (path) => `/assets/${path}`
```

**One line.** Returns a plain string. Vite copies `public/assets/` to `dist/assets/`. URLs resolve correctly in dev AND prod.

### Why keep the function at all?

Could we just write `'/assets/hero/02.jpg'` everywhere? Yes. But the function:

1. **Single point of change.** If we ever move the assets root, edit one function.
2. **Documents intent.** `getImageUrl('hero/02.jpg')` reads as "give me the URL for this image" — clearer than seeing a raw path inline.
3. **Zero runtime cost.** It's a function call returning a template literal. Inlining never matters.

> **Senior principle:** *Keep tiny utility functions when they centralize a future change point.* Drop them when they're literally a one-line passthrough with no reason to exist.

---

## 4. Why moving `assets/` to `public/` shrunk the bundle

### Before

The `new URL(..., import.meta.url)` pattern made Vite *try* to bundle assets it could detect. Some images got pulled into the dependency graph, hashed, and emitted to `dist/assets/`. Big PNGs (visa.jpg 839KB, cars.png 800KB) were ending up in the build output even though they were rarely loaded.

### After

`public/` files don't go through the bundler at all. They're copied straight from `public/` to `dist/`. The JS bundle no longer needs to know about them. Less work for Vite, smaller JS bundle.

### Measured impact

| Metric | Before | After | Delta |
|---|---|---|---|
| JS bundle (raw) | 348.50 KB | 316.75 KB | **-32 KB** |
| JS bundle (gzip) | 127.70 KB | 105.37 KB | **-22 KB** |
| CSS bundle | 15.66 KB | 15.73 KB | ~same |

That 22KB gzip reduction translates to ~150ms faster Time-to-Interactive on a 3G connection.

---

## 5. When NOT to use `public/`

The `public/` directory is the "no bundler magic" escape hatch. Reach for it when you need predictable paths. But know its limits:

| Case | Use `public/`? |
|---|---|
| Project screenshots referenced by JSON filename | ✅ Yes |
| Favicon, robots.txt, social images | ✅ Yes |
| Profile photo used in one specific component | ❌ Prefer `import` (gets hashed) |
| Library SVG icon used in 5 components | ❌ Use `react-icons` instead |
| File that must NEVER be cached (live config) | ✅ With careful HTTP headers |

> **The bigger pattern:** `public/` is for **content-addressed resources** (URLs you might share, files that need predictable paths). `src/assets/` with imports is for **code-addressed resources** (assets that belong with the component using them).

---

## 6. The Vite asset cheat sheet

```
src/
├── assets/                  ← imports go through bundler
│   └── logo.svg             →  import logo from './assets/logo.svg'
│
public/                      ← copied as-is to dist/
└── robots.txt               →  '/robots.txt' (plain string)
└── og-image.png             →  '/og-image.png' (plain string)
```

| Context | Pattern |
|---|---|
| Component imports a specific file | `import X from './path'` — bundler handles it |
| Path built from data (e.g., JSON) | Put in `public/`, use plain string |
| CSS `background-image: url(...)` | `url('/assets/foo.png')` for public; `url('./foo.png')` for sibling files (bundler-handled) |
| Critical asset that must be cached | `import` (gets hashed) |
| Large file Vite shouldn't process | `public/` |

---

## 7. CSS asset references — the same rules

CSS modules can reference assets too. Same rules:

```css
/* If foo.png is in public/assets/ */
.hero { background-image: url('/assets/foo.png'); }

/* If foo.png is a sibling file in src/ */
.hero { background-image: url('./foo.png'); }

/* If foo.png is elsewhere in src/ */
.hero { background-image: url('../../assets/foo.png'); }
```

**Junior trap:** Using absolute paths to `src/`:

```css
/* ❌ Won't work — Vite won't resolve this */
.hero { background-image: url('/src/assets/foo.png'); }
```

`/` in CSS means "from the deployment root" = `public/`.

---

## 8. The §7 reflex card

Before adding any new asset:

1. ☐ Is this asset referenced by a runtime-dynamic path? → `public/`
2. ☐ Is this asset used by exactly one component? → `import` from a sibling
3. ☐ Is this asset huge (>500KB)? → `public/` (avoid bundling)
4. ☐ Am I about to use `new URL(...)` for an asset? → Stop. Use one of the two correct patterns.
5. ☐ Am I using an absolute `/path` in a CSS module? → That refers to `public/`. Confirm intent.

---

## 9. Debugging asset URLs

If an image 404s in production but works in dev:

1. Open DevTools → Network tab → reload
2. Find the broken image request → look at the URL
3. Check `dist/` for the file at that URL path
4. If missing from `dist/`: the asset isn't being bundled OR isn't in `public/`
5. If present in `dist/` but the URL differs: it's been hashed; you need to `import` it to get the hashed URL

### The most common cause: `src="/src/assets/..."`

```jsx
// ❌ References the source path, not the built path
<img src="/src/assets/hero/02.jpg" />

// ✅ Either
<img src="/assets/hero/02.jpg" />          // assets are in public/assets/
<img src={heroImage} />                     // imported, hashed
```

`/src/` is a development-only path. Vite serves it in dev for convenience. In production, `src/` doesn't exist anymore (only `dist/` does).

---

## 10. Performance bonus — preload critical images

For above-the-fold images (hero photo), tell the browser to fetch them earlier:

```html
<head>
  <link rel="preload" as="image" href="/assets/hero/02.jpg" />
</head>
```

Browser starts downloading before the HTML parser even reaches the `<img>` tag. Knocks 100-300ms off LCP on slow connections.

Combine with the `loading="eager"` we added in §5 and you've covered the full above-the-fold image perf playbook.
