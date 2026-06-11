import { CalendarDays, Handshake, Leaf, MapPin, Phone, ShoppingBag, Sprout, Users } from "lucide-react";
import { Link } from "wouter";
import Navigation from "@/components/navigation";
import Footer from "@/components/footer";
import SEOHead from "@/components/seo/SEOHead";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { getCanonicalUrl } from "@/utils/seo";
import flowerCloseupImage from "@assets/AISelect_20251103_131526_Instagram_1762194447917.jpg";
import dryingRacksImage from "@assets/AISelect_20251103_131504_Instagram_1762194447955.jpg";

const trustPoints = [
  {
    icon: Sprout,
    title: "Own-farm flower",
    text: "Garden of Weeden branded flower and pre-rolls can come from the company's own farm 15 miles south of Buffalo.",
  },
  {
    icon: Handshake,
    title: "Regional relationships",
    text: "The wider menu supports small farms, microbusinesses, and producers in Central and Western New York.",
  },
  {
    icon: Leaf,
    title: "Cannabis Farmers Alliance",
    text: "Producer relationships are connected through the Cannabis Farmers Alliance and local craft cannabis community.",
  },
];

const offerings = [
  {
    icon: ShoppingBag,
    title: "Dispensary menu",
    text: "Current flower, pre-rolls, vapes, edibles, beverages, and regional craft drops.",
  },
  {
    icon: Users,
    title: "Forbidden Fruit lounge",
    text: "An on-site cannabis consumption lounge for relaxing, events, and community experiences.",
  },
  {
    icon: CalendarDays,
    title: "Mobile weed bar",
    text: "A bookable Garden of Weeden service for parties, private gatherings, and events.",
  },
];

