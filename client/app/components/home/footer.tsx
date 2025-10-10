import {
  Shield,
  Mail,
  Globe,
  TrendingDown,
  Apple,
  Heart,
  Scale,
  ExternalLink,
} from "lucide-react";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";

export function Footer() {
  return (
    <footer className="border-t border-border bg-muted/30 px-6 py-12">
      <div className="container mx-auto max-w-6xl">
        <div className="grid gap-8 md:grid-cols-4">
          {/* Brand */}
          <div className="md:col-span-2">
            <div className="flex items-center gap-2">
              <div className="rounded-full bg-primary/10 p-2">
                <Shield className="h-6 w-6 text-primary" />
              </div>
              <span className="font-heading text-2xl font-bold text-primary">
                SpeakUp
              </span>
            </div>
            <p className="mt-4 leading-relaxed text-muted-foreground">
              Breaking the cycle of violence, poverty, and hunger. A safe space
              to report, get help, and rebuild your life.
            </p>


            <div className="mt-6 flex gap-4">
              <a
                href="https://github.com/yourusername/speakup"
                target="_blank"
                rel="noopener noreferrer"
                className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10 text-primary transition-colors hover:bg-primary hover:text-white"
                aria-label="GitHub"
              >
                <Globe className="h-5 w-5" />
              </a>
              <a
                href="mailto:contact@speakup.org"
                className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10 text-primary transition-colors hover:bg-primary hover:text-white"
                aria-label="Email"
              >
                <Mail className="h-5 w-5" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="font-heading font-semibold text-foreground mb-4">
              Quick Links
            </h3>
            <ul className="space-y-2">
              <li>
                <Link
                  href="/dashboard"
                  className="text-muted-foreground transition-colors hover:text-primary flex items-center gap-1"
                >
                  Dashboard
                </Link>
              </li>
              <li>
                <Link
                  href="/dashboard/report"
                  className="text-muted-foreground transition-colors hover:text-primary"
                >
                  Report Incident
                </Link>
              </li>
              <li>
                <Link
                  href="/dashboard/sos"
                  className="text-muted-foreground transition-colors hover:text-primary"
                >
                  Emergency SOS
                </Link>
              </li>
              <li>
                <Link
                  href="/dashboard/resources"
                  className="text-muted-foreground transition-colors hover:text-primary"
                >
                  Resources Hub
                </Link>
              </li>
              <li>
                <Link
                  href="/dashboard/community"
                  className="text-muted-foreground transition-colors hover:text-primary"
                >
                  Community
                </Link>
              </li>
            </ul>
          </div>

          {/* Support & Partners */}
          <div>
            <h3 className="font-heading font-semibold text-foreground mb-4">
              Partners & Support
            </h3>
            <ul className="space-y-2">
              <li>
                <a
                  href="https://www.unwomen.org"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-muted-foreground transition-colors hover:text-primary flex items-center gap-1"
                >
                  UN Women
                  <ExternalLink className="h-3 w-3" />
                </a>
              </li>
              <li>
                <a
                  href="https://www.rainn.org"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-muted-foreground transition-colors hover:text-primary flex items-center gap-1"
                >
                  RAINN
                  <ExternalLink className="h-3 w-3" />
                </a>
              </li>
              <li>
                <a
                  href="https://www.thehotline.org"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-muted-foreground transition-colors hover:text-primary flex items-center gap-1"
                >
                  The Hotline
                  <ExternalLink className="h-3 w-3" />
                </a>
              </li>
              <li>
                <a
                  href="https://www.womensaid.org.uk"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-muted-foreground transition-colors hover:text-primary flex items-center gap-1"
                >
                  Women's Aid
                  <ExternalLink className="h-3 w-3" />
                </a>
              </li>
              <li>
                <a
                  href="https://www.1800respect.org.au"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-muted-foreground transition-colors hover:text-primary flex items-center gap-1"
                >
                  1800Respect
                  <ExternalLink className="h-3 w-3" />
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Emergency Banner */}
        <div className="mt-8 rounded-xl bg-destructive/10 border border-destructive/20 p-6">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="text-center md:text-left">
              <p className="font-semibold text-destructive">
                In Immediate Danger?
              </p>
              <p className="text-sm text-muted-foreground">
                Call emergency services or use our SOS button
              </p>
            </div>
            <div className="flex gap-3">
              <a
                href="tel:911"
                className="px-6 py-2 bg-destructive text-destructive-foreground rounded-full font-semibold hover:bg-destructive/90 transition-colors"
              >
                Call 911
              </a>
              <Link
                href="/dashboard/sos"
                className="px-6 py-2 bg-primary text-primary-foreground rounded-full font-semibold hover:bg-primary/90 transition-colors"
              >
                Open SOS
              </Link>
            </div>
          </div>
        </div>

        {/* Bottom Section */}
        <div className="mt-8 pt-8 border-t border-border">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <p className="text-sm text-muted-foreground text-center md:text-left">
              © {new Date().getFullYear()} SpeakUp. Built for GNEC Hackathon
              2025.
              <br className="md:hidden" />
              <span className="ml-1">Supporting UN SDG 1, 2, 5 & 16.</span>
            </p>
            <div className="flex gap-6 text-sm">
              <Link
                href="/privacy"
                className="text-muted-foreground hover:text-primary transition-colors"
              >
                Privacy Policy
              </Link>
              <Link
                href="/terms"
                className="text-muted-foreground hover:text-primary transition-colors"
              >
                Terms of Service
              </Link>
              <a
                href="https://github.com/yourusername/speakup"
                target="_blank"
                rel="noopener noreferrer"
                className="text-muted-foreground hover:text-primary transition-colors flex items-center gap-1"
              >
                GitHub
                <ExternalLink className="h-3 w-3" />
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
