# §6 — Code Hygiene

The section that doesn't ship features but separates "works in dev" from "ships in prod." Below: the cleanup patterns that distinguish a portfolio that compiles from one that's *clean*.

---

## 1. Audit your `package.json` ruthlessly

### The reflex

Every dep in `package.json` is:
- A line in your bundle (even if unused, ESM dead-code elimination isn't always perfect)
- A version you have to keep up-to-date
- A potential security vulnerability
- A signal to reviewers about your taste

### What we removed and why

```jsonc
// ❌ Before
{
  "dependencies": {
    "@fontsource/outfit": "^5.0.13",
    "@fontsource/roboto": "^5.0.13",   // ← never imported
    "aos": "^2.3.4",                   // ← never applied (no data-aos attrs)
    "styled-components": "^6.1.13",    // ← only used by Sparkle1, now deleted
    ...
  }
}

// ✅ After — three deps gone
```

### How to find unused deps

```bash
# Grep for the imports
rg "from 'aos'" src/
rg "@fontsource/roboto" src/
rg "styled-components" src/
```

If zero results → `npm uninstall <pkg>` or delete from package.json + reinstall.

**Or use a tool:**

```bash
npx depcheck         # scans for unused deps
npx knip             # more thorough — finds unused files, exports, deps
```

> *Senior workflow: run `depcheck` before any major release. Bloat compounds silently.*

### The cost of an unused dep (real numbers)

| Dep | Install size | Bundle impact if accidentally imported |
|---|---|---|
| `aos` | ~50KB on disk | ~25KB to user |
| `@fontsource/roboto` | ~700KB on disk | depends |
| `styled-components` | ~200KB on disk | ~12KB to user when imported |

Multiply by your real-world dep list. Easy 50-200KB savings on a clean audit.

---

## 2. `null` vs empty string for missing data

### The pattern

```jsonc
// ❌ Junior — ambiguous: was "" intentional, or unset?
{ "slug": "Project2", "detail": "" }

// ✅ Senior — null is explicit "no data"
{ "slug": "Project2", "detail": null }
```

### Mental model

> *Empty string means "I set this to be empty on purpose." `null` means "this doesn't exist." `undefined` means "this was never set." Pick the right one for your intent.*

### Truthy check works for all three

```jsx
{project.detail && <DetailLink />}
// Renders nothing for ""  (falsy)
// Renders nothing for null (falsy)
// Renders nothing for undefined (falsy)
```

So at the *consumer* side, the check is the same. The *storage* side should reflect intent.

---

## 3. The `typeof null === 'object'` JS gotcha

### The bug

```js
typeof null                // 'object'  (!)
typeof undefined           // 'undefined'
typeof []                  // 'object'
typeof {}                  // 'object'
typeof function(){}        // 'function'
typeof Symbol()            // 'symbol'
```

`typeof null === 'object'` is a historical bug from JavaScript's 1995 implementation. Now baked into the spec because too much code depends on it.

### The trap

```js
function isObject(value) {
  return typeof value === 'object'   // ❌ true for null
}
```

### The fix

```js
function isObject(value) {
  return value !== null && typeof value === 'object'
}

// Even shorter for our case:
if (project.detail) { ... }   // null, undefined, "" all falsy → safe
```

### Other JS coercion landmines to memorize

```js
NaN === NaN                // false (!) — use Number.isNaN()
0 == false                 // true (loose ==)
'' == false                // true
0 == ''                    // true
[] == false                // true
typeof NaN                 // 'number' (!)
[] + []                    // ''
[] + {}                    // '[object Object]'
{} + []                    // 0  (!)  — but only at REPL parsing top-level
```

**Senior rule:** always use `===`/`!==`. Never use `==`/`!=`. The coercion table is a minefield.

---

## 4. Configure ESLint properly

### What we set up

```js
// .eslintrc.cjs
module.exports = {
  root: true,
  env: { browser: true, es2020: true, node: true },
  extends: [
    'eslint:recommended',
    'plugin:react/recommended',
    'plugin:react/jsx-runtime',           // suppresses 'React must be in scope' for Vite
    'plugin:react-hooks/recommended',     // catches rule-of-hooks violations
  ],
  ignorePatterns: ['dist', '.eslintrc.cjs', 'node_modules'],
  parserOptions: { ecmaVersion: 'latest', sourceType: 'module' },
  settings: { react: { version: '18.2' } },
  plugins: ['react-refresh'],
  rules: {
    'react/prop-types': 'off',
    'react-refresh/only-export-components': ['warn', { allowConstantExport: true }],
    'no-unused-vars': ['warn', { argsIgnorePattern: '^_' }],
  },
}
```

### Field-by-field

| Field | Meaning |
|---|---|
| `root: true` | Stop ESLint from looking further up the file tree for more configs |
| `env` | Predefined globals — `browser` allows `window`, `document`; `node` allows `module`, `process` |
| `extends` | Inherits rule sets from these configs |
| `ignorePatterns` | Files ESLint will not lint |
| `parserOptions` | Tells ESLint we use modern ES modules |
| `settings.react.version` | Lets the React plugin know which version to lint against |
| `plugins` | Adds custom rule packages |
| `rules` | Overrides specific rules |

### Key rules we customized

```js
'react/prop-types': 'off'
```
We don't use PropTypes (TypeScript would replace them properly). Don't lint for them.

```js
'no-unused-vars': ['warn', { argsIgnorePattern: '^_' }]
```
Unused vars become warnings (not errors), AND function args prefixed with `_` are ignored. So:

```js
// ❌ Warning — unused
function handler(event, index) {
  return event.target.value
}

// ✅ No warning — intentional unused
function handler(event, _index) {
  return event.target.value
}
```

### Adding rules later

```js
rules: {
  'no-console': ['warn', { allow: ['warn', 'error'] }],   // warn on console.log
  'prefer-const': 'error',                                 // require const for unchanged vars
  'no-var': 'error',                                       // forbid var
  'eqeqeq': ['error', 'always'],                          // require ===, never ==
}
```

---

## 5. Consistent JSON shape

### What we changed

```jsonc
// ❌ Inconsistent across entries
{
  "slug": "Project1",
  "skills": ["React", "Express", "NodeJs","Javascript","python"]
  // mixed: PascalCase, lowercase, camelCase
}

// ✅ Normalized
{
  "slug": "Project1",
  "skills": ["React", "Express", "Node.js", "JavaScript", "Python"]
  // all proper nouns
}
```

### Field order across array entries

```jsonc
// ❌ Order varies per entry
{ "slug": "...", "skills": [], "website": "...", "title": "..." }
{ "title": "...", "slug": "...", "website": "...", "skills": [] }

// ✅ Consistent order — easy to scan and add new entries
{ "slug": "...", "title": "...", "skills": [], "website": "..." }
{ "slug": "...", "title": "...", "skills": [], "website": "..." }
```

### Whitespace in user-facing strings

```jsonc
// ❌ Leading space (renders in UI)
{ "description": " Developed a car management platform..." }

// ✅ Clean
{ "description": "Developed a car management platform..." }
```

Easy to miss in code review. Trim your strings.

---

## 6. Why I deferred the folder rename

### The proposed change

```
src/component/   →  src/components/   (singular → plural)
src/component/Hero/   →   src/components/hero/   (PascalCase → kebab)
src/component/about/  →   src/components/about/  (already lowercase)
```

### Why it didn't happen

| Factor | Verdict |
|---|---|
| Aesthetic benefit | Moderate — consistency matters but isn't visible to recruiters |
| Blast radius | ~12 files have imports that would need updating |
| Risk of breakage | High — one missed import = silent build failure |
| Time cost | 20-30 min including testing |
| Comparison to remaining work | §8 design tokens has bigger learning payoff per minute |

### Senior decision framework

> *Refactor when:*
> - *The current state is causing bugs*
> - *The current state is blocking new work*
> - *Tooling can automate the change safely*
>
> *Defer when:*
> - *The aesthetic gain is small*
> - *The change touches many files*
> - *There's higher-value work pending*

Pin this framework. Senior code review is full of "should we?" questions — these criteria settle most of them.

### When to come back to the rename

When you next have a quiet week or pair-programming session. Use a script to do the renames + import updates in one transaction, run the build to verify, commit as one change. Don't piecemeal it.

---

## 7. Deleting dead code — the senior reflex

### What we deleted in this section

| File | Reason |
|---|---|
| `src/component/Sparkle1.jsx` | No longer imported anywhere (Detail.jsx dropped its use) |
| `src/data/skill.json` | Replaced by in-component `SKILLS` array (icons + colors live with component) |
| `aos`, `@fontsource/roboto`, `styled-components` | Unused deps |

### The questions to ask

Before deleting, ask:
1. **Is it imported anywhere?** `rg "filename"` → no results = safe to delete
2. **Is it referenced by config?** Check `vite.config`, `package.json`, ESLint configs
3. **Is it in a route's element?** Check `App.jsx`
4. **Is it documented somewhere as future-use?** Search for filename in `*.md`

If all four are no → delete with confidence.

### Why "I'll keep it just in case" is wrong

- Git is your archive. You can resurrect from any commit.
- Dead code costs every future reader 5-30s of "is this active?"
- Compounds: 10 dead files = 50-300s of confusion per visitor
- Encourages copy-paste programming ("I saw this in Sparkle1, let me reuse it") → introduces bugs

---

## 8. The §6 reflex card

Before merging any PR:

1. ☐ Did I add a new dep? Is it actually used?
2. ☐ Are there dead files (`rg <filename>` returns nothing)?
3. ☐ Are there stale imports (eslint will flag with `no-unused-vars`)?
4. ☐ Are my JSON fields in consistent order across entries?
5. ☐ Are user-facing strings trimmed (no leading/trailing whitespace)?
6. ☐ Did I introduce `==` or `!=` anywhere? Replace with `===`/`!==`.
7. ☐ Did I check for `null`/`undefined` separately, or treat them together as falsy?
8. ☐ If I'm proposing a rename, is the blast radius worth the benefit?

Run `npm run lint` if it's configured. Most of the above ESLint catches automatically.

---

## 9. Deferred / future cleanups

- Rename `src/component/` → `src/components/` (plural) — when you have a quiet hour
- Standardize folder casing — all lowercase: `hero/`, `navbar/`, `experience/`
- Run `npm audit fix` cautiously — 15 transitive vulnerabilities exist; fixes may break things
- Consider adding `prettier` for auto-formatting + `husky` for pre-commit linting
- Migrate to TypeScript when the project grows — at this size, it's optional