export default function About() {
  return (
    <div className="min-h-screen overflow-x-hidden bg-battles-black">
      <SEOHead
        title="About Garden of Weeden - Farm to Flame Cannabis"
        description="Learn how Garden of Weeden brings Farm to Flame cannabis to Buffalo through its own farm, regional small growers, Cannabis Farmers Alliance relationships, the Forbidden Fruit lounge, and mobile weed bar bookings."
        keywords={[
          "Garden of Weeden",
          "Farm to Flame",
          "Cannabis Farmers Alliance",
          "Buffalo cannabis microbusiness",
          "local cannabis farmers",
          "Forbidden Fruit lounge",
          "mobile weed bar",
          "Western New York cannabis",
          "craft cannabis Buffalo"
        ]}
        canonicalUrl={getCanonicalUrl("/about")}
        ogType="website"
      />
      <Navigation />

      <main className="pt-[calc(var(--hopeline-banner-height,40px)+64px)]">
        <section className="relative overflow-hidden bg-parchment text-battles-black">
          <div className="absolute inset-x-0 top-0 h-3 bg-green-800" />
          <div className="mx-auto grid max-w-7xl gap-10 px-4 py-16 sm:px-6 lg:grid-cols-[0.92fr_1.08fr] lg:items-center lg:px-8 lg:py-20">
            <div>
              <p className="font-garden text-sm font-bold uppercase tracking-[0.28em] text-green-800">
                About Garden of Weeden
              </p>
              <h1 className="mt-5 max-w-4xl font-enchanted text-6xl leading-[0.9] text-battles-black md:text-8xl">
                The story behind the Garden.
              </h1>
              <p className="mt-7 max-w-2xl font-garden text-xl font-semibold leading-relaxed text-black/75">
                Garden of Weeden is a Buffalo-area cannabis microbusiness built around its own farm, regional craft relationships, the Forbidden Fruit lounge, and a mobile weed bar for private events.
              </p>

              <div className="mt-8 grid gap-3 border-y border-black/15 py-5 font-garden text-sm font-semibold text-black/70 sm:grid-cols-3">
                <span>Farm 15 miles south of Buffalo</span>
                <span>Cannabis Farmers Alliance ties</span>
                <span>Off-street parking</span>
              </div>

              <div className="mt-8 flex flex-col gap-3 sm:flex-row">
                <Link
                  href="/shop"
                  className="inline-flex items-center justify-center rounded-xl bg-battles-black px-5 py-3 font-garden text-sm font-bold text-white transition hover:bg-green-900"
                >
                  <ShoppingBag className="mr-2 h-4 w-4" aria-hidden="true" />
                  View Menu
                </Link>
                <a
                  href="tel:+17164201591"
                  className="inline-flex items-center justify-center rounded-xl border-2 border-battles-black px-5 py-3 font-garden text-sm font-bold text-battles-black transition hover:bg-white"
                >
                  <Phone className="mr-2 h-4 w-4" aria-hidden="true" />
                  Book a Private Event
                </a>
              </div>
            </div>

            <div>
              <div className="grid grid-cols-[0.78fr_1fr] gap-3">
                <div className="space-y-3 pt-10">
                  <img
                    src={flowerCloseupImage}
                    alt="Craft cannabis flower at Garden of Weeden"
                    className="h-44 w-full border border-black/10 object-cover shadow-xl"
                  />
                  <div className="border border-green-800/25 bg-white/55 p-5 shadow-xl">
                    <p className="font-storybook text-3xl leading-none text-battles-black">Why it matters</p>
                    <p className="mt-3 font-garden text-sm leading-relaxed text-black/70">
                      Their name-brand flower can be grown by the same company selling it.
                    </p>
                  </div>
                </div>
                <img
                  src={dryingRacksImage}
                  alt="Small-batch cannabis production at Garden of Weeden"
                  className="h-[430px] w-full border border-black/10 object-cover shadow-2xl"
                />
              </div>
            </div>
          </div>
        </section>

        <section className="bg-battles-black py-16 text-white">
          <div className="mx-auto grid max-w-7xl gap-10 px-4 sm:px-6 lg:grid-cols-[0.9fr_1.1fr] lg:items-center lg:px-8">
            <div>
              <p className="font-garden text-sm font-bold uppercase tracking-[0.24em] text-green-400">
                What Farm to Flame means
              </p>
              <h2 className="mt-4 font-enchanted text-5xl leading-none text-parchment md:text-7xl">
                The product story starts closer to home.
              </h2>
              <p className="mt-6 font-garden text-lg leading-relaxed text-gray-300">
                Farm to Flame means Garden of Weeden can connect the sale, the staff knowledge, and the grower story. Their own branded flower can move from their farm 15 miles south of Buffalo to their own dispensary and lounge, without a mystery middleman between the grow and the customer.
              </p>
            </div>

            <div className="grid gap-4">
              {trustPoints.map((point) => {
                const Icon = point.icon;
                return (
                  <div key={point.title} className="grid grid-cols-[auto_1fr] gap-4 border-t border-white/10 pt-5">
                    <Icon className="mt-1 h-6 w-6 text-green-400" aria-hidden="true" />
                    <div>
                      <h3 className="font-storybook text-2xl text-parchment">{point.title}</h3>
                      <p className="mt-1 font-garden text-sm leading-relaxed text-gray-300">{point.text}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        <section className="bg-midnight-grove/25 py-16 text-white">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="grid gap-8 lg:grid-cols-[0.8fr_1.2fr] lg:items-start">
              <div>
                <p className="font-garden text-sm font-semibold uppercase tracking-[0.24em] text-green-400">
                  What you can do here
                </p>
                <h2 className="mt-4 font-enchanted text-5xl leading-none text-parchment md:text-7xl">
                  Shop, lounge, and book Garden of Weeden.
                </h2>
              </div>
              <div className="grid gap-4 md:grid-cols-3">
                {offerings.map((offering) => {
                  const Icon = offering.icon;
                  return (
                    <div key={offering.title} className="border border-white/10 bg-black/25 p-5">
                      <Icon className="h-7 w-7 text-green-400" aria-hidden="true" />
                      <h3 className="mt-4 font-storybook text-2xl text-parchment">{offering.title}</h3>
                      <p className="mt-2 font-garden text-sm leading-relaxed text-gray-300">{offering.text}</p>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </section>

        <section className="bg-battles-black py-16 text-white">
          <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
            <div className="max-w-3xl">
              <p className="font-garden text-sm font-semibold uppercase tracking-[0.24em] text-green-400">
                Farm to Flame questions
              </p>
              <h2 className="mt-4 font-enchanted text-5xl leading-none text-parchment md:text-7xl">
                What guests usually ask before visiting.
              </h2>
              <p className="mt-5 font-garden text-base leading-relaxed text-gray-300">
                These answers cover the farm, the menu, the lounge, and private event booking before you stop in.
              </p>
              <Accordion type="single" collapsible className="mt-8 border-t border-white/10">
                <AccordionItem value="farm-to-flame" className="border-white/10">
                  <AccordionTrigger className="font-garden text-left text-lg font-bold text-parchment hover:text-green-300 hover:no-underline">
                    What does Farm to Flame mean?
                  </AccordionTrigger>
                  <AccordionContent className="font-garden text-sm leading-relaxed text-gray-300">
                    It is Garden of Weeden's way of describing cannabis with a closer local source: house-grown branded flower from their own farm, plus regional craft products from growers and producers they know.
                  </AccordionContent>
                </AccordionItem>
                <AccordionItem value="microbusiness" className="border-white/10">
                  <AccordionTrigger className="font-garden text-left text-lg font-bold text-parchment hover:text-green-300 hover:no-underline">
                    What is a cannabis microbusiness?
                  </AccordionTrigger>
                  <AccordionContent className="font-garden text-sm leading-relaxed text-gray-300">
                    For Garden of Weeden, it means the business is not only a dispensary. It can connect cultivation, production, retail, and on-site consumption into one local cannabis experience.
                  </AccordionContent>
                </AccordionItem>
                <AccordionItem value="menu-source" className="border-white/10">
                  <AccordionTrigger className="font-garden text-left text-lg font-bold text-parchment hover:text-green-300 hover:no-underline">
                    Where does the menu come from?
                  </AccordionTrigger>
                  <AccordionContent className="font-garden text-sm leading-relaxed text-gray-300">
                    Garden of Weeden branded products can come from their own farm. The broader menu includes products from regional small farms, microbusinesses, and craft producers connected through relationships like the Cannabis Farmers Alliance.
                  </AccordionContent>
                </AccordionItem>
                <AccordionItem value="lounge" className="border-white/10">
                  <AccordionTrigger className="font-garden text-left text-lg font-bold text-parchment hover:text-green-300 hover:no-underline">
                    What is the Forbidden Fruit lounge?
                  </AccordionTrigger>
                  <AccordionContent className="font-garden text-sm leading-relaxed text-gray-300">
                    The Forbidden Fruit lounge is Garden of Weeden's on-site cannabis consumption lounge for guests, events, and community experiences.
                  </AccordionContent>
                </AccordionItem>
                <AccordionItem value="booking" className="border-white/10">
                  <AccordionTrigger className="font-garden text-left text-lg font-bold text-parchment hover:text-green-300 hover:no-underline">
                    How do I book the mobile weed bar?
                  </AccordionTrigger>
                  <AccordionContent className="font-garden text-sm leading-relaxed text-gray-300">
                    Contact Garden of Weeden at <a className="font-bold text-green-300" href="tel:+17164201591">(716) 420-1591</a> for private event scheduling.
                  </AccordionContent>
                </AccordionItem>
              </Accordion>
            </div>
          </div>
        </section>

        <section className="bg-green-950/30 py-12 text-white">
          <div className="mx-auto flex max-w-7xl flex-col gap-5 px-4 sm:px-6 lg:flex-row lg:items-center lg:justify-between lg:px-8">
            <div>
              <p className="font-garden text-sm font-semibold uppercase tracking-[0.22em] text-green-400">
                Visit Garden of Weeden
              </p>
              <h2 className="mt-2 font-storybook text-3xl text-parchment">
                Buffalo-area craft cannabis with off-street parking.
              </h2>
              <p className="mt-2 font-garden text-sm leading-relaxed text-gray-300">
                Shop the menu, ask the team about current Farm to Flame products, or contact Garden of Weeden to book the mobile weed bar.
              </p>
            </div>
            <div className="flex flex-col gap-3 sm:flex-row">
              <Link
                href="/shop"
                className="inline-flex items-center justify-center rounded-xl bg-green-700 px-6 py-3 font-garden text-sm font-bold text-white transition hover:bg-green-800"
              >
                <ShoppingBag className="mr-2 h-4 w-4" aria-hidden="true" />
                View Menu
              </Link>
              <a
                href="tel:+17164201591"
                className="inline-flex items-center justify-center rounded-xl border border-white/25 px-6 py-3 font-garden text-sm font-bold text-white transition hover:border-green-400 hover:text-green-300"
              >
                <MapPin className="mr-2 h-4 w-4" aria-hidden="true" />
                Book a Private Event
              </a>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
