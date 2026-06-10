import { ExternalLink, Leaf } from "lucide-react";
import { Button } from "@/components/ui/button";

interface AllLeavesMenuProps {
  menuUrl: string;
}

export default function AllLeavesMenu({ menuUrl }: AllLeavesMenuProps) {
  return (
    <section
      className="mx-auto w-full max-w-7xl px-4 pt-36 pb-16 sm:px-6 lg:px-8"
      aria-labelledby="all-leaves-menu-heading"
    >
      <div className="mb-8 flex flex-col gap-5 md:flex-row md:items-end md:justify-between">
        <div className="max-w-3xl">
          <div className="mb-3 inline-flex items-center gap-2 rounded-full border border-battles-gold/30 bg-battles-gold/10 px-4 py-2 text-sm font-semibold text-battles-gold">
            <Leaf className="h-4 w-4" aria-hidden="true" />
            Farm to Flame Menu
          </div>
          <h1 id="all-leaves-menu-heading" className="font-playfair text-4xl font-bold text-white sm:text-5xl">
            Current <span className="text-battles-gold">Cannabis Menu</span>
          </h1>
          <p className="mt-4 text-lg text-gray-300">
            Browse current Garden of Weeden availability through our All Leaves menu. Product availability,
            pricing, and pickup options are managed through the live menu provider.
          </p>
        </div>
        <Button
          asChild
          className="w-full bg-battles-gold text-black hover:bg-battles-gold/90 md:w-auto"
        >
          <a href={menuUrl} target="_blank" rel="noopener noreferrer">
            Open Menu
            <ExternalLink className="ml-2 h-4 w-4" aria-hidden="true" />
          </a>
        </Button>
      </div>

      <div className="overflow-hidden rounded-lg border border-battles-gold/25 bg-zinc-950 shadow-2xl shadow-black/30">
        <iframe
          title="Garden of Weeden All Leaves menu"
          src={menuUrl}
          className="h-[75vh] min-h-[720px] w-full bg-white"
          loading="lazy"
          referrerPolicy="strict-origin-when-cross-origin"
        />
      </div>
    </section>
  );
}
