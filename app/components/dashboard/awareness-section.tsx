"use client";

import { TrendingUp, Users, FileText, TrendingDown, Apple } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useEffect, useState } from "react";
import { Badge } from "@/components/ui/badge";

interface Stat {
  id: number;
  stat_key: string;
  stat_value: number;
  trend_percentage: string;
}

interface StatConfig {
  key: string;
  icon: any;
  label: string;
  color: string;
  bgColor: string;
  sdg?: string;
}

const statsConfig: StatConfig[] = [
  {
    key: "women_supported",
    icon: Users,
    label: "Women Supported",
    color: "text-primary",
    bgColor: "bg-primary/10",
    sdg: "SDG 5",
  },
  {
    key: "reports_filed",
    icon: FileText,
    label: "Reports Filed",
    color: "text-secondary",
    bgColor: "bg-secondary/10",
    sdg: "SDG 16",
  },
  {
    key: "cases_resolved",
    icon: TrendingUp,
    label: "Cases Resolved",
    color: "text-success",
    bgColor: "bg-success/10",
    sdg: "SDG 16",
  },
  {
    key: "economic_support",
    icon: TrendingDown,
    label: "Economic Support Provided",
    color: "text-red-600",
    bgColor: "bg-red-600/10",
    sdg: "SDG 1",
  },
  {
    key: "food_assistance",
    icon: Apple,
    label: "Food Assistance Referrals",
    color: "text-yellow-600",
    bgColor: "bg-yellow-600/10",
    sdg: "SDG 2",
  },
];

// Animated counter hook
function useCountUp(end: number, duration: number = 2000) {
  const [count, setCount] = useState(0);

  useEffect(() => {
    let startTime: number;
    let animationFrame: number;

    const animate = (currentTime: number) => {
      if (!startTime) startTime = currentTime;
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / duration, 1);

      // Easing function
      const easeOutQuart = 1 - Math.pow(1 - progress, 4);
      setCount(Math.floor(easeOutQuart * end));

      if (progress < 1) {
        animationFrame = requestAnimationFrame(animate);
      }
    };

    animationFrame = requestAnimationFrame(animate);

    return () => {
      if (animationFrame) cancelAnimationFrame(animationFrame);
    };
  }, [end, duration]);

  return count;
}

function AnimatedStat({ value }: { value: number }) {
  const animatedValue = useCountUp(value);
  return <>{animatedValue.toLocaleString()}</>;
}

interface AwarenessSectionProps {
  stats: Stat[] | null;
}

export function AwarenessSection({ stats }: AwarenessSectionProps) {
  // Convert array to object for easy lookup
  const statsMap =
    stats?.reduce(
      (acc, stat) => {
        acc[stat.stat_key] = stat;
        return acc;
      },
      {} as Record<string, Stat>
    ) || {};

  return (
    <Card>
      <CardHeader>
        <CardTitle className="font-heading">Live Impact Dashboard</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {statsConfig.map((config) => {
          const Icon = config.icon;
          const stat = statsMap[config.key];
          const value = stat?.stat_value || 0;
          const trend = stat?.trend_percentage || "+0%";

          return (
            <div
              key={config.key}
              className="flex items-center gap-4 rounded-lg border border-border p-4 transition-all hover:shadow-md"
            >
              <div className={`rounded-full ${config.bgColor} p-3`}>
                <Icon className={`h-5 w-5 ${config.color}`} />
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-2">
                  <p className="text-sm text-muted-foreground">
                    {config.label}
                  </p>
                  {config.sdg && (
                    <Badge variant="outline" className="text-xs">
                      {config.sdg}
                    </Badge>
                  )}
                </div>
                <div className="flex items-baseline gap-2">
                  <p className="font-heading text-2xl font-bold text-foreground">
                    <AnimatedStat value={value} />
                  </p>
                  <span className="text-xs font-medium text-success">
                    {trend}
                  </span>
                </div>
              </div>
            </div>
          );
        })}

        <div className="mt-6 rounded-lg bg-gradient-to-r from-red-50 to-yellow-50 dark:from-red-950 dark:to-yellow-950 p-4 border border-primary/20">
          <p className="text-sm text-muted-foreground">
            <span className="font-medium text-foreground">
              Breaking Cycles:
            </span>{" "}
            Through economic empowerment (SDG 1), we've helped{" "}
            <span className="font-bold text-red-600">
              {statsMap.economic_support?.stat_value.toLocaleString() || 432}
            </span>{" "}
            survivors escape poverty, while ensuring{" "}
            <span className="font-bold text-yellow-600">
              {statsMap.food_assistance?.stat_value.toLocaleString() || 287}
            </span>{" "}
            families have access to food (SDG 2).
          </p>
        </div>
      </CardContent>
    </Card>
  );
}
