import { ArrowRight } from "lucide-react";

const steps = [
  {
    number: "01",
    title: "Report",
    description:
      "Share your experience anonymously through our secure platform",
  },
  {
    number: "02",
    title: "Get Help",
    description: "Access immediate support through our SOS button or community",
  },
  {
    number: "03",
    title: "Connect",
    description:
      "Speak with professional counselors who understand your situation",
  },
  {
    number: "04",
    title: "Access Resources",
    description: "Find shelters, legal aid, and ongoing support services",
  },
];

export function HowItWorksSection() {
  return (
    <section className="px-6 py-20 md:py-28">
      <div className="container mx-auto max-w-6xl">
        <div className="text-center">
          <h2 className="font-heading text-balance text-3xl font-bold text-foreground md:text-5xl">
            How It Works
          </h2>
          <p className="mt-4 text-pretty text-lg leading-relaxed text-muted-foreground md:text-xl">
            Four simple steps to get the help you deserve
          </p>
        </div>

        <div className="mt-16 grid gap-8 md:grid-cols-2 lg:grid-cols-4">
          {steps.map((step, index) => (
            <div key={index} className="relative">
              <div className="flex flex-col items-center text-center">
                <div className="relative mb-4">
                  <div className="flex h-20 w-20 items-center justify-center rounded-full bg-gradient-to-br from-primary to-secondary">
                    <span className="font-heading text-2xl font-bold text-white">
                      {step.number}
                    </span>
                  </div>
                  {index < steps.length - 1 && (
                    <ArrowRight className="absolute -right-12 top-1/2 hidden -translate-y-1/2 text-muted-foreground lg:block" />
                  )}
                </div>
                <h3 className="font-heading text-xl font-semibold text-foreground">
                  {step.title}
                </h3>
                <p className="mt-2 leading-relaxed text-muted-foreground">
                  {step.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
