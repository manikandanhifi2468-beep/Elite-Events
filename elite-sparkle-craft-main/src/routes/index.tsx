import { createFileRoute } from "@tanstack/react-router";
import { Navbar } from "@/components/site/Navbar";
import { Hero } from "@/components/site/Hero";
import { Services } from "@/components/site/Services";
import { About } from "@/components/site/About";
import { Packages } from "@/components/site/Packages";
import { Planner } from "@/components/site/Planner";
import { Gallery } from "@/components/site/Gallery";
import { Testimonials } from "@/components/site/Testimonials";
import { Contact } from "@/components/site/Contact";
import { Footer } from "@/components/site/Footer";
import { WhatsAppButton } from "@/components/site/WhatsAppButton";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Elite Events & Catering — Luxury Weddings, Corporate & South Indian Functions" },
      { name: "description", content: "Premium catering and event management studio for weddings, birthdays, corporate galas and traditional South Indian celebrations." },
      { property: "og:title", content: "Elite Events & Catering" },
      { property: "og:description", content: "Crafting unforgettable events & premium catering experiences." },
    ],
  }),
  component: Index,
});

function Index() {
  return (
    <main className="relative overflow-x-hidden">
      <Navbar />
      <Hero />
      <Services />
      <About />
      <Packages />
      <Planner />
      <Gallery />
      <Testimonials />
      <Contact />
      <Footer />
      <WhatsAppButton />
    </main>
  );
}
