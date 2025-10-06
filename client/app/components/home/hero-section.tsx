import { Button } from "@/components/ui/button";
import { ArrowRight, Shield } from "lucide-react";
import Link from "next/link";

export function HeroSection() {
  return (
    <section className="relative overflow-hidden bg-gradient-to-b from-background to-muted/20 px-6 py-20 md:py-32">
      <div className="container mx-auto max-w-6xl">
        <div className="flex flex-col items-center text-center">
          {/* Logo/Brand */}
          <div className="mb-6 flex items-center gap-2">
            <div className="rounded-full bg-primary/10 p-3">
              <Shield className="h-8 w-8 text-primary" />
            </div>
            <h1 className="font-heading text-3xl font-bold text-primary">
              SpeakUp
            </h1>
          </div>

          {/* Headline */}
          <h2 className="font-heading text-balance text-4xl font-bold leading-tight text-foreground md:text-6xl lg:text-7xl">
            Your Voice Matters.
            <br />
            <span className="text-primary">Speak Up, Get Help,</span>
            <br />
            <span className="text-secondary">Stay Safe.</span>
          </h2>

          {/* Subtext */}
          <p className="mt-6 max-w-2xl text-pretty text-lg leading-relaxed text-muted-foreground md:text-xl">
            Millions of women and children experience harassment and violence
            every year — many go unreported. SpeakUp gives you a safe space to
            report and get help.
          </p>

          {/* CTA Button */}
          <div className="mt-10 flex flex-col gap-4 sm:flex-row">
            <Button
              asChild
              size="lg"
              className="group gap-2 rounded-full px-8 text-lg shadow-lg"
            >
              <Link href="/dashboard">
                Get Started
                <ArrowRight className="h-5 w-5 transition-transform group-hover:translate-x-1" />
              </Link>
            </Button>
            <Button
              asChild
              variant="outline"
              size="lg"
              className="rounded-full px-8 text-lg bg-transparent"
            >
              <Link href="#features">Learn More</Link>
            </Button>
          </div>
        </div>
      </div>

      {/* Decorative Elements */}
      <div className="pointer-events-none absolute left-0 top-0 h-full w-full overflow-hidden">
        <div className="absolute -left-20 top-20 h-64 w-64 rounded-full bg-primary/5 blur-3xl" />
        <div className="absolute -right-20 top-40 h-96 w-96 rounded-full bg-secondary/5 blur-3xl" />
      </div>
    </section>
  );
}
