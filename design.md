# MERIDIAN — Design System Specification

> **This file is law.** Claude Code must read this file before writing or modifying any UI code, and must not introduce a color, font, radius, shadow, spacing value, or motion curve that is not defined here. If a needed value is missing, stop and ask — do not invent one.

**Product:** Meridian — an on-demand private jet charter booking platform.
**Primary market:** West Africa (Lagos ⇄ Abuja ⇄ Accra ⇄ Port Harcourt) with international long-haul legs.
**Audience:** Executives, government delegations, oil & gas operators, HNW leisure travellers, and their assistants — the assistant books more often than the principal, and books under time pressure.
**Single job of the product:** Turn a trip intention into a signed, paid charter with the fewest possible unanswered questions.

_(Brand name is a placeholder. If it changes, change it in one place — `src/config/brand.ts` — and nowhere else.)_

---

## 0. Table of contents

1. [Design paradigm](#1-design-paradigm)
2. [The signature: the Course Line](#2-the-signature-the-course-line)
3. [Color](#3-color)
4. [Typography](#4-typography)
5. [Spacing, grid & layout](#5-spacing-grid--layout)
6. [Radius, borders, elevation](#6-radius-borders-elevation)
7. [Motion](#7-motion)
8. [Iconography & imagery](#8-iconography--imagery)
9. [Voice & copy rules](#9-voice--copy-rules)
10. [Token implementation (Tailwind v4)](#10-token-implementation-tailwind-v4)
11. [Component specifications](#11-component-specifications)
12. [Form specifications](#12-form-specifications)
13. [Page specifications](#13-page-specifications)
14. [States: loading, empty, error](#14-states-loading-empty-error)
15. [Accessibility floor](#15-accessibility-floor)
16. [Consistency contract — the rules Claude Code must never break](#16-consistency-contract)

---

## 1. Design paradigm

### 1.1 The name of the direction: **Instrument Precision**

Private aviation design has one dominant cliché: black background, gold accent, Didot headline, stock photograph of a jet on a runway at sunset. It reads as a casino, not as an aircraft operator. **We do not build that site.**

The design language here is drawn from the actual working artifacts of aviation — navigation charts, flight progress strips, instrument panels, load sheets, airport signage — rather than from the imagined luxury of the cabin. Aviation's real visual world is **precise, calm, legible under pressure, and colour-coded for meaning rather than for decoration.** That is also, not coincidentally, exactly what a person spending ₦18M on a flight wants to feel: that nothing is improvised.

Luxury here is expressed as **restraint, accuracy, and density of real information** — not as ornament. A tail number, a runway length, an ARGUS rating, and a firm price shown plainly are more premium than any gradient.

### 1.2 The five paradigm rules

**P1 — Light is the default surface; dark is a moment.**
The product runs on a cool, pale, high-altitude haze background. Dark surfaces (`--ink-000`) are reserved for exactly four things: the homepage hero, the quote presentation surface, the confirmed-itinerary header, and the footer. Dark is where the price and the promise live. Long forms are never dark — dark forms are fatiguing and read as gimmick.

**P2 — Information density is a luxury signal, not a liability.**
Show the tail number, the year of refurbishment, the baggage volume in m³, the runway requirement, the operator's certificate. Never hide a spec behind "Learn more" to make a card look tidy. Cards may be dense as long as they are _aligned_ — density plus alignment reads as engineering; density without alignment reads as clutter.

**P3 — Colour is signal, never decoration.**
Every non-neutral colour in the UI must mean something. Cyan means "navigational / interactive / where you are." Magenta means "this is the course — the committed path." Green/amber/red mean availability, pending, and blocked. No colour is ever applied because a section "needed some life."

**P4 — Numbers are typeset, not written.**
Every price, time, weight, distance, duration, tail number, ICAO code, and flight-hour figure is set in the mono face with tabular figures, so columns align down the page and figures never shimmer when they change. This one rule does more for perceived quality than any other.

**P5 — One idea, everywhere.**
The Course Line (§2) appears on every page. It is the only decorative-adjacent element permitted, and it is not decorative — it always encodes an actual route, sequence, or position.

### 1.3 What "consistent across all pages" means operationally

- Every page uses the same page shell, the same header, the same footer, the same max-widths, the same section rhythm (`--space-section`).
- Every page begins with the same **page masthead** block (§11.2). No exceptions, including marketing pages.
- Every interactive surface uses the same focus ring, the same hover delta, the same disabled treatment.
- There is exactly **one** primary button style, **one** card style with four content variants, **one** input style. A "special" button for the homepage is forbidden.
- Marketing pages and application pages share the identical token set. The marketing site is not allowed a different font, palette, or radius. This is the single most common way premium sites fall apart.

---

## 2. The signature: the Course Line

Aviation pilots have a phrase — _"children of the magenta line"_ — for the magenta course line drawn across a navigation display. It is the single most recognisable graphic in modern aviation. It is our signature.

**Definition:** a 1px (1.5px on ≥1280px viewports) magenta stroke, `--course-500` on light surfaces and `--course-400` on dark, that always represents a real route, sequence, or position.

**Its five permitted appearances — no others:**

| #    | Where                   | Form                                                                                                                            |
| ---- | ----------------------- | ------------------------------------------------------------------------------------------------------------------------------- |
| CL-1 | Homepage hero           | A great-circle arc drawn between origin and destination labels. Animates on load (§7.4).                                        |
| CL-2 | Booking wizard          | The horizontal progress track. Steps sit on it as waypoints. Completed segment solid, upcoming segment `--line-200` dashed 2/3. |
| CL-3 | Route display component | The connector between two ICAO codes, with an aircraft glyph at the midpoint (§11.5).                                           |
| CL-4 | Active navigation item  | A 1px underline, 100% of the label width, offset 6px below the baseline box.                                                    |
| CL-5 | Section divider         | A 48px stub — _never full-bleed_ — sitting above a section eyebrow. It reads as one leg of a route, not as an `<hr>`.           |

**Prohibited:** the Course Line may not be used as a border, an underline for body links, a card outline, a loading bar, or an accent on a button. If it does not encode a route, sequence, or position, it does not appear.

---

## 3. Color

### 3.1 Complete palette — these are the only colours in the product

#### Ink (structure and text)

| Token       | Hex       | Use                                                                                           |
| ----------- | --------- | --------------------------------------------------------------------------------------------- |
| `--ink-000` | `#070C14` | Dark surfaces: hero, quote surface, itinerary header, footer. The sky at FL450.               |
| `--ink-900` | `#0E1826` | Elevated card on dark surface.                                                                |
| `--ink-800` | `#16233A` | Border on dark surface; dark surface secondary fill.                                          |
| `--ink-700` | `#1E2C40` | Headings on light. Primary button fill.                                                       |
| `--ink-600` | `#33455E` | Body text on light.                                                                           |
| `--ink-400` | `#64738A` | Secondary / supporting text on light. **Minimum text colour — nothing lighter carries text.** |
| `--ink-200` | `#A7B3C2` | Icon-only, disabled glyphs, decorative rules. Never text.                                     |

#### Haze (surfaces)

| Token        | Hex       | Use                                                          |
| ------------ | --------- | ------------------------------------------------------------ |
| `--paper`    | `#FFFFFF` | Cards, inputs, sheets, dialogs.                              |
| `--haze-050` | `#F6F8F9` | Subtle fill: table header row, inactive tab, disabled input. |
| `--haze-100` | `#EDF0F3` | Page background. The default canvas of the entire product.   |
| `--haze-200` | `#DFE4EA` | Hover fill for ghost controls; skeleton base.                |
| `--line-200` | `#DCE2E8` | Default 1px border on light.                                 |
| `--line-300` | `#C3CCD6` | Emphasised border, input border on light.                    |

#### Signal — Chart Cyan (navigation, interaction, "where you are")

| Token        | Hex       | Use                                                                   |
| ------------ | --------- | --------------------------------------------------------------------- |
| `--cyan-600` | `#0B6A85` | Links, interactive text, selected state, focus ring. 6.15:1 on white. |
| `--cyan-500` | `#0E8AAC` | Hover state of `--cyan-600`.                                          |
| `--cyan-400` | `#38A7C4` | Cyan on dark surfaces. 6.99:1 on `--ink-000`.                         |
| `--cyan-050` | `#E6F2F6` | Selected-row fill, cyan badge background.                             |

#### Signal — Course Magenta (the committed path)

| Token          | Hex       | Use                                         |
| -------------- | --------- | ------------------------------------------- |
| `--course-500` | `#B01C5B` | Course Line on light. 6.73:1 on white.      |
| `--course-400` | `#E4487E` | Course Line on dark. 5.15:1 on `--ink-000`. |
| `--course-050` | `#FBECF2` | Fill behind "confirmed leg" markers only.   |

#### Status

| Token        | Hex       | Meaning                                           | Background pair        |
| ------------ | --------- | ------------------------------------------------- | ---------------------- |
| `--ok-600`   | `#1F7A5A` | Available, confirmed, paid, verified operator     | `--ok-050` `#E7F3EE`   |
| `--warn-600` | `#8A5A0F` | Quote pending, awaiting manifest, expiring soon   | `--warn-050` `#FBF2E3` |
| `--stop-600` | `#B42318` | Unavailable, cancelled, payment failed, over MTOW | `--stop-050` `#FDEDEB` |

**There is no gold, no bronze, no champagne, no cream, and no black (`#000`) anywhere in this product.** If a design ever calls for gold, the answer is `--ink-000` with more whitespace.

### 3.2 Colour usage rules

- **Cyan is for interaction. Magenta is for route.** They never swap roles. A button is never magenta. A route line is never cyan.
- Backgrounds are never tinted with signal colour except the four `-050` fills listed above, and only at their stated purpose.
- Status colours appear only in badges, inline validation, and the small dot indicator. They never colour a heading, a card border, or a card background.
- **No gradients** anywhere, with one exception: the hero surface may carry a single vertical linear gradient from `--ink-000` to `#0A1220` at ≤4% perceptual delta, to simulate atmospheric depth. No other gradient exists.
- Dark-surface text uses `--paper` for primary and `#9AA9BC` (`--ink-on-dark`) for secondary. Never `--ink-400` on dark.

---

## 4. Typography

### 4.1 The three faces

| Role      | Face                                | Source       | Why                                                                                                                                                                               |
| --------- | ----------------------------------- | ------------ | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Display   | **Archivo** (variable, `wdth` axis) | Google Fonts | Set expanded (`wdth: 115`) it reads like airport wayfinding and terminal signage — architectural, engineered, confident. Not a luxury serif, which is the cliché we are avoiding. |
| Body / UI | **Instrument Sans**                 | Google Fonts | A quiet, slightly technical grotesque. Width contrast against expanded Archivo is what makes the pairing work — do not narrow Archivo or the pairing collapses.                   |
| Data      | **JetBrains Mono**                  | Google Fonts | Tabular figures, unambiguous `0/O` and `1/l` — essential for tail numbers and ICAO codes.                                                                                         |

**No fourth typeface may be added, ever.** Fallback stacks:

```
--font-display: "Archivo", "Helvetica Neue", Arial, sans-serif;
--font-body:    "Instrument Sans", -apple-system, "Segoe UI", sans-serif;
--font-data:    "JetBrains Mono", ui-monospace, "SF Mono", monospace;
```

### 4.2 Type scale

Load Archivo at `wght 400–700`, `wdth 100–120`. Load Instrument Sans at `wght 400–600`. Load JetBrains Mono at `wght 400–600`.

| Token       | Face            | Size / Line           | Weight | Width | Tracking          | Use                                      |
| ----------- | --------------- | --------------------- | ------ | ----- | ----------------- | ---------------------------------------- |
| `display-1` | Archivo         | 64/64px (clamp 40→64) | 600    | 115   | −0.025em          | Homepage hero headline only              |
| `display-2` | Archivo         | 44/48px (clamp 32→44) | 600    | 112   | −0.02em           | Page masthead H1                         |
| `h1`        | Archivo         | 32/38px               | 600    | 110   | −0.02em           | Section headline                         |
| `h2`        | Archivo         | 24/30px               | 600    | 108   | −0.015em          | Card group heading, dialog title         |
| `h3`        | Instrument Sans | 18/26px               | 600    | —     | −0.01em           | Card title, form section title           |
| `body-lg`   | Instrument Sans | 17/28px               | 400    | —     | 0                 | Lead paragraph, one per page maximum     |
| `body`      | Instrument Sans | 15/24px               | 400    | —     | 0                 | Default body and form values             |
| `body-sm`   | Instrument Sans | 13/20px               | 400    | —     | 0                 | Helper text, captions, legal             |
| `label`     | Instrument Sans | 12/16px               | 600    | —     | 0.06em, uppercase | Field labels, table headers, eyebrows    |
| `data-xl`   | JetBrains Mono  | 40/44px               | 500    | —     | −0.02em           | Quote total price                        |
| `data-lg`   | JetBrains Mono  | 22/28px               | 500    | —     | −0.01em           | ICAO codes in route display, card price  |
| `data`      | JetBrains Mono  | 14/20px               | 400    | —     | 0                 | All figures in body flow                 |
| `data-sm`   | JetBrains Mono  | 12/16px               | 500    | —     | 0.02em            | Tail numbers, badge figures, table cells |

### 4.3 Typographic rules

- **Every number is `--font-data`** with `font-variant-numeric: tabular-nums`. This includes prices, times, dates in numeric form, durations, distances, weights, passenger counts, tail numbers, ICAO/IATA codes, and percentages. Prose numbers written as words ("two hours before departure") stay in body face.
- **Sentence case everywhere** except the `label` token, which is uppercase with 0.06em tracking. No Title Case Headlines Like This.
- Measure: body copy is capped at **68 characters** (`max-width: 34rem` at 15px). Lead paragraphs cap at 58 characters.
- Never centre a paragraph longer than two lines. Hero and empty states may centre; nothing else may.
- No text gradients, no text shadows, no letter-spacing on body copy, no all-caps body copy.
- Currency: `₦` and `$` set in mono, no space before the figure, thousands separated by comma, no decimals on amounts above 1,000. `₦18,450,000` / `$12,400`. Always show currency code on quote surfaces: `₦18,450,000 NGN`.
- Times are Zulu-suffixed where operationally relevant: `14:20 WAT` / `13:20Z`. Never mix.

---

## 5. Spacing, grid & layout

### 5.1 Spacing scale

Base unit 4px. **Only these values exist:**

```
--space-1:  4px    --space-6:  24px
--space-2:  8px    --space-7:  32px
--space-3:  12px   --space-8:  40px
--space-4:  16px   --space-9:  48px
--space-5:  20px   --space-10: 64px
                   --space-11: 80px
                   --space-12: 112px
```

`--space-section` = `112px` desktop / `72px` mobile. Every top-level section on every page uses this for vertical padding. No section gets custom vertical spacing.

### 5.2 Grid

- **Shell max-width:** 1440px, with 40px side gutters ≥1024px, 24px 640–1023px, 20px <640px.
- **Content max-width:** 1280px, centred inside the shell.
- **Columns:** 12, gutter 24px. Mobile collapses to 4 columns, gutter 16px.
- **Reading column:** 8 of 12, left-aligned within content width, for any page whose primary content is prose.
- **Application column:** full 12 for wizard, quotes, fleet grid, account.

### 5.3 Breakpoints

```
sm: 640   md: 768   lg: 1024   xl: 1280   2xl: 1440
```

Design mobile-first. Every component spec below states its mobile form explicitly; if it does not, the mobile form is a full-width stack of the desktop form with `--space-4` gaps.

### 5.4 Vertical rhythm inside a section

```
[section top pad --space-section]
  [Course Line stub 48px]        ← CL-5
  [--space-3]
  [eyebrow: label token, --ink-400]
  [--space-2]
  [h1]
  [--space-4]
  [lead paragraph, optional, max 1]
  [--space-9]
  [section content]
[section bottom pad --space-section]
```

**This block is identical on every section of every page.** It is the primary mechanism by which nothing looks out of place.

---

## 6. Radius, borders, elevation

### 6.1 Radius — derived from the cabin window

Business jet windows are rounded rectangles. That is the only shape metaphor in the product.

| Token              | Value                   | Applies to                                                                                            |
| ------------------ | ----------------------- | ----------------------------------------------------------------------------------------------------- |
| `--radius-control` | 4px                     | Buttons, inputs, selects, checkboxes (2px), tabs, badges on rectangles                                |
| `--radius-card`    | 8px                     | Cards, panels, table containers, dialogs                                                              |
| `--radius-sheet`   | 16px (top corners only) | Bottom sheets, mobile drawers                                                                         |
| `--radius-window`  | 20px                    | **Media containers only** — aircraft photography, cabin imagery, map tiles. This is the cabin window. |
| `--radius-pill`    | 9999px                  | Status pills, filter chips, avatar                                                                    |

Nothing else has a radius. No 6px, no 12px, no 10px.

### 6.2 Borders

- Default border: `1px solid var(--line-200)`.
- Input border: `1px solid var(--line-300)`.
- On dark: `1px solid var(--ink-800)`.
- Borders are always 1px. There is no 2px border in the product except the focus ring (§15) and the selected-card indicator (§11.4).

### 6.3 Elevation — two shadows only

```css
--shadow-raised:
  0 1px 2px rgba(7, 12, 20, 0.04), 0 2px 8px rgba(7, 12, 20, 0.04);
--shadow-float:
  0 8px 16px rgba(7, 12, 20, 0.06), 0 24px 48px rgba(7, 12, 20, 0.1);
```

- `--shadow-raised`: hovered cards, sticky headers on scroll, popovers.
- `--shadow-float`: dialogs, bottom sheets, the sticky quote bar.
- **Cards at rest have no shadow.** They are defined by their border. A resting card with a shadow is the single fastest way to make a premium site look like a template.
- No coloured shadows, no glow, no inner shadows, no glassmorphism, no backdrop blur except the dialog scrim.

---

## 7. Motion

### 7.1 Durations & easing

```
--dur-1: 120ms   micro (hover, focus, checkbox)
--dur-2: 200ms   standard (dropdown, tab, toast)
--dur-3: 320ms   deliberate (sheet, dialog, wizard step)
--dur-4: 1200ms  the Course Line draw only

--ease-out:  cubic-bezier(0.16, 1, 0.30, 1)    entrances, expansions
--ease-in:   cubic-bezier(0.40, 0, 1, 1)       exits
--ease-move: cubic-bezier(0.40, 0, 0.20, 1)    position changes
```

### 7.2 What animates

Only: opacity, transform, `stroke-dashoffset`, `background-color`, `border-color`, `box-shadow`, `height` on accordion. Never `width`, `top/left`, `filter`, or `letter-spacing`.

### 7.3 What is banned

Parallax. Scroll-jacking. Ken Burns on hero imagery. Text that types itself. Counters that count up. Cards that lift more than 2px. Page transitions longer than `--dur-3`. Anything that repeats more than twice (no infinite pulses except a single skeleton shimmer).

### 7.4 The Course Line draw

On homepage load and on wizard step advance: `stroke-dasharray` set to path length, `stroke-dashoffset` animated to 0 over `--dur-4` with `--ease-out`. The origin label fades in at 0ms, the destination label at 900ms. Runs once per session — store in `sessionStorage`.

### 7.5 Reduced motion

```css
@media (prefers-reduced-motion: reduce) {
  *,
  *::before,
  *::after {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important;
    scroll-behavior: auto !important;
  }
}
```

The Course Line renders fully drawn immediately. Opacity fades of ≤120ms are retained for state legibility.

---

## 8. Iconography & imagery

### 8.1 Icons

- **Lucide React**, `strokeWidth={1.5}`, sizes 16 / 20 / 24 only.
- Icon colour inherits text colour. Icons never carry signal colour on their own.
- **No emoji anywhere in the product UI**, including empty states and toasts.
- Aircraft category icons must be custom SVG silhouettes at consistent scale (turboprop → ultra-long-range), all drawn to the same wingspan-normalised bounding box, 1.5px stroke. A category icon set drawn at inconsistent scale destroys the fleet page.

### 8.2 Photography rules

This is where aviation sites fail hardest. Hard rules:

- **Real tail numbers only.** Every aircraft image must be of the actual airframe on offer, with the registration visible or stated in the caption. Renders and stock are forbidden on aircraft cards and aircraft detail pages.
- **Banned imagery:** jet on runway at sunset, silhouette against orange sky, champagne flutes, a model reclining in a cabin, hands on a steering yoke, generic clouds-from-above.
- **Permitted imagery:** exterior three-quarter on ramp in flat daylight; cabin interior shot straight down the aisle at seat height; the galley; the baggage hold with a person's luggage in it for scale; the FBO lounge; the actual crew.
- Aspect ratios: `16:9` hero media, `4:3` aircraft card, `3:2` cabin gallery, `1:1` crew and operator. No other ratios.
- All media containers use `--radius-window` (20px) and `object-fit: cover`.
- Every image has a real `alt` describing the airframe and view: `"Cessna Citation XLS+ 5N-BQZ, exterior three-quarter view on the ramp at Lagos"`.
- Images are `next/image` with explicit `sizes`, `priority` only on the hero.

### 8.3 Maps

- Single style: light basemap, `--haze-100` land, `--paper` water inverted to `--haze-050`, no labels below city level, no points of interest.
- Route rendered as Course Line (magenta, 1.5px). Airports as 6px `--ink-700` dots with mono labels.
- Maps sit in `--radius-window` containers.

---

## 9. Voice & copy rules

- **Plain, operational, unhurried.** We sound like a dispatcher, not a concierge and not a marketer.
- Banned words: _seamless, elevate, journey (as metaphor), curated, bespoke, unparalleled, indulge, luxury, exclusive, world-class, redefine._ If the copy needs one of these, the design is doing too little.
- Active voice, sentence case, no exclamation marks.
- Button labels are verbs that name the outcome, and the outcome keeps the same name through the flow: `Request quote` → toast `Quote requested` → page `Quote requested`. Never `Submit`.
- Numbers are stated, not softened: "Departs in 4 hours 20 minutes", not "Departing soon".
- Errors state what happened and what to do: `Passport expires before the return date. Enter a passport valid through 12 Nov 2026.` They do not apologise and are never vague.
- Empty states are invitations with a single action: `No saved travellers yet. Add one now and skip manifest entry on every future booking.` + one button.
- Prices are always accompanied by what they include and what they don't, in `body-sm`: `Includes crew, fuel, landing and handling. Excludes de-icing and overnight crew fees.`
- Cancellation and expiry language is never buried and never euphemistic.

---

## 10. Token implementation (Tailwind v4)

All tokens live in `src/app/globals.css` under `@theme`. **No hard-coded values in components. No arbitrary Tailwind values (`text-[#123456]`, `p-[13px]`) — the linter should fail the build on them.**

```css
@import "tailwindcss";

@theme {
  /* ink */
  --color-ink-000: #070c14;
  --color-ink-900: #0e1826;
  --color-ink-800: #16233a;
  --color-ink-700: #1e2c40;
  --color-ink-600: #33455e;
  --color-ink-400: #64738a;
  --color-ink-200: #a7b3c2;
  --color-ink-ondark: #9aa9bc;

  /* haze */
  --color-paper: #ffffff;
  --color-haze-050: #f6f8f9;
  --color-haze-100: #edf0f3;
  --color-haze-200: #dfe4ea;
  --color-line-200: #dce2e8;
  --color-line-300: #c3ccd6;

  /* signal */
  --color-cyan-600: #0b6a85;
  --color-cyan-500: #0e8aac;
  --color-cyan-400: #38a7c4;
  --color-cyan-050: #e6f2f6;

  --color-course-500: #b01c5b;
  --color-course-400: #e4487e;
  --color-course-050: #fbecf2;

  /* status */
  --color-ok-600: #1f7a5a;
  --color-ok-050: #e7f3ee;
  --color-warn-600: #8a5a0f;
  --color-warn-050: #fbf2e3;
  --color-stop-600: #b42318;
  --color-stop-050: #fdedeb;

  /* type */
  --font-display: "Archivo", "Helvetica Neue", Arial, sans-serif;
  --font-body: "Instrument Sans", -apple-system, "Segoe UI", sans-serif;
  --font-data: "JetBrains Mono", ui-monospace, "SF Mono", monospace;

  /* radius */
  --radius-control: 4px;
  --radius-card: 8px;
  --radius-sheet: 16px;
  --radius-window: 20px;

  /* elevation */
  --shadow-raised: 0 1px 2px rgb(7 12 20 / 0.04), 0 2px 8px rgb(7 12 20 / 0.04);
  --shadow-float:
    0 8px 16px rgb(7 12 20 / 0.06), 0 24px 48px rgb(7 12 20 / 0.1);

  /* motion */
  --ease-out: cubic-bezier(0.16, 1, 0.3, 1);
  --ease-in: cubic-bezier(0.4, 0, 1, 1);
  --ease-move: cubic-bezier(0.4, 0, 0.2, 1);
}

@layer base {
  html {
    background: var(--color-haze-100);
    color: var(--color-ink-600);
  }
  body {
    font-family: var(--font-body);
    font-size: 15px;
    line-height: 24px;
    -webkit-font-smoothing: antialiased;
  }
  h1,
  h2 {
    font-family: var(--font-display);
    font-weight: 600;
    font-variation-settings: "wdth" 112;
    letter-spacing: -0.02em;
    color: var(--color-ink-700);
  }
  .num {
    font-family: var(--font-data);
    font-variant-numeric: tabular-nums;
  }
}
```

**File and naming conventions**

```
src/
  app/                       # routes
  components/
    primitives/              # Button, Input, Select, Badge, Card, Sheet, Dialog…
    aviation/                # RouteDisplay, AircraftCard, CourseLine, SpecTable…
    layout/                  # Shell, Header, Footer, PageMasthead, Section
  config/brand.ts
  lib/format.ts              # formatNaira, formatDuration, formatZulu — SINGLE source
```

- Every figure rendered in the UI passes through a formatter in `lib/format.ts`. No inline `toLocaleString` in components.
- Components accept a `className` and merge with `cn()`; they never accept a `color` or `variant` prop that isn't in this document.

---

## 11. Component specifications

### 11.1 Buttons

One shape. Height 44px (`lg` 52px, `sm` 36px), `--radius-control`, `--font-body` 15/24 weight 600, horizontal padding 20px (`lg` 28px, `sm` 14px). Icon 20px, gap 8px, icon always leading except "next"-type actions where it trails.

| Variant         | Rest                                              | Hover                               | Active                             | Disabled                                                 |
| --------------- | ------------------------------------------------- | ----------------------------------- | ---------------------------------- | -------------------------------------------------------- |
| **Primary**     | bg `--ink-700`, text `--paper`                    | bg `--ink-600`                      | bg `--ink-700`, `translateY(1px)`  | bg `--haze-200`, text `--ink-200`, `cursor: not-allowed` |
| **Secondary**   | bg `--paper`, 1px `--line-300`, text `--ink-700`  | bg `--haze-050`, border `--ink-400` | bg `--haze-200`                    | bg `--haze-050`, text `--ink-200`, border `--line-200`   |
| **Ghost**       | transparent, text `--cyan-600`                    | bg `--cyan-050`                     | bg `--cyan-050`, text `--cyan-500` | text `--ink-200`                                         |
| **Destructive** | bg `--paper`, 1px `--stop-600`, text `--stop-600` | bg `--stop-050`                     | bg `--stop-050`                    | as Secondary disabled                                    |
| **On dark**     | bg `--paper`, text `--ink-000`                    | bg `#E9EDF1`                        | `translateY(1px)`                  | bg `--ink-800`, text `--ink-400`                         |

- Transition: `background-color, border-color, transform var(--dur-1) var(--ease-out)`.
- **One primary button per view.** If two actions compete, the second is Secondary. The wizard's "Back" is always Ghost.
- Loading: label is replaced by a 16px spinner + the present-participle of the label (`Requesting quote…`); width is locked to prevent reflow.
- Full-width buttons only inside bottom sheets, mobile sticky bars, and forms narrower than 400px.

### 11.2 Page masthead — required on every page

```
┌─────────────────────────────────────────────┐
│ [Course Line stub 48px]                     │
│ EYEBROW (label token, --ink-400)            │
│ Page title (display-2)                      │
│ Optional one-line description (body-lg,     │
│ --ink-400, max 58ch)                        │
│                        [optional action ▸]  │
└─────────────────────────────────────────────┘
```

Top padding `--space-10`, bottom padding `--space-9`, sits on `--haze-100`. Action button sits baseline-aligned with the title on ≥1024px, stacks below on mobile.

### 11.3 Header & navigation

**Desktop (≥1024px):** 72px tall, `--paper`, bottom border `--line-200`, sticky. Left: wordmark in Archivo `wdth 120` weight 700, 18px, tracking 0.02em. Centre-left: nav items (`Fleet`, `Empty legs`, `Safety`, `How it works`) in `body` 15px `--ink-600`; active item carries CL-4. Right: `Sign in` (Ghost) + `Request a flight` (Primary). On scroll past 24px, gains `--shadow-raised`; nothing else changes — no shrinking, no colour change.

**Mobile (<1024px):** 56px header with wordmark + a single Primary `Request` button. Navigation lives in a **bottom tab bar**, 64px tall + safe-area inset, `--paper`, top border `--line-200`, four items: `Home`, `Fleet`, `Trips`, `Account`. Icon 24px above `label` 10px. Active item: icon and label `--cyan-600`, plus a 2px `--cyan-600` bar 24px wide at the top edge of the tab. **Minimum tap target 48×48 everywhere on mobile, no exceptions.**

The bottom tab bar is hidden on the booking wizard, which uses its own sticky footer bar (§13.2).

### 11.4 Card — one style, four content variants

**Base:** `--paper`, 1px `--line-200`, `--radius-card`, no shadow at rest. Padding 20px mobile / 24px desktop. Hover (only if the whole card is a link): border → `--line-300`, `--shadow-raised`, `translateY(-2px)`, `--dur-2 --ease-out`. Selected: border `2px --cyan-600`, inset padding reduced by 1px to prevent layout shift, plus a 20px check glyph top-right in `--cyan-600`.

**Variant A — Aircraft card** (fleet grid, quote options)

```
┌──────────────────────────────────┐
│ ┌──────────────────────────────┐ │  4:3 image, --radius-window
│ │        aircraft photo        │ │  badge overlay top-left: category pill
│ └──────────────────────────────┘ │
│ Citation XLS+            (h3)    │
│ 5N-BQZ · 2019 · refurb 2023      │  data-sm, --ink-400
│ ──────────────────────────────── │  1px --line-200
│ PAX      8      BAGS   2.4 m³    │  label above data, 2×2 grid
│ RANGE  3,400 km  SPEED  795 km/h │
│ ──────────────────────────────── │
│ from ₦8,200,000  /  block hour   │  data-lg + body-sm
│ ARGUS Platinum · Part 135        │  ok badge row
└──────────────────────────────────┘
```

**Variant B — Empty leg card** — same base, but the image is 16:9 and the body leads with a Route Display (§11.5), followed by the departure window, the discount as a `--ok-050` pill (`58% below charter`), and the seat count. Expiry is shown as `--warn-600` mono countdown when under 24 hours.

**Variant C — Quote card** — no image. Leads with operator name and safety rating, then aircraft, then a right-aligned `data-xl` price, then an inclusions list of at most four `body-sm` lines with 16px check/cross glyphs. Footer: quote expiry countdown + `Accept quote` Primary.

**Variant D — Itinerary card** — no image. Left rail 4px wide in `--course-500` for confirmed / `--warn-600` for pending, running the full card height. Content: Route Display, date/time block, aircraft + tail, FBO names, passenger count. Right: status badge.

### 11.5 Route Display — the CL-3 component

The most-used component in the product. It appears on empty leg cards, quote cards, itineraries, the wizard summary, and confirmation emails.

```
LOS                                              ABV
DNMM  ───────────  ✈  ───────────  DNAA
Murtala Muhammed          Nnamdi Azikiwe
06:40 WAT                 07:45 WAT
                1h 05m · nonstop
```

- IATA code in `data-lg` `--ink-700`; ICAO in `data-sm` `--ink-400` directly beneath.
- Connector: Course Line, 1px `--course-500`, with a 16px aircraft glyph at midpoint rotated 90° (pointing along the line), sitting on a 20px `--paper` disc so the line reads as passing behind it.
- Airport full names in `body-sm` `--ink-400`, truncated with ellipsis at container width.
- Times in `data` with timezone abbreviation. Duration centred below the line in `data-sm` `--ink-400`.
- **Multi-leg:** the line continues through intermediate airports, each marked with a 6px `--ink-700` dot and its own code stack. Never wrap a route onto two lines — on mobile, switch to the vertical form: codes stacked with a vertical Course Line on the left and a dot per stop.

### 11.6 Badges & pills

Height 24px, `--radius-pill`, padding 0 10px, `data-sm` 12/16 weight 500, uppercase tracking 0.04em.

| Type           | Fill                         | Text         | Example                 |
| -------------- | ---------------------------- | ------------ | ----------------------- |
| Status ok      | `--ok-050`                   | `--ok-600`   | `CONFIRMED` `AVAILABLE` |
| Status pending | `--warn-050`                 | `--warn-600` | `AWAITING MANIFEST`     |
| Status stop    | `--stop-050`                 | `--stop-600` | `CANCELLED`             |
| Category       | `--haze-100`                 | `--ink-600`  | `SUPER MIDSIZE`         |
| Safety         | `--paper` + 1px `--line-300` | `--ink-700`  | `ARGUS PLATINUM`        |

Badges never carry icons except the safety badge, which carries a 14px shield glyph.

### 11.7 Bottom sheet (mobile) / Popover (desktop)

Every selection control that has more than 5 options uses a bottom sheet on <768px and a popover on ≥768px. Same content, same order, same labels.

**Bottom sheet:** enters from the bottom, `translateY(100%) → 0` over `--dur-3 --ease-out`. `--paper`, `--radius-sheet` top corners, `--shadow-float`. 40×4px `--haze-200` grab handle centred with 12px top margin. Header row: title (h3) left, 24px close glyph right, bottom border `--line-200`. Max height 88vh, content scrolls, header pinned. Scrim `rgba(7,12,20,.44)` fading in over `--dur-2`. Dismiss on scrim tap, Escape, and downward drag past 96px. Bottom inset respects `env(safe-area-inset-bottom)`.

**Popover:** `--paper`, `--radius-card`, 1px `--line-200`, `--shadow-float`, min-width 280px, offset 8px, entering with `opacity 0→1, translateY(-4px)→0` over `--dur-2`.

### 11.8 Dialog

Centred, max-width 520px, `--paper`, `--radius-card`, `--shadow-float`, padding 32px. Title h2, body body, actions right-aligned with 12px gap. Scrim `rgba(7,12,20,.44)` + `backdrop-filter: blur(2px)` — the only blur permitted in the product. Focus trapped, returns focus to trigger on close. On <768px a dialog becomes a bottom sheet.

### 11.9 Toast

Bottom-right desktop / bottom-centre above tab bar on mobile. `--ink-000` fill, `--paper` text, `--radius-card`, padding 14px 18px, `--shadow-float`, max-width 380px. 20px status glyph leading in `--cyan-400` / `--ok-600` / `--stop-600`. Auto-dismiss 5s, pause on hover, dismiss button always present. Maximum two stacked. Never used for errors that require action — those are inline.

### 11.10 Spec table

Used for aircraft specifications and quote breakdowns. Container `--paper`, 1px `--line-200`, `--radius-card`, overflow hidden. Header row `--haze-050`, `label` token, 44px tall. Body rows 48px, bottom border `--line-200`, last row borderless. Label column `--ink-400` `body-sm`; value column `data` `--ink-700`, right-aligned when numeric, left when textual. Zebra striping is forbidden — the row borders do the work. On mobile the table becomes a definition list: label above value, 16px gap, 1px separator between pairs.

### 11.11 Tabs & filter chips

**Tabs:** underline style. Label `body` 15px weight 500, `--ink-400`; active `--ink-700` with a 2px `--cyan-600` underline. Container bottom border `--line-200`. 44px tall, 20px gap. Never pill tabs — pills are reserved for filters.

**Filter chips:** `--radius-pill`, 36px tall, padding 0 16px, `--paper` + 1px `--line-300`, `body-sm`. Selected: `--cyan-050` fill, `--cyan-600` border and text, 16px check leading. Horizontally scrollable row on mobile with 20px edge padding and no visible scrollbar.

### 11.12 Trust row

Appears on the homepage, the aircraft detail page, and above every quote. A single horizontal row, `--haze-050` band, 72px tall, containing 4 items: operator certificate, safety rating, insurance cover, years operating. Each is a 20px glyph + `label` + `data`. Never a carousel, never logos-of-companies-we-work-with.

### 11.13 Footer

`--ink-000`, top padding `--space-11`, bottom `--space-9`. Four columns on desktop (Book, Fleet, Company, Legal), stacked accordion on mobile. Link text `--ink-ondark`, hover `--paper`, `--dur-1`. Wordmark top-left in `--paper`. Bottom bar separated by 1px `--ink-800`: certificate numbers and registered address in `data-sm` `--ink-400`, plus a one-line disclosure stating whether Meridian operates aircraft or arranges charter as an agent. That disclosure is legally load-bearing — never remove it for visual balance.

---

## 12. Form specifications

### 12.1 Universal field anatomy

```
LABEL (label token, --ink-600, 12/16, uppercase)
[--space-2]
┌────────────────────────────────────────┐  52px tall
│  value (body 15px --ink-700)      [ic] │  --paper, 1px --line-300
└────────────────────────────────────────┘  --radius-control
[--space-2]
helper text (body-sm, --ink-400)
```

| State     | Border       | Fill         | Other                                                   |
| --------- | ------------ | ------------ | ------------------------------------------------------- |
| Rest      | `--line-300` | `--paper`    | placeholder `--ink-200`                                 |
| Hover     | `--ink-400`  | `--paper`    | —                                                       |
| Focus     | `--cyan-600` | `--paper`    | + focus ring (§15)                                      |
| Filled    | `--line-300` | `--paper`    | value `--ink-700`                                       |
| Error     | `--stop-600` | `--paper`    | helper replaced by error text `--stop-600` + 16px glyph |
| Disabled  | `--line-200` | `--haze-050` | text `--ink-200`, `cursor: not-allowed`                 |
| Read-only | none         | `--haze-050` | value `--ink-600`                                       |

- Field height 52px everywhere. Textarea min-height 120px, same styling.
- Labels are always visible and always above the field. **No floating labels, no placeholder-as-label.** Under pressure, an assistant filling a manifest must be able to scan labels without focusing fields.
- Helper text is present from the start where it prevents an error (`As shown on passport`), not only after failure.
- Required fields are the default; **optional fields carry `(optional)` in the label** in `--ink-400` normal case. Asterisks are not used.
- Vertical gap between fields: `--space-5` (20px). Between field groups: `--space-8` (40px) with a group title in h3.
- Two fields sit side by side only when their values are semantically paired (date + time, first + last name, weight + unit). Never for space-saving.

### 12.2 Airport field — the most important input in the product

A combobox, never a plain select.

- Placeholder: `City, airport or ICAO`.
- Accepts and matches on: IATA (`LOS`), ICAO (`DNMM`), city, airport name, and common alias. Must include general aviation fields and FBO-served airports, not only IATA-coded commercial airports — flying into an airport airlines don't serve is half the value of private charter.
- Results row: IATA code in `data-lg` left (fixed 56px column so codes align), airport name in `body` above city/country in `body-sm --ink-400`, distance from the typed location right-aligned in `data-sm`. Runway length shown in `data-sm --ink-400` when the selected aircraft has a runway constraint.
- Grouping: `Nearest`, then `Recent`, then `All results`. Group headers in `label` token on `--haze-050`.
- Keyboard: ↑/↓ move, Enter select, Escape close, type-ahead debounced 180ms. Full ARIA combobox pattern.
- Mobile: opens a **full-screen** sheet (not a partial one) with the search field pinned at the top under the safe area — the keyboard must never cover the results.
- Selected state renders as `LOS · Murtala Muhammed` with the code in mono and the name in body.

### 12.3 Date & time

- Date: a calendar popover / full-screen sheet on mobile. Two months visible on desktop, one on mobile with vertical scroll. Today outlined in `--cyan-600`; selected filled `--ink-700` with `--paper` text; range fill `--cyan-050`. Unavailable dates `--ink-200` with no interaction. Day numbers in `data`.
- Time: 15-minute increments in a scrollable list, with a free-text entry accepting `1420`, `14:20`, `2:20pm`. Always show the timezone of the **departure airport**, labelled: `Departure time (WAT — Lagos)`.
- A flexibility control sits beneath every departure time: a segmented control `Exact / ±2h / ±1 day`, defaulting to `±2h`, with helper text `Flexible times often reduce the quote.`

### 12.4 Passenger & baggage

- Passenger count: a stepper, 44×44 buttons, value in `data-lg` centred, min 1 max 19. Beneath it, live text: `Fits: light jet and above` in `--ok-600`, updating as the count changes.
- Baggage: piece count stepper + a multi-select of oversized items (golf clubs, skis, instrument case, wheelchair, pet crate) as filter chips. When a selection exceeds the current category's hold, show inline `--warn-600` text: `Golf bags won't fit a light jet hold. Midsize or larger recommended.` — a warning, never a block.
- Pets: a switch plus a conditional field for species and weight. Helper: `Some operators restrict pets. We'll only quote operators that accept them.`

### 12.5 Manifest form (post-quote)

The highest-stakes form. Rules:

- One passenger per collapsible panel, numbered `PASSENGER 01`, `PASSENGER 02` in `label`+`data-sm`. Lead passenger is panel 01 and cannot be removed.
- Fields: full legal name (helper `Exactly as printed on the ID you'll travel with`), date of birth, nationality, passport number, passport expiry, **weight**.
- **Weight is required and must be explained inline**, not buried: `Required for weight and balance. Small aircraft are certified to strict limits — this is a safety calculation, not a personal one.` Unit toggle kg/lb; store canonical kg.
- Passport fields appear only when the itinerary crosses a border. If they appear, an expiry check runs against the return date on blur and errors immediately.
- A `Save to my travellers` checkbox on each panel, defaulted on for the lead passenger.
- A live aggregate strip pinned under the form: `4 passengers · 312 kg · 118 kg baggage · within limits` — the last clause in `--ok-600` or `--stop-600`.

### 12.6 Validation

- Validate on **blur**, re-validate on change once a field has errored. Never validate on first keystroke.
- The submit button is never disabled to communicate an invalid form. It stays enabled; pressing it moves focus to the first error and announces the count via a live region: `3 fields need attention.`
- Error summary appears at the top of long forms (manifest, payment) as a `--stop-050` panel with anchor links to each field.
- Server errors surface inline against the relevant field wherever the API identifies one; only genuinely global failures use a toast.

### 12.7 Payment

- Method order: **Bank transfer (primary), then card, then jet card balance.** Card limits break on eight-figure bookings — bank transfer leads for a reason and must be the visually primary option.
- Bank transfer shows account details in `data` with a copy button per line, plus the reference code in `data-lg` and a clear statement of when the flight is released.
- The cancellation policy is a required explicit checkbox with the policy text visible above it — **never** a link-only acknowledgement, and never pre-checked.
- Amount due appears in `data-xl` on an `--ink-000` panel with the currency code and, where applicable, the NGN/USD rate and its timestamp.

---

## 13. Page specifications

Every page: Shell → Header → Page masthead (§11.2) → sections at `--space-section` rhythm → Footer.

### 13.1 Home (`/`)

**Section 1 — Hero.** Full-bleed `--ink-000`, min-height 640px desktop / 560px mobile, with the single permitted gradient. No photograph behind the text. Contents, centred in the content column:

- `display-1` headline, max 2 lines: _"Charter that answers in twenty minutes, not tomorrow."_
- One `body-lg` line in `--ink-ondark`.
- **The CL-1 great-circle arc**, rendered as SVG between two mono airport labels, animating on load. This is the hero image — there is no photograph.
- Beneath it, the **request bar**: a single elevated `--paper` panel, `--radius-card`, `--shadow-float`, containing From / To / Date / Passengers and a Primary `Request quote`. On mobile this collapses to one Primary button that opens the wizard directly.

**Section 2 — Trust row** (§11.12), immediately below the hero, no section padding above it.

**Section 3 — How it works.** Three steps. This is one of the few places numbered markers are legitimate, because the order is real and the user needs it: `01 Tell us the trip` → `02 We quote in 20 minutes` → `03 Confirm and fly`. Numbers in `data-lg --course-500`, connected by a horizontal Course Line on desktop, vertical on mobile.

**Section 4 — Empty legs.** Three Variant B cards + a Secondary `See all empty legs`. If fewer than three are live, show what exists and fill the remainder with a single `--haze-050` panel inviting a route alert — never render a half-empty grid.

**Section 5 — Fleet preview.** Four Variant A cards in a 4-up grid (2-up tablet, 1-up mobile) + Secondary `See the full fleet`.

**Section 6 — Safety.** Two columns: left a `body-lg` statement of how operators are vetted, right a Spec table of the actual checks (certificate, audit, insurance, pilot hours minima). No photograph.

**Section 7 — Closing request band.** `--ink-000`, `display-2` headline, one Primary and one phone number in `data-lg`. The phone number is a real, tappable `tel:` link — for this audience, a visible phone number is a trust element.

### 13.2 Request a flight — the wizard (`/request`)

Four steps. Header replaced by a minimal bar: wordmark left, `Save and exit` Ghost right. Bottom tab bar hidden.

**Progress:** CL-2 Course Line across the top, 64px below the bar. Waypoints labelled `Route`, `Aircraft`, `Contact`, `Review`. Completed waypoints are filled `--course-500` dots; the current is a 10px ring; upcoming are `--line-300`. The segment behind the current position is solid, ahead is dashed.

**Step 1 — Route.** Trip type segmented control (`One way / Return / Multi-leg`) → airport fields → date/time + flexibility → passengers → baggage → pets. Multi-leg adds leg panels, each numbered `LEG 01`, with a `Add leg` Ghost button and per-leg removal.

**Step 2 — Aircraft.** Category cards in a responsive grid, each showing the custom silhouette, category name, typical seats, typical range, and indicative hourly rate. Multi-select. Below: amenity requirements as filter chips (`Enclosed lavatory`, `Wi-Fi`, `Standing cabin`, `Flat bed`). A `No preference — show me everything` option is always present and is the default.

**Step 3 — Contact.** Name, email, phone (with country selector defaulting to +234), company (optional), and a `How should we reach you?` radio (`Call`, `WhatsApp`, `Email`). Nothing else — do not collect passport data before a price exists.

**Step 4 — Review.** A read-only summary using Route Display + Spec table, each block with an `Edit` Ghost link that returns to that step and restores scroll position. Primary `Request quotes`.

**Sticky footer bar** on every step: `--paper`, top border `--line-200`, `--shadow-float`, 72px + safe area. Ghost `Back` left, Primary `Continue` right, and centred in `data-sm --ink-400`: `Step 2 of 4`. On mobile the Primary is full-width and `Back` becomes a 24px chevron.

**Persistence:** every step writes to local storage on change. Reopening restores state and shows a `--haze-050` bar: `Picked up where you left off.` with a `Start over` Ghost.

### 13.3 Quotes (`/quotes` and `/quotes/[id]`)

**Index.** Masthead + a list of Variant C cards ordered by price ascending, with a sort control (`Price`, `Departure`, `Aircraft age`). Each card carries a live expiry countdown in `data` — `--ink-400` above 6 hours, `--warn-600` below, `--stop-600` at under 1 hour. A `--haze-050` explainer panel sits above the list: what a quote includes, and that prices hold only until expiry.

**Detail.** `--ink-000` surface for the top third: operator, aircraft, Route Display in dark variant, and the total in `data-xl`. Below on `--haze-100`: a Spec table cost breakdown (aircraft, fuel surcharge, landing and handling, catering, taxes, and any repositioning), the aircraft gallery in `--radius-window` containers, the safety block, and the cancellation policy in full prose — not collapsed, not a link.

**Sticky accept bar** on mobile and desktop: `--paper`, `--shadow-float`, total in `data-lg` left, `Accept quote` Primary right, expiry countdown between them.

### 13.4 Fleet (`/fleet`, `/fleet/[slug]`)

**Index.** Filter chip row (category, seats, range, amenities) that is sticky under the header. Grid of Variant A cards: 3-up ≥1280, 2-up ≥768, 1-up below. Result count in `data` above the grid. Filters reflected in the URL.

**Detail.** Masthead with aircraft name and tail number in `data-lg`. Then: gallery (16:9 lead + 3:2 thumbnails, `--radius-window`), a two-column layout with Spec table left (performance, cabin, baggage, runway requirement, year, refurbishment) and a sticky `--paper` request panel right containing a compact route form and Primary `Request this aircraft`. Below: cabin layout diagram in flat line art using `--ink-700` and `--course-500` only, operator block, and three similar aircraft as Variant A cards.

### 13.5 Empty legs (`/empty-legs`, `/empty-legs/[id]`)

**Index.** Masthead explaining what an empty leg is in one `body-lg` line — most first-time buyers don't know, and this is the strongest acquisition surface in the business. Filters: origin region, destination region, date range. Grid of Variant B cards. A `Create a route alert` Secondary is pinned in a `--haze-050` panel after the sixth card and in the empty state.

**Detail.** Route Display large, departure window with the flexibility explained plainly (`This aircraft repositions between 06:00 and 11:00 on 14 August. The operator will confirm the exact time.`), price with the comparison to a full charter, seats, aircraft block, and a Primary `Request this leg`. A `--warn-050` panel states plainly that empty legs can be cancelled if the originating charter changes. **Never soften this.**

### 13.6 Trips (`/trips`, `/trips/[id]`)

**Index.** Tabs: `Upcoming`, `Past`, `Cancelled`. Variant D cards. Each upcoming trip shows the next required action as a Ghost link (`Add passenger manifest`, `Complete payment`).

**Detail — the itinerary page.** `--ink-000` header block: Route Display in dark variant, date, status badge, confirmation code in `data-lg`. Below on `--haze-100`, a vertical timeline whose spine is a Course Line: `Arrive at FBO` → `Departure` → `Arrival` → `Ground transport`, each with time in `data` and location. Then: aircraft and crew block, FBO details with address and a map in a `--radius-window` container, passenger list, catering, documents (charter agreement, receipt) as a download list, and a Secondary `Contact dispatch` with a real phone number. Print stylesheet required — clients print itineraries.

### 13.7 Account (`/account/*`)

Left nav (desktop) / segmented tabs (mobile): `Profile`, `Travellers`, `Payment`, `Preferences`. Each page is a stack of `--paper` panels with an h3 title, a Spec-table-style field list, and a single `Edit` Ghost per panel opening a dialog. `Travellers` is the highest-value page: saved traveller cards showing name, nationality, and passport expiry, with expiry inside 6 months flagged `--warn-600`.

### 13.8 Safety & operators (`/safety`)

Reading column (8 of 12). Prose plus one Spec table of vetting criteria and one Trust row. No hero image, no stock photography. This page's job is to be believed, and photographs make it less believable.

### 13.9 Auth (`/signin`)

Centred 400px card on `--haze-100`. Wordmark above. Email + `Send code` Primary → 6-digit code in six `data-lg` boxes, 52×52, auto-advancing, paste-aware. One Ghost `Use a different email`. No social login, no password.

### 13.10 404 and error pages

Same shell, same masthead. `display-2`: `That page isn't on the map.` One `body` line, one Primary `Go to home`, one Ghost `Request a flight`. A decorative CL arc may appear here — it is the one page where the Course Line encodes nothing, and that is the joke.

---

## 14. States: loading, empty, error

### 14.1 Loading

- **Skeletons, never spinners, for content.** Skeleton blocks are `--haze-200`, matching the exact dimensions and radius of the content they replace, with a single shimmer sweep at 1.6s using a `--haze-100` highlight. Never shimmer more than the visible viewport.
- Spinners appear only inside buttons and in the quote-searching state.
- **The quote-searching state is a designed screen, not a spinner.** It shows the route, an animated Course Line, and a live list of operators being contacted appearing one by one in `data-sm`. Expected wait is stated honestly: `Most quotes arrive within 20 minutes. We'll text you.`

### 14.2 Empty

Every empty state has: a 32px `--ink-200` line icon, an h3 statement of what's absent, one `body-sm --ink-400` line explaining why or what to do, and exactly one Primary action. Centred in a `--paper` panel with `--radius-card` and 48px vertical padding. Never an illustration, never a mascot.

### 14.3 Error

- Inline field errors: §12.6.
- Section-level failures: a `--stop-050` panel with 20px glyph, an h3 statement, and a `Try again` Secondary. Never replace a whole page for a partial failure.
- Page-level failure: same shell, masthead, and the error panel in the content area. The header and footer always render.

---

## 15. Accessibility floor

Non-negotiable. Any PR failing these is rejected.

- **Contrast:** body text ≥4.5:1, large text and UI borders ≥3:1. The palette in §3 is pre-validated — using it correctly satisfies this automatically.
- **Focus ring:** `outline: 2px solid var(--color-cyan-600); outline-offset: 2px;` on every interactive element, never removed, never replaced with a shadow. On `--ink-000` surfaces the ring is `--cyan-400`.
- **Tap targets:** ≥44×44 desktop, ≥48×48 mobile, including icon-only buttons and calendar day cells.
- Every input has a programmatically associated `<label>`. Placeholder is never the label.
- Full keyboard operability for the airport combobox, calendar, sheets, dialogs, and tabs, following the WAI-ARIA authoring practice for each.
- Focus is trapped in dialogs and sheets and restored to the trigger on close.
- Live regions announce: quote arrival, validation error counts, and countdown thresholds crossing 1 hour.
- Colour is never the sole carrier of meaning — every status badge carries text, and every inline error carries a glyph plus text.
- `prefers-reduced-motion` honoured per §7.5.
- Semantic landmarks on every page: `header`, `nav`, `main`, `footer`. One `h1` per page, in the masthead.

---

## 16. Consistency contract

**Claude Code must obey these without exception. When in doubt, stop and ask rather than improvise.**

1. **No value outside this document.** No hex, no px spacing, no font-size, no radius, no shadow, no easing curve that is not a token defined here. No Tailwind arbitrary values.
2. **One primary button per view.**
3. **Every number renders in `--font-data` with tabular figures**, via a formatter in `lib/format.ts`.
4. **Every page uses the page masthead and the §5.4 section rhythm.** Marketing pages included.
5. **Cards have no resting shadow.**
6. **Radius is one of the five tokens.** Media containers are always `--radius-window`.
7. **The Course Line is magenta and only ever encodes a route, sequence, or position.** Cyan is only ever interaction.
8. **No gold, no black `#000`, no gradients** (except the single hero gradient), no glassmorphism, no blur (except the dialog scrim), no emoji, no stock aircraft photography.
9. **Labels are always visible above fields.** No floating or placeholder labels.
10. **Dark surfaces only in the four places named in P1.**
11. **No new typeface, ever.** Three faces, three roles.
12. **Never disable a submit button to signal invalidity.**
13. **Never soften cancellation, expiry, or empty-leg risk copy** for visual balance.
14. **Aircraft images are of the actual airframe**, with the registration stated.
15. **Reuse before creating.** Before writing a new component, check `components/primitives` and `components/aviation`. A near-duplicate component is a defect, not a shortcut.
16. **When a design need is genuinely unmet by this document,** propose an addition as a diff to this file first, get it approved, then build. Do not build first.

---

_Design direction: Instrument Precision. Signature: the Course Line. If a screen ever feels like it needs decoration to look finished, the answer is more whitespace and more real information — not more design._
