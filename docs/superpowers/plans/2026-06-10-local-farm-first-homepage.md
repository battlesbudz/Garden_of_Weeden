# Local Farm First Homepage Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Rebuild the Garden of Weeden homepage into a Local Farm First / Farm to Flame brand experience that builds trust first, supports lounge and event inquiries second, and keeps the All Leaves menu available without making ecommerce the main story.

**Architecture:** Reuse the existing React/Vite homepage composition in `client/src/pages/home.tsx`, but replace the current generic section flow with focused homepage sections. Keep shared dependencies unchanged: Wouter links, Framer Motion with `useReducedMotion`, lucide icons, existing image assets, `SEOHead`, `Navigation`, `Footer`, and existing site settings hooks where useful.

**Tech Stack:** React 18, Vite, TypeScript, Tailwind CSS, Wouter, Framer Motion, lucide-react, TanStack Query.

---

## File Structure

- Modify: `client/src/pages/home.tsx`
  - Owns homepage section order and SEO metadata.
- Modify: `client/src/components/hero-section.tsx`
  - Rebuilds first viewport around Local Farm First / Farm to Flame positioning.
- Create: `client/src/components/local-farm-network-section.tsx`
  - Main proof section for GOW farm, no-middleman branded flower, partner farms, microbusinesses, and Cannabis Farmers Alliance.
- Modify: `client/src/components/brand-story-section.tsx`
  - Reframes "What Farm to Flame Means" around customer benefit and budtender knowledge.
- Modify: `client/src/components/featured-products-section.tsx`
  - Converts current product preview into a secondary Current Craft Menu bridge.
- Create: `client/src/components/lounge-events-section.tsx`
  - Replaces broad service/benefit grid with Forbidden Fruit lounge, private events, bookable mobile weed bar inquiries, and Jennifer contact path.
- Create: `client/src/components/on-the-route-section.tsx`
  - Adds subtle cyclist/local route stop signal.
- Modify: `client/src/components/newsletter-section.tsx`
  - Reframes community/events/Instagram section around ongoing Farm to Flame updates.
- Modify: `client/src/utils/seo.ts`
  - Only if needed to align default homepage SEO values with Local Farm First copy.

## Task 1: Rebuild Hero Around Local Farm First

**Files:**
- Modify: `client/src/components/hero-section.tsx`

- [ ] **Step 1: Replace hero copy defaults**

Use these defaults inside `HeroSection`:

```ts
const heroTitle = settings?.heroTitle || "Garden of Weeden";
const heroTagline = settings?.heroTagline || "Farm to Flame Cannabis";
const heroSubtitle =
  settings?.heroSubtitle ||
  "Local, small-batch cannabis from our farm 15 miles south of Buffalo and small craft growers across Central and Western NY.";
const heroShopButtonText = settings?.heroShopButtonText || "Explore Farm to Flame";
const heroStoryButtonText = settings?.heroStoryButtonText || "View Current Menu";
const heroVeteranBadge = settings?.heroVeteranBadge || "Local Farm First";
```

- [ ] **Step 2: Change hero primary CTA target**

Set the primary CTA to scroll or link to the farm network section:

```tsx
<a href="#local-farm-network" className="...">
  <Leaf className="h-5 w-5" aria-hidden="true" />
  <span>{heroShopButtonText}</span>
  <ArrowRight className="h-5 w-5 group-hover:translate-x-1 transition-transform" aria-hidden="true" />
</a>
```

Set the secondary CTA to `/shop`:

```tsx
<Link href="/shop" className="...">
  {heroStoryButtonText}
</Link>
```

- [ ] **Step 3: Add a lower-priority visit/events link**

Add a third subtle link below the two main CTAs:

```tsx
<a
  href="#lounge-events"
  className="font-garden text-sm font-semibold text-parchment/80 underline decoration-green-500/50 underline-offset-4 hover:text-green-300"
>
  Plan a lounge visit or private event
</a>
```

- [ ] **Step 4: Tighten proof points**

Replace the four hero proof labels with:

```ts
const pillar1Title = settings?.pillar1Title || "Own Farm, No Middleman";
const pillar2Title = settings?.pillar2Title || "15 Miles South of Buffalo";
const pillar3Title = settings?.pillar3Title || "Cannabis Farmers Alliance";
const locationText = settings?.locationText || "NYS licensed microbusiness, dispensary, and on-site consumption lounge";
```

- [ ] **Step 5: Run production build**

Run:

```powershell
npm.cmd run build
```

Expected: build succeeds.

