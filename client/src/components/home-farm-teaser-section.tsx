import { ArrowRight, MapPin, Sprout } from "lucide-react";
import { Link } from "wouter";
import fieldRowsImage from "@assets/AISelect_20251103_131607_Instagram_1762194447870.jpg";

export default function HomeFarmTeaserSection() {
  return (
    <section className="bg-parchment py-16 text-battles-black">
      <div className="mx-auto grid max-w-7xl gap-8 px-4 sm:px-6 lg:grid-cols-[0.95fr_1.05fr] lg:items-center lg:px-8">
        <div className="overflow-hidden border border-black/10 bg-battles-black">
          <img
            src={fieldRowsImage}
            alt="Garden of Weeden cannabis farm rows near Buffalo"
            className="h-72 w-full object-cover opacity-90"
          />
        </div>

        <div>
          <p className="font-garden text-sm font-bold uppercase tracking-[0.24em] text-green-800">Farm to Flame</p>
          <h2 className="mt-4 font-enchanted text-5xl leading-none text-battles-black md:text-7xl">
            House-grown flower. Regional craft partners.
          </h2>
          <p className="mt-5 max-w-2xl font-garden text-lg leading-relaxed text-black/75">
            Garden of Weeden branded flower can come from the company's own farm 15 miles south of Buffalo. The wider menu brings in regional small farms and microbusinesses they know through the Cannabis Farmers Alliance.
          </p>

          <div className="mt-7 grid gap-3 font-garden text-sm font-semibold text-black/75 sm:grid-cols-2">
            <div className="flex items-center gap-2 border-t border-black/15 pt-3">
              <Sprout className="h-5 w-5 text-green-800" aria-hidden="true" />
              Own-farm Garden of Weeden flower
            </div>
            <div className="flex items-center gap-2 border-t border-black/15 pt-3">
              <MapPin className="h-5 w-5 text-green-800" aria-hidden="true" />
              Buffalo-area microbusiness
            </div>
          </div>

          <Link
            href="/about"
            className="mt-8 inline-flex items-center justify-center rounded-xl bg-battles-black px-7 py-4 font-garden text-sm font-bold text-white transition hover:bg-green-900"
          >
            Read the Farm to Flame Story
            <ArrowRight className="ml-2 h-4 w-4" aria-hidden="true" />
          </Link>
        </div>
      </div>
    </section>
  );
}
