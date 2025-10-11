import { Button } from "@/components/ui/button";
import { ArrowRight, Shield } from "lucide-react";
import Link from "next/link";

export function CtaSection() {
  return (
    <section className="px-6 py-20 md:py-28">
      <div className="container mx-auto max-w-4xl">
        <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-primary via-primary/90 to-secondary p-12 text-center shadow-2xl md:p-16">
          <div className="relative z-10">
            <Shield className="mx-auto mb-6 h-16 w-16 text-white" />
            <h2 className="font-heading text-balance text-3xl font-bold text-white md:text-5xl">
              Ready to Make Your Voice Heard?
            </h2>
            <p className="mt-4 text-pretty text-lg leading-relaxed text-white/90 md:text-xl">
              Join thousands who have found safety, support, and hope through
              SpeakUp
            </p>
            <div className="mt-8 flex flex-col gap-4 sm:flex-row sm:justify-center">
              <Button
                asChild
                size="lg"
                variant="secondary"
                className="group gap-2 rounded-full px-8 text-lg shadow-lg"
              >
                <Link href="/dashboard">
                  Get Help Now
                  <ArrowRight className="h-5 w-5 transition-transform group-hover:translate-x-1" />
                </Link>
              </Button>
            </div>
          </div>

          {/* Decorative Elements */}
          <div className="pointer-events-none absolute inset-0">
            <div className="absolute -left-20 -top-20 h-64 w-64 rounded-full bg-white/10 blur-3xl" />
            <div className="absolute -bottom-20 -right-20 h-64 w-64 rounded-full bg-white/10 blur-3xl" />
          </div>
        </div>
      </div>
    </section>
  );
}