- [ ] **Step 6: Commit**

```powershell
git add client/src/components/hero-section.tsx
git commit -m "feat: refocus homepage hero on farm to flame"
```

## Task 2: Add Local Farm Network Section

**Files:**
- Create: `client/src/components/local-farm-network-section.tsx`
- Modify: `client/src/pages/home.tsx`

- [ ] **Step 1: Create section component**

Create `client/src/components/local-farm-network-section.tsx` with:

```tsx
import { motion, useReducedMotion } from "framer-motion";
import { Handshake, Leaf, MapPin, Sprout, Users } from "lucide-react";
import fieldRowsImage from "@assets/AISelect_20251103_131607_Instagram_1762194447870.jpg";
import flowerCloseupImage from "@assets/AISelect_20251103_131526_Instagram_1762194447917.jpg";

const networkPoints = [
  {
    icon: Sprout,
    title: "Grown by Garden of Weeden",
    text: "Our name-brand flower and pre-rolls come from our own farm 15 miles south of Buffalo.",
  },
  {
    icon: Handshake,
    title: "No Middleman",
    text: "When you buy a Garden of Weeden joint, you are buying cannabis grown by the same microbusiness selling it.",
  },
  {
    icon: Users,
    title: "Local Farm Partners",
    text: "Other products come from small craft growers, microbusinesses, and regional farms we know.",
  },
  {
    icon: Leaf,
    title: "Cannabis Farmers Alliance",
    text: "Our farm relationships include producers connected through the Cannabis Farmers Alliance.",
  },
];

export default function LocalFarmNetworkSection() {
  const prefersReducedMotion = useReducedMotion();

  return (
    <section id="local-farm-network" className="relative overflow-hidden bg-battles-black py-24 text-white">
      <div className="absolute inset-0 bg-gradient-to-b from-battles-black via-midnight-grove/25 to-battles-black" />
      <div className="relative z-10 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid gap-12 lg:grid-cols-[0.9fr_1.1fr] lg:items-center">
          <motion.div
            initial={prefersReducedMotion ? { opacity: 1 } : { opacity: 0, y: 28 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: prefersReducedMotion ? 0 : 0.7 }}
          >
            <p className="font-garden text-sm font-semibold uppercase tracking-[0.24em] text-green-400">
              Local Farm Network
            </p>
            <h2 className="mt-4 font-enchanted text-4xl text-parchment drop-shadow-[0_4px_12px_rgba(0,0,0,0.9)] md:text-6xl">
              Own farm. Local partners. Real relationships.
            </h2>
            <p className="mt-6 font-garden text-lg leading-relaxed text-gray-300">
              Garden of Weeden is a NYS licensed microbusiness with a farm 15 miles south of Buffalo.
              Our branded flower starts with our own cultivation, while our wider menu supports small
              family farms, women-owned, veteran-owned, minority-owned, and microbusiness producers
              across Central and Western NY.
            </p>
            <div className="mt-8 flex items-center gap-3 rounded-xl border border-green-500/25 bg-midnight-grove/45 p-4">
              <MapPin className="h-5 w-5 shrink-0 text-green-400" aria-hidden="true" />
              <p className="font-garden text-sm text-gray-300">
                Farm to Flame means customers can trace the story from regional soil to the product they take home.
              </p>
            </div>
          </motion.div>

          <div className="grid gap-5 sm:grid-cols-2">
            {networkPoints.map((point, index) => {
              const Icon = point.icon;
              return (
                <motion.div
                  key={point.title}
                  className="rounded-xl border border-green-500/20 bg-midnight-grove/35 p-6 shadow-xl shadow-black/20"
                  initial={prefersReducedMotion ? { opacity: 1 } : { opacity: 0, y: 24 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-80px" }}
                  transition={{ duration: prefersReducedMotion ? 0 : 0.55, delay: prefersReducedMotion ? 0 : index * 0.08 }}
                >
                  <Icon className="mb-4 h-7 w-7 text-green-400" aria-hidden="true" />
                  <h3 className="font-storybook text-xl text-parchment">{point.title}</h3>
                  <p className="mt-3 font-garden text-sm leading-relaxed text-gray-400">{point.text}</p>
                </motion.div>
              );
            })}
          </div>
        </div>

        <div className="mt-14 grid gap-5 md:grid-cols-2">
          <img src={fieldRowsImage} alt="Garden of Weeden farm rows near Buffalo" className="h-72 w-full rounded-xl object-cover" />
          <img src={flowerCloseupImage} alt="Garden of Weeden craft cannabis flower" className="h-72 w-full rounded-xl object-cover" />
        </div>
      </div>
    </section>
  );
}
```

