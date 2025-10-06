import { Shield, Mail, Globe } from "lucide-react";
import Link from "next/link";

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
              A safe space to report harassment, get help, and find support.
              Your voice matters.
            </p>
            <div className="mt-6 flex gap-4">
              <Link
                href="#"
                className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10 text-primary transition-colors hover:bg-primary hover:text-white"
              >
                <Globe className="h-5 w-5" />
              </Link>
              <Link
                href="#"
                className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10 text-primary transition-colors hover:bg-primary hover:text-white"
              >
                <Mail className="h-5 w-5" />
              </Link>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="font-heading font-semibold text-foreground">
              Quick Links
            </h3>
            <ul className="mt-4 space-y-2">
              <li>
                <Link
                  href="/about"
                  className="text-muted-foreground transition-colors hover:text-primary"
                >
                  About
                </Link>
              </li>
              <li>
                <Link
                  href="/resources"
                  className="text-muted-foreground transition-colors hover:text-primary"
                >
                  Resources
                </Link>
              </li>
              <li>
                <Link
                  href="/contact"
                  className="text-muted-foreground transition-colors hover:text-primary"
                >
                  Contact
                </Link>
              </li>
              <li>
                <Link
                  href="/privacy"
                  className="text-muted-foreground transition-colors hover:text-primary"
                >
                  Privacy Policy
                </Link>
              </li>
            </ul>
          </div>

          {/* Partners */}
          <div>
            <h3 className="font-heading font-semibold text-foreground">
              Partners
            </h3>
            <ul className="mt-4 space-y-2">
              <li className="text-muted-foreground">UN Women</li>
              <li className="text-muted-foreground">Local NGOs</li>
              <li className="text-muted-foreground">Crisis Centers</li>
              <li className="text-muted-foreground">Legal Aid Services</li>
            </ul>
          </div>
        </div>

        <div className="mt-12 border-t border-border pt-8 text-center text-sm text-muted-foreground">
          <p>
            © {new Date().getFullYear()} SpeakUp. All rights reserved. Built
            with care for those who need it most.
          </p>
        </div>
      </div>
    </footer>
  );
}
