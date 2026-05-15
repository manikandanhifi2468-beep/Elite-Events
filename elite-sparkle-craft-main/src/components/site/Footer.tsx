import { Facebook, Instagram, Sparkles, Youtube } from "lucide-react";

export function Footer() {
  return (
    <footer className="relative border-t border-border/60 mt-12">
      <div className="mx-auto max-w-7xl px-6 py-16 grid gap-10 md:grid-cols-4">
        <div className="md:col-span-2">
          <div className="flex items-center gap-2">
            <span className="grid h-9 w-9 place-items-center rounded-full gold-border">
              <Sparkles className="h-4 w-4 text-gold" />
            </span>
            <span className="font-display text-lg">Elite <span className="gradient-text">Events</span></span>
          </div>
          <p className="mt-4 max-w-md text-sm text-muted-foreground">
            A boutique studio crafting luxury weddings, corporate galas and traditional South Indian celebrations.
          </p>
          <div className="mt-6 flex gap-3">
            {[Instagram, Facebook, Youtube].map((I, i) => (
              <a key={i} href="#" className="grid h-10 w-10 place-items-center rounded-full gold-border hover:bg-gold hover:text-primary-foreground transition">
                <I className="h-4 w-4" />
              </a>
            ))}
          </div>
        </div>

        <div>
          <p className="text-xs uppercase tracking-[0.3em] text-gold">Explore</p>
          <ul className="mt-4 space-y-2 text-sm text-muted-foreground">
            {["Services","Packages","Gallery","Contact"].map((l) => (
              <li key={l}><a href={`#${l.toLowerCase()}`} className="hover:text-foreground">{l}</a></li>
            ))}
          </ul>
        </div>

        <div>
          <p className="text-xs uppercase tracking-[0.3em] text-gold">Contact</p>
          <ul className="mt-4 space-y-2 text-sm text-muted-foreground">
            <li>+91 63815 34560</li>
            <li>manikandanhifi2468@gmail.com</li>
            <li>Chennai · Bengaluru</li>
          </ul>
        </div>
      </div>

      <div className="border-t border-border/60 py-6 text-center text-xs text-muted-foreground">
        © {new Date().getFullYear()} Elite Events & Catering. Crafted with care.
      </div>
    </footer>
  );
}