- [ ] **Step 2: Import and place the section**

In `client/src/pages/home.tsx`, import and place it directly after `SocialProofSection`:

```tsx
import LocalFarmNetworkSection from "@/components/local-farm-network-section";
```

```tsx
<SocialProofSection />
<LocalFarmNetworkSection />
```

- [ ] **Step 3: Run build**

```powershell
npm.cmd run build
```

Expected: build succeeds.

- [ ] **Step 4: Commit**

```powershell
git add client/src/pages/home.tsx client/src/components/local-farm-network-section.tsx
git commit -m "feat: add local farm network homepage section"
```

## Task 3: Reframe Farm To Flame Explanation

**Files:**
- Modify: `client/src/components/brand-story-section.tsx`

- [ ] **Step 1: Update default copy**

Change defaults:

```ts
const storyTitle = settings?.storyTitle || "What Farm to Flame Means";
const storyText =
  settings?.storyText ||
  "Farm to Flame is not a slogan. Garden of Weeden branded flower and pre-rolls are grown by our own farm 15 miles south of Buffalo, and our partner products come from local growers and microbusinesses we know through Cannabis Farmers Alliance relationships.";
const storyButton1Text = settings?.storyButton1Text || "Meet the Farm Story";
const storyButton2Text = settings?.storyButton2Text || "View Current Menu";
```

- [ ] **Step 2: Replace three mini cards**

Use:

```tsx
const storyPillars = [
  { icon: Leaf, label: "Grower-known products" },
  { icon: Award, label: "Budtender guidance" },
  { icon: Users, label: "Regional farm relationships" },
];
```

Map `storyPillars` instead of hardcoded three cards.

- [ ] **Step 3: Keep CTAs**

Keep first CTA to `/about` and second CTA to `/shop`.

- [ ] **Step 4: Run build and commit**

```powershell
npm.cmd run build
git add client/src/components/brand-story-section.tsx
git commit -m "feat: explain farm to flame customer benefit"
```

## Task 4: Convert Featured Products Into Current Craft Menu Bridge

**Files:**
- Modify: `client/src/components/featured-products-section.tsx`

- [ ] **Step 1: Update section defaults**

Use:

```ts
const featuredTitle = settings?.featuredTitle || "Current Craft Menu";
const featuredSubtitle =
  settings?.featuredSubtitle ||
  "Availability changes with harvests, local releases, and partner farm drops. Browse today's menu when you are ready.";
const featuredBadgeText = settings?.featuredBadgeText || "Menu changes with the harvest";
const featuredCtaText = settings?.featuredCtaText || "View Current Menu";
const featuredShippingNote =
  settings?.featuredShippingNote ||
  "Garden of Weeden branded flower comes from our farm. Partner products come from regional farms and microbusinesses we know.";
```

- [ ] **Step 2: Keep product cards secondary**

Keep the current cards, but ensure no card CTA says "Add to cart" in this homepage section. The only CTA should remain the section-level `/shop` link.

- [ ] **Step 3: Run build and commit**

```powershell
npm.cmd run build
git add client/src/components/featured-products-section.tsx
git commit -m "feat: make homepage menu path secondary"
```

## Task 5: Add Lounge And Events Section

**Files:**
- Create: `client/src/components/lounge-events-section.tsx`
- Modify: `client/src/pages/home.tsx`

- [ ] **Step 1: Create section component**

Create `client/src/components/lounge-events-section.tsx`:

