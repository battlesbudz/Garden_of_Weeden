import { CalendarDays, Leaf, MapPin } from "lucide-react";
import { Link } from "wouter";

const actions = [
  {
    icon: CalendarDays,
    label: "Book an event",
    title: "Bring the mobile weed bar to your gathering.",
    text: "For private parties, events, and Forbidden Fruit lounge bookings, contact us for scheduling.",
    href: "tel:+17164201591",
    cta: "Contact for Events",
    accent: true,
  },
  {
    icon: Leaf,
    label: "Learn the story",
    title: "Understand Farm to Flame.",
    text: "Learn how Garden of Weeden connects its own farm, regional growers, and Buffalo-area cannabis experiences.",
    href: "/about",
    cta: "About Garden of Weeden",
    accent: false,
  },
  {
    icon: MapPin,
    label: "Visit Buffalo",
    title: "Find Garden of Weeden in person.",
    text: "Visit the Buffalo location, ask about current Farm to Flame products, and use the off-street parking on site.",
    href: "#contact",
    cta: "Contact Info",
    accent: false,
  },
];

export default function HomeActionRouterSection() {
  return (
    <section className="bg-green-950 py-14 text-white">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid gap-5 lg:grid-cols-3">
          {actions.map((action) => {
            const Icon = action.icon;

            const content = (
              <div
                className={`flex h-full flex-col rounded-xl border p-7 transition-all hover:scale-[1.01] ${
                  action.accent
                    ? "border-green-500/50 bg-black/40 hover:border-green-400"
                    : "border-white/20 bg-black/25 hover:border-white/50"
                }`}
              >
                <div className="flex items-center gap-3">
                  <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-green-600 text-white">
                    <Icon className="h-5 w-5" aria-hidden="true" />
                  </span>
                  <p className="font-garden text-xs font-bold uppercase tracking-[0.22em] text-green-300">
                    {action.label}
                  </p>
                </div>
                <h2 className="mt-5 font-storybook text-2xl font-semibold leading-snug text-white">
                  {action.title}
                </h2>
                <p className="mt-3 flex-1 font-garden text-sm leading-relaxed text-gray-100">
                  {action.text}
                </p>
                <span className="mt-6 inline-flex items-center gap-1 font-garden text-sm font-bold text-green-300">
                  {action.cta} →
                </span>
              </div>
            );

            return action.href.startsWith("/") ? (
              <Link key={action.label} href={action.href} className="block">
                {content}
              </Link>
            ) : (
              <a key={action.label} href={action.href} className="block">
                {content}
              </a>
            );
          })}
        </div>
      </div>
    </section>
  );
}
