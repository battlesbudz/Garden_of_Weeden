import { ArrowRight, MapPin, Sprout } from "lucide-react";
import { Link } from "wouter";
import farmTeaserImage from "@assets/farm_rows_early_blue_mulch.jpg";

export default function HomeFarmTeaserSection() {
  return (
    <section className="bg-parchment py-20 text-battles-black">
      <div className="mx-auto grid max-w-7xl gap-12 px-4 sm:px-6 lg:grid-cols-2 lg:items-center lg:px-8">

        <div className="overflow-hidden rounded-xl shadow-2xl">
          <img
            src={farmTeaserImage}
            alt="Garden of Weeden cannabis rows in early season — blue mulch, wide field, Buffalo area farm"
            className="h-80 w-full object-cover"
          />
        </div>

        <div>
          <p className="font-garden text-sm font-bold uppercase tracking-[0.24em] text-green-700">
            Farm to Flame
          </p>
          <h2 className="mt-3 font-enchanted text-5xl leading-tight text-black md:text-6xl">
            House-grown flower. Regional craft partners.
          </h2>
          <p className="mt-5 font-garden text-lg leading-relaxed text-black/80">
            Our branded flower comes from our own farm 15 miles south of Buffalo.
            Our wider menu brings in regional small farms and microbusinesses connected through the Cannabis Farmers Alliance.
          </p>

          <div className="mt-6 grid grid-cols-2 gap-3 font-garden text-sm font-semibold text-black/70">
            <div className="flex items-center gap-2 border-t-2 border-green-700/40 pt-3">
              <Sprout className="h-5 w-5 shrink-0 text-green-700" aria-hidden="true" />
              Own-farm flower
            </div>
            <div className="flex items-center gap-2 border-t-2 border-green-700/40 pt-3">
              <MapPin className="h-5 w-5 shrink-0 text-green-700" aria-hidden="true" />
              Buffalo microbusiness
            </div>
          </div>

          <Link
            href="/about"
            className="mt-8 inline-flex items-center gap-2 rounded-xl bg-black px-7 py-4 font-garden text-sm font-bold text-white transition hover:bg-green-900"
          >
            Read the Farm to Flame Story
            <ArrowRight className="h-4 w-4" aria-hidden="true" />
          </Link>
        </div>
      </div>
    </section>
  );
}