```tsx
import { motion, useReducedMotion } from "framer-motion";
import { CalendarDays, GlassWater, Phone, Sparkles } from "lucide-react";

const eventItems = [
  "Forbidden Fruit on-site consumption lounge",
  "Fun and educational cannabis events",
  "Private events and lounge bookings",
  "Bookable mobile weed bar experience for parties and private events",
];

export default function LoungeEventsSection() {
  const prefersReducedMotion = useReducedMotion();

  return (
    <section id="lounge-events" className="relative overflow-hidden bg-battles-black py-24 text-white">
      <div className="absolute inset-0 bg-gradient-to-b from-battles-black via-green-950/20 to-battles-black" />
      <div className="relative z-10 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid gap-10 lg:grid-cols-[1.05fr_0.95fr] lg:items-center">
          <motion.div
            initial={prefersReducedMotion ? { opacity: 1 } : { opacity: 0, y: 28 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: prefersReducedMotion ? 0 : 0.7 }}
          >
            <p className="font-garden text-sm font-semibold uppercase tracking-[0.24em] text-green-400">
              Forbidden Fruit Lounge
            </p>
            <h2 className="mt-4 font-enchanted text-4xl text-parchment md:text-6xl">
              Experience the farm story together.
            </h2>
            <p className="mt-6 font-garden text-lg leading-relaxed text-gray-300">
              The lounge gives guests a place to relax, learn, and connect around craft cannabis.
              From in-store events to private gatherings, Garden of Weeden can make the Farm to Flame
              experience part of the occasion.
            </p>
            <a
              href="tel:+17164201591"
              className="mt-8 inline-flex items-center rounded-xl bg-green-700 px-8 py-4 font-garden font-bold text-white shadow-xl transition hover:bg-green-800"
            >
              <Phone className="mr-2 h-5 w-5" aria-hidden="true" />
              Contact Jennifer: (716) 420-1591
            </a>
          </motion.div>

          <motion.div
            className="rounded-2xl border border-green-500/25 bg-midnight-grove/45 p-7"
            initial={prefersReducedMotion ? { opacity: 1 } : { opacity: 0, y: 28 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: prefersReducedMotion ? 0 : 0.7, delay: prefersReducedMotion ? 0 : 0.1 }}
          >
            <div className="mb-6 flex items-center gap-3">
              <GlassWater className="h-7 w-7 text-green-400" aria-hidden="true" />
              <h3 className="font-storybook text-2xl text-parchment">Lounge, events, and mobile weed bar</h3>
            </div>
            <ul className="space-y-4">
              {eventItems.map((item) => (
                <li key={item} className="flex gap-3 font-garden text-gray-300">
                  <Sparkles className="mt-1 h-4 w-4 shrink-0 text-green-400" aria-hidden="true" />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
            <div className="mt-8 rounded-xl border border-green-500/20 bg-black/25 p-4">
              <CalendarDays className="mb-2 h-5 w-5 text-green-400" aria-hidden="true" />
              <p className="font-garden text-sm text-gray-400">
                Check the in-store events calendar or Instagram for upcoming community and education events.
              </p>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
```

- [ ] **Step 2: Replace old services placement**

In `home.tsx`, import:

```tsx
import LoungeEventsSection from "@/components/lounge-events-section";
```

Replace `<ServicesSection />` with:

```tsx
<LoungeEventsSection />
```

Leave `ServicesSection` file in place for now to avoid unrelated route breakage.

- [ ] **Step 3: Run build and commit**

```powershell
npm.cmd run build
git add client/src/pages/home.tsx client/src/components/lounge-events-section.tsx
git commit -m "feat: add lounge and events homepage section"
```

## Task 6: Add Subtle On The Route Section

**Files:**
- Create: `client/src/components/on-the-route-section.tsx`
- Modify: `client/src/pages/home.tsx`

- [ ] **Step 1: Create route section**

Create `client/src/components/on-the-route-section.tsx`:

```tsx
import { Bike, MapPin } from "lucide-react";

export default function OnTheRouteSection() {
  return (
    <section id="on-the-route" className="bg-midnight-grove/20 py-14 text-white">
      <div className="mx-auto flex max-w-7xl flex-col gap-5 px-4 sm:px-6 lg:flex-row lg:items-center lg:justify-between lg:px-8">
        <div>
          <p className="font-garden text-sm font-semibold uppercase tracking-[0.22em] text-green-400">
            On the route
          </p>
          <h2 className="mt-2 font-storybook text-3xl text-parchment">
            Rooted in the neighborhood.
          </h2>
          <p className="mt-3 max-w-2xl font-garden text-gray-300">
            Passing through by car, on foot, or along the local bike route, Garden of Weeden is an easy
            stop for Farm to Flame products, lounge events, and local cannabis conversations.
          </p>
        </div>
        <div className="flex items-center gap-4 rounded-xl border border-green-500/20 bg-black/25 px-5 py-4">
          <Bike className="h-6 w-6 text-green-400" aria-hidden="true" />
          <div className="font-garden text-sm text-gray-300">
            <p className="font-semibold text-parchment">Bike-route friendly stop</p>
            <p className="flex items-center gap-1 text-gray-400">
              <MapPin className="h-3.5 w-3.5" aria-hidden="true" />
              Buffalo and Western NY rooted
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
```

- [ ] **Step 2: Place before newsletter**

In `home.tsx`:

```tsx
import OnTheRouteSection from "@/components/on-the-route-section";
```

Place:

