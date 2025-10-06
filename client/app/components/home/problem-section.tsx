import { AlertCircle, TrendingUp, Users } from "lucide-react";

const stats = [
  {
    icon: AlertCircle,
    stat: "80%",
    description: "of harassment cases go unreported worldwide",
  },
  {
    icon: Users,
    stat: "1 in 3",
    description: "women experience physical or sexual violence",
  },
  {
    icon: TrendingUp,
    stat: "35%",
    description: "increase in reported cases when safe platforms exist",
  },
];

export function ProblemSection() {
  return (
    <section className="px-6 py-20 md:py-28">
      <div className="container mx-auto max-w-6xl">
        <div className="text-center">
          <h2 className="font-heading text-balance text-3xl font-bold text-foreground md:text-5xl">
            The Problem We are Solving
          </h2>
          <p className="mt-4 text-pretty text-lg leading-relaxed text-muted-foreground md:text-xl">
            Too many voices go unheard. We are changing that.
          </p>
        </div>

        <div className="mt-16 grid gap-8 md:grid-cols-3">
          {stats.map((item, index) => {
            const Icon = item.icon;
            return (
              <div
                key={index}
                className="group relative overflow-hidden rounded-2xl bg-card p-8 shadow-md transition-all hover:shadow-xl"
              >
                <div className="absolute right-0 top-0 h-32 w-32 rounded-full bg-primary/5 blur-2xl transition-all group-hover:bg-primary/10" />
                <div className="relative">
                  <div className="mb-4 inline-flex rounded-full bg-primary/10 p-3">
                    <Icon className="h-6 w-6 text-primary" />
                  </div>
                  <div className="font-heading text-5xl font-bold text-primary">
                    {item.stat}
                  </div>
                  <p className="mt-3 leading-relaxed text-muted-foreground">
                    {item.description}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
