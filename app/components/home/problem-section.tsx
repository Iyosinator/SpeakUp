import {
  AlertCircle,
  TrendingDown,
  Apple,
  Users,
  CircleDollarSign,
  Baby,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";

const stats = [
  {
    icon: Users,
    stat: "1 in 3",
    description: "women experience physical or sexual violence globally",
    sdg: "SDG 5 & 16",
    color: "text-red-600",
    bgColor: "bg-red-600/10",
  },
  {
    icon: TrendingDown,
    stat: "70%",
    description:
      "of survivors experience economic abuse, trapping them in poverty",
    sdg: "SDG 1",
    color: "text-red-700",
    bgColor: "bg-red-700/10",
  },
  {
    icon: Apple,
    stat: "3x",
    description:
      "higher food insecurity rate among survivors and their children",
    sdg: "SDG 2",
    color: "text-yellow-600",
    bgColor: "bg-yellow-600/10",
  },
  {
    icon: CircleDollarSign,
    stat: "$1.5T",
    description:
      "annual global cost of violence against women in lost productivity",
    sdg: "SDG 8",
    color: "text-orange-600",
    bgColor: "bg-orange-600/10",
  },
  {
    icon: Baby,
    stat: "2x",
    description: "higher malnutrition risk for children in homes with violence",
    sdg: "SDG 2 & 3",
    color: "text-blue-600",
    bgColor: "bg-blue-600/10",
  },
  {
    icon: AlertCircle,
    stat: "80%",
    description:
      "of cases go unreported due to fear, stigma, or lack of resources",
    sdg: "SDG 16",
    color: "text-purple-600",
    bgColor: "bg-purple-600/10",
  },
];

export function ProblemSection() {
  return (
    <section className="px-6 py-20 md:py-28 bg-muted/30">
      <div className="container mx-auto max-w-7xl">
        <div className="text-center">
          <Badge className="mb-4 bg-destructive/10 text-destructive border-destructive/20">
            The Interconnected Crisis
          </Badge>
          <h2 className="font-heading text-balance text-3xl font-bold text-foreground md:text-5xl">
            Violence Creates Poverty & Hunger
          </h2>
          <p className="mt-4 max-w-3xl mx-auto text-pretty text-lg leading-relaxed text-muted-foreground md:text-xl">
            Violence against women doesn't exist in isolation—it's the root
            cause of poverty cycles and food insecurity affecting entire
            families.
          </p>
        </div>

        <div className="mt-16 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {stats.map((item, index) => {
            const Icon = item.icon;
            return (
              <div
                key={index}
                className="group relative overflow-hidden rounded-2xl bg-card p-8 shadow-md transition-all hover:shadow-xl hover:-translate-y-1 border border-border"
              >
                <div
                  className={`absolute right-0 top-0 h-32 w-32 rounded-full ${item.bgColor} blur-2xl transition-all group-hover:blur-3xl`}
                />
                <div className="relative">
                  <div className="flex items-start justify-between mb-4">
                    <div
                      className={`inline-flex rounded-full ${item.bgColor} p-3`}
                    >
                      <Icon className={`h-6 w-6 ${item.color}`} />
                    </div>
                    <Badge variant="outline" className="text-xs">
                      {item.sdg}
                    </Badge>
                  </div>
                  <div
                    className={`font-heading text-5xl font-bold ${item.color}`}
                  >
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

        {/* Call to Action */}
        <div className="mt-16 text-center">
          <div className="inline-block rounded-2xl bg-primary/5 border border-primary/20 p-8 max-w-3xl">
            <p className="text-lg font-semibold text-foreground mb-2">
              SpeakUp Breaks the Cycle
            </p>
            <p className="text-muted-foreground">
              By providing{" "}
              <span className="font-semibold text-foreground">
                emergency support
              </span>
              ,
              <span className="font-semibold text-foreground">
                {" "}
                economic empowerment resources
              </span>
              , and
              <span className="font-semibold text-foreground">
                {" "}
                food assistance connections
              </span>
              , we address violence, poverty, and hunger together—not
              separately.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