```tsx
<OnTheRouteSection />
<NewsletterSection />
```

- [ ] **Step 3: Run build and commit**

```powershell
npm.cmd run build
git add client/src/pages/home.tsx client/src/components/on-the-route-section.tsx
git commit -m "feat: add subtle route stop homepage section"
```

## Task 7: Reorder Homepage And Remove Repetitive Sections

**Files:**
- Modify: `client/src/pages/home.tsx`

- [ ] **Step 1: Set final section order**

Use this order:

```tsx
<Navigation />
<HeroSection />
<SocialProofSection />
<LocalFarmNetworkSection />
<BrandStorySection />
<FeaturedProductsSection />
<LoungeEventsSection />
<OnTheRouteSection />
<NewsletterSection />
<Footer />
```

Remove `UrgencyBanner` and `ServicesSection` imports/usages from `home.tsx`. Leave their files in the repo.

- [ ] **Step 2: Update homepage SEO**

In `home.tsx`, use:

```tsx
description="Garden of Weeden is a NYS licensed Farm to Flame cannabis microbusiness near Buffalo, NY, offering local small-batch flower from its own farm and regional craft growers connected through Cannabis Farmers Alliance."
```

Ensure keywords include:

```ts
"Cannabis Farmers Alliance",
"Farm to Flame cannabis",
"Buffalo cannabis microbusiness",
"local cannabis farmers",
"Garden of Weeden farm",
"Forbidden Fruit lounge"
```

- [ ] **Step 3: Run build and commit**

```powershell
npm.cmd run build
git add client/src/pages/home.tsx
git commit -m "feat: finalize local farm first homepage flow"
```

## Task 8: Browser Verification And Polish

**Files:**
- Modify: `client/src/pages/home.tsx` only if section order or SEO needs correction during browser QA.
- Modify: `client/src/components/hero-section.tsx` only if first-viewport copy, CTA stacking, or contrast fails browser QA.
- Modify: `client/src/components/local-farm-network-section.tsx` only if farm network content, card layout, or mobile stacking fails browser QA.
- Modify: `client/src/components/brand-story-section.tsx` only if Farm to Flame explanation content or CTA layout fails browser QA.
- Modify: `client/src/components/featured-products-section.tsx` only if menu bridge hierarchy or card layout fails browser QA.
- Modify: `client/src/components/lounge-events-section.tsx` only if lounge/event content, Jennifer contact CTA, or mobile layout fails browser QA.
- Modify: `client/src/components/on-the-route-section.tsx` only if the cyclist signal is too dominant or mobile layout fails browser QA.
- Modify: `client/src/components/newsletter-section.tsx` only if community/events/Instagram copy or form layout fails browser QA.

- [ ] **Step 1: Start dev server**

```powershell
npm.cmd run dev
```

Expected: app serves locally.

- [ ] **Step 2: Open homepage**

Open local app in browser and verify:

- First viewport says Garden of Weeden and Farm to Flame Cannabis.
- Primary CTA points into farm story, not `/shop`.
- Menu path is visible but secondary.
- Cannabis Farmers Alliance appears on homepage.
- No-middleman GOW-branded flower story appears on homepage.
- Forbidden Fruit lounge/private event path is visible.
- Jennifer phone number appears in the lounge/event section.
- The cyclist signal is subtle and not dominant.

- [ ] **Step 3: Mobile verification**

Check a mobile viewport and verify:

- No text overlap.
- Hero CTAs stack cleanly.
- Farm network cards do not overflow.
- Route section stays compact.
- Footer remains reachable.

- [ ] **Step 4: Run final production build**

```powershell
npm.cmd run build
```

Expected: build succeeds.

- [ ] **Step 5: Record known repo check limitation**

Run:

```powershell
npm.cmd run check
```

Expected: existing unrelated TypeScript errors may remain. Do not fix unrelated storage/auth/seed errors under this homepage plan.

- [ ] **Step 6: Commit verification polish**

If no code changes were needed:

```powershell
git status --short
```

If polish changes were made:

```powershell
git add client/src/pages/home.tsx client/src/components
git commit -m "fix: polish local farm homepage responsiveness"
```

## Self-Review

- Spec coverage: Each approved homepage section is represented by a task.
- Scope: Whole-site redesign is out of scope; homepage rebuild only.
- Ecommerce priority: All Leaves/menu is supported through `/shop`, not made primary.
- Compliance: No medical claims or guaranteed effects are introduced.
- Accessibility: Sections use semantic headings, readable CTA text, and fallback links remain through `/shop`.
