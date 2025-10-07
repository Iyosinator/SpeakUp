import { Card } from "@/components/ui/card";
import { Shield, Heart, Users, AlertCircle } from "lucide-react";

export function CommunityGuidelines() {
  return (
    <div className="space-y-6">
      <Card className="p-6">
        <h2 className="mb-4 font-heading text-xl font-semibold text-foreground">
          Community Guidelines
        </h2>
        <div className="space-y-4">
          <div className="flex gap-3">
            <Heart className="h-5 w-5 flex-shrink-0 text-primary" />
            <div>
              <h3 className="font-medium text-foreground">Be Supportive</h3>
              <p className="text-sm text-muted-foreground">
                Offer kindness and understanding to all members
              </p>
            </div>
          </div>
          <div className="flex gap-3">
            <Shield className="h-5 w-5 flex-shrink-0 text-primary" />
            <div>
              <h3 className="font-medium text-foreground">Respect Privacy</h3>
              <p className="text-sm text-muted-foreground">
                Never share personal information or identify others
              </p>
            </div>
          </div>
          <div className="flex gap-3">
            <Users className="h-5 w-5 flex-shrink-0 text-primary" />
            <div>
              <h3 className="font-medium text-foreground">Stay Anonymous</h3>
              <p className="text-sm text-muted-foreground">
                Use anonymous mode to protect your identity
              </p>
            </div>
          </div>
          <div className="flex gap-3">
            <AlertCircle className="h-5 w-5 flex-shrink-0 text-primary" />
            <div>
              <h3 className="font-medium text-foreground">Report Concerns</h3>
              <p className="text-sm text-muted-foreground">
                Flag inappropriate content to keep our community safe
              </p>
            </div>
          </div>
        </div>
      </Card>

      <Card className="p-6">
        <h2 className="mb-4 font-heading text-xl font-semibold text-foreground">
          Community Stats
        </h2>
        <div className="space-y-3">
          <div className="flex justify-between">
            <span className="text-sm text-muted-foreground">
              Active Members
            </span>
            <span className="font-semibold text-foreground">2,847</span>
          </div>
          <div className="flex justify-between">
            <span className="text-sm text-muted-foreground">
              Posts This Week
            </span>
            <span className="font-semibold text-foreground">156</span>
          </div>
          <div className="flex justify-between">
            <span className="text-sm text-muted-foreground">Support Given</span>
            <span className="font-semibold text-foreground">4,392</span>
          </div>
        </div>
      </Card>
    </div>
  );
}
