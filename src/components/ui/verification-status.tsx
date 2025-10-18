"use client";

import { CheckCircle2, Clock, XCircle, AlertCircle, FileText } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export type VerificationStatus = "pending" | "approved" | "rejected" | "not_submitted";

interface VerificationStatusProps {
  status: VerificationStatus;
  type: "id_card" | "phone" | "linkedin";
  submittedAt?: string;
  reviewedAt?: string;
  reviewNotes?: string;
  onResubmit?: () => void;
}

const statusConfig = {
  pending: {
    icon: Clock,
    label: "Under Review",
    color: "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300",
    badgeVariant: "secondary" as const,
  },
  approved: {
    icon: CheckCircle2,
    label: "Verified",
    color: "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300",
    badgeVariant: "default" as const,
  },
  rejected: {
    icon: XCircle,
    label: "Rejected",
    color: "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300",
    badgeVariant: "destructive" as const,
  },
  not_submitted: {
    icon: AlertCircle,
    label: "Not Submitted",
    color: "bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-300",
    badgeVariant: "outline" as const,
  },
};

const typeLabels = {
  id_card: "ID Card Verification",
  phone: "Phone Verification",
  linkedin: "LinkedIn Verification",
};

export default function VerificationStatusCard({
  status,
  type,
  submittedAt,
  reviewedAt,
  reviewNotes,
  onResubmit,
}: VerificationStatusProps) {
  const config = statusConfig[status];
  const Icon = config.icon;
  const typeLabel = typeLabels[type];

  const formatDate = (dateString?: string) => {
    if (!dateString) return null;
    return new Date(dateString).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return (
    <Card className={`${config.color} border-2`}>
      <CardHeader>
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-3">
            <div className={`p-2 rounded-full ${config.color}`}>
              <Icon className="h-5 w-5" />
            </div>
            <div>
              <CardTitle className="text-lg">{typeLabel}</CardTitle>
              <CardDescription className="mt-1">
                <Badge variant={config.badgeVariant}>{config.label}</Badge>
              </CardDescription>
            </div>
          </div>
        </div>
      </CardHeader>

      <CardContent className="space-y-3">
        {/* Status-specific content */}
        {status === "pending" && (
          <div className="space-y-2">
            <p className="text-sm">
              Your verification is being reviewed by our team. This usually takes 24-48 hours.
            </p>
            {submittedAt && (
              <p className="text-xs text-muted-foreground">
                Submitted on {formatDate(submittedAt)}
              </p>
            )}
          </div>
        )}

        {status === "approved" && (
          <div className="space-y-2">
            <p className="text-sm font-medium">✓ Your identity has been verified successfully!</p>
            {reviewedAt && (
              <p className="text-xs text-muted-foreground">
                Verified on {formatDate(reviewedAt)}
              </p>
            )}
          </div>
        )}

        {status === "rejected" && (
          <div className="space-y-3">
            <p className="text-sm font-medium">
              Your verification was not approved. Please review the feedback and resubmit.
            </p>
            {reviewNotes && (
              <div className="p-3 rounded-md bg-white dark:bg-gray-800 border">
                <div className="flex items-start gap-2">
                  <FileText className="h-4 w-4 mt-0.5 flex-shrink-0" />
                  <div>
                    <p className="text-xs font-semibold mb-1">Feedback:</p>
                    <p className="text-xs text-muted-foreground">{reviewNotes}</p>
                  </div>
                </div>
              </div>
            )}
            {reviewedAt && (
              <p className="text-xs text-muted-foreground">
                Reviewed on {formatDate(reviewedAt)}
              </p>
            )}
            {onResubmit && (
              <Button onClick={onResubmit} variant="outline" size="sm" className="w-full">
                Resubmit Verification
              </Button>
            )}
          </div>
        )}

        {status === "not_submitted" && (
          <div className="space-y-2">
            <p className="text-sm">
              Complete your verification to unlock all features and build trust with the community.
            </p>
            {onResubmit && (
              <Button onClick={onResubmit} size="sm" className="w-full">
                Start Verification
              </Button>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
