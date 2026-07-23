## The Aim

The user is trying to a full fledge private jets booking company platform. The thing is user should be able to book a private flight, and pay either via paypal or the company account which is the recommended method for fast booking processing without signing up, just with email. So basically for new users they input the emails when they start filling the information and if the user is in the database it autofills the rest of the details. maybe we could allow for coupon we send to old users.

## Goal

- The website should be most premium, professional and coperate. The site should have everything listed in the list below.
  Stage 1: Trip request (before any price exists)

Trip type: one-way, round-trip, multi-leg
Departure/arrival airports — critical: your airport search must include general aviation fields and FBOs, not just IATA commercial codes. Half the value of private aviation is flying into airports airlines don't serve. Search by ICAO, city, and nearest-airport-to-address.
Date and time, plus a flexibility window (±2 hours often changes price meaningfully)
Passenger count — this alone determines aircraft category
Luggage: pieces plus oversized items (golf clubs, skis, instruments). Light jet baggage holds are genuinely small and this causes real problems.
Pets, if any — many operators restrict or surcharge

Stage 2: Aircraft preference

Category: turboprop / very light / light / midsize / super-midsize / heavy / ultra-long-range
Amenities that are dealbreakers: enclosed lavatory, wifi, standing cabin, flat bed
Optional: specific model or tail number for repeat customers

Stage 3: Passenger manifest (post-quote, pre-flight)

Full legal names exactly as on government ID
DOB, nationality, passport number and expiry for international legs
Passenger weights — not optional. Weight and balance calculations are mandatory on small aircraft.
Lead passenger phone and email

Stage 4: Ground and service

FBO selection at both ends
Ground transport to/from aircraft
Catering requests and dietary restrictions
Mobility or medical assistance

Stage 5: Commercial close

Quote acceptance with expiry timer (quotes go stale fast)
Charter agreement e-signature
Payment: wire/ACH as primary — card limits break on $40k bookings
Explicit cancellation policy acknowledgment (private charter cancellation terms are severe and disputes are common)

- The multi-step wizard pattern with a bottom sheet for airport/date selection maps cleanly onto Stage 1–2 here, and you can defer the manifest entirely until after the quote is accepted — which keeps the initial request to about four screens.

- Website should have a visual representation of the client flight path.

## Workflow

When the user provides reference screenshot(s), some CSS classes or style notes:

1. **Refer** to the `design.md` file at the project root. It is the de-facto authority for how this website looks — colors, typography, spacing, radii, shadows, motion and component anatomy all come from it. Read it before anything else. Reference screenshots and style notes inform structure and layout only; where a reference conflicts with `design.md`, `design.md` wins.
2. **Learn** the design and/or animation decisions, ideas and paradigms of the references by scrapping the DOM, getting the styles and javascripts that may affect the design and animations.
3. **Log** what you have learnt in a temporary md file so you can refer to throughout the implementation process.
4. **Generate** the website according to the users request and reference image.

5. **Screenshot** the rendered page using Puppeteer. If the page has distinct sections, capture those individually too.

6. **Compare** your screenshot against the reference image. '
   Check for mistmatches in:

- Spacing and padding (measure in px)
- Font sizes, weights, and line heights
- Colors (exact hex values)
- Alignment and positioning
- Border radii, shadows and effects
- Responsive behaviour
- Image/icon sizing and placement

7. **Fix** every mismatch found. Edit the HTML/Tailwind code.
8. **Re-screenshot** and compare again.
9. **Repeat** steps 4-6 until the result is within ~2-3px of the reference everywhere.

Do NOT stop after one pass. Always do at least 2 comparison rounds. Only stop when the user says so or when no visible difference remain.

## Technical Defaults

- Use Tailwind CSS via CDN
- Use placeholder images from `https://plachold.co/` when source images cannot be scrapped or aren't provided.
- Mobile-first responsive design.

## Rules

- This project will use Nextjs for both the frontend and backend in one concise codebase
- Do not make exact copies of references, only of design and animation decisions
- If the user provides CSS classes or style tokens, use them verbatim
- Keep code clean but don't over-abstract - inline Tailwind classes are fine
- When comparing screenshots, be specific about what's wrong (e.g, "heading is 32px but reference shows 35px", "gap between cards is 16px but should be 24px")
