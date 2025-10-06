import {
  AlertTriangle,
  FileText,
  Heart,
  MessageCircle,
  BookOpen,
} from "lucide-react";

const features = [
  {
    icon: AlertTriangle,
    title: "Quick SOS Button",
    description: "Immediate help in emergencies with one tap",
    color: "text-destructive",
    bgColor: "bg-destructive/10",
  },
  {
    icon: FileText,
    title: "Anonymous Reporting",
    description: "File incidents safely without revealing your identity",
    color: "text-primary",
    bgColor: "bg-primary/10",
  },
  {
    icon: Heart,
    title: "Community Support",
    description: "Connect with survivors and allies in a safe space",
    color: "text-secondary",
    bgColor: "bg-secondary/10",
  },
  {
    icon: MessageCircle,
    title: "Counseling Support",
    description: "Professional mental health assistance when you need it",
    color: "text-success",
    bgColor: "bg-success/10",
  },
  {
    icon: BookOpen,
    title: "Resources Hub",
    description: "Access to shelters, legal aid, and emergency hotlines",
    color: "text-primary",
    bgColor: "bg-primary/10",
  },
];

export function FeaturesSection() {
  return (
    <section id="features" className="bg-muted/30 px-6 py-20 md:py-28">
      <div className="container mx-auto max-w-6xl">
        <div className="text-center">
          <h2 className="font-heading text-balance text-3xl font-bold text-foreground md:text-5xl">
            Everything You Need to Feel Safe
          </h2>
          <p className="mt-4 text-pretty text-lg leading-relaxed text-muted-foreground md:text-xl">
            Comprehensive tools designed with your safety and privacy in mind
          </p>
        </div>

        <div className="mt-16 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {features.map((feature, index) => {
            const Icon = feature.icon;
            return (
              <div
                key={index}
                className="group rounded-2xl bg-card p-6 shadow-md transition-all hover:-translate-y-1 hover:shadow-xl"
              >
                <div
                  className={`inline-flex rounded-xl ${feature.bgColor} p-3`}
                >
                  <Icon className={`h-6 w-6 ${feature.color}`} />
                </div>
                <h3 className="mt-4 font-heading text-xl font-semibold text-card-foreground">
                  {feature.title}
                </h3>
                <p className="mt-2 leading-relaxed text-muted-foreground">
                  {feature.description}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
