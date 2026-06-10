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
            stop for Farm to Flame products, lounge events, and local cannabis conversations, with off-street parking available.
          </p>
        </div>
        <div className="flex items-center gap-4 rounded-xl border border-green-500/20 bg-black/25 px-5 py-4">
          <Bike className="h-6 w-6 text-green-400" aria-hidden="true" />
          <div className="font-garden text-sm text-gray-300">
            <p className="font-semibold text-parchment">Bike-route friendly stop</p>
            <p className="flex items-center gap-1 text-gray-400">
              <MapPin className="h-3.5 w-3.5" aria-hidden="true" />
              Buffalo rooted with off-street parking
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
