import { Quote } from "lucide-react";

const testimonials = [
  {
    quote:
      "SpeakUp gave me the courage to share my story. I finally felt heard and supported.",
    author: "Anonymous Survivor",
  },
  {
    quote:
      "The counseling support helped me through my darkest days. I'm grateful this platform exists.",
    author: "Community Member",
  },
  {
    quote:
      "As an NGO partner, we've seen firsthand how SpeakUp empowers voices that need to be heard.",
    author: "NGO Representative",
  },
];

export function TestimonialsSection() {
  return (
    <section className="bg-gradient-to-b from-muted/30 to-background px-6 py-20 md:py-28">
      <div className="container mx-auto max-w-6xl">
        <div className="text-center">
          <h2 className="font-heading text-balance text-3xl font-bold text-foreground md:text-5xl">
            Stories of Hope
          </h2>
          <p className="mt-4 text-pretty text-lg leading-relaxed text-muted-foreground md:text-xl">
            Real impact from real people
          </p>
        </div>

        <div className="mt-16 grid gap-8 md:grid-cols-3">
          {testimonials.map((testimonial, index) => (
            <div
              key={index}
              className="relative overflow-hidden rounded-2xl bg-card p-8 shadow-md"
            >
              <Quote className="mb-4 h-8 w-8 text-primary/20" />
              <p className="leading-relaxed text-card-foreground">
                {testimonial.quote}
              </p>
              <p className="mt-4 font-heading font-semibold text-muted-foreground">
                — {testimonial.author}
              </p>
              <div className="absolute bottom-0 right-0 h-24 w-24 rounded-full bg-secondary/5 blur-2xl" />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
