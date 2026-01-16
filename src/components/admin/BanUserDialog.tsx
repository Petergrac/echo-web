"use client";

import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
  AlertTriangle,
  Info,
  ShieldAlert,
  Clock,
} from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface User {
  id: string;
  username: string;
  firstName: string;
  lastName: string;
  email: string;
  role: string;
}

interface BanUserDialogProps {
  user: User;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess: (reason?: string) => void;
}

export default function BanUserDialog({
  user,
  open,
  onOpenChange,
  onSuccess,
}: BanUserDialogProps) {
  const [reason, setReason] = useState("");
  const [duration, setDuration] = useState("7");
  const [loading, setLoading] = useState(false);

  const handleBan = async () => {
    if (!reason.trim()) {
      alert("Please provide a reason for the ban");
      return;
    }

    setLoading(true);
    try {
      await onSuccess(reason);
      setReason("");
      setDuration("7");
      onOpenChange(false);
    } catch (error) {
      console.error("Failed to ban user:", error);
    } finally {
      setLoading(false);
    }
  };

  const durationOptions = [
    { value: "1", label: "1 day" },
    { value: "3", label: "3 days" },
    { value: "7", label: "7 days" },
    { value: "30", label: "30 days" },
    { value: "permanent", label: "Permanent" },
  ];

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <div className="flex items-center space-x-2">
            <ShieldAlert className="h-6 w-6 text-red-600" />
            <DialogTitle>Ban User</DialogTitle>
          </div>
        </DialogHeader>

        <div className="space-y-4">
          {/* Warning Alert */}
          <div className="rounded-lg border border-red-200 bg-red-50 p-4">
            <div className="flex items-start">
              <AlertTriangle className="h-5 w-5 text-red-600 mr-2 shrink mt-0.5" />
              <div>
                <p className="font-medium text-red-800">
                  Banning {user.firstName} {user.lastName}
                </p>
                <p className="text-sm text-red-700 mt-1">
                  @{user.username} • {user.email}
                </p>
              </div>
            </div>
          </div>

          {/* Ban Duration */}
          <div className="space-y-2">
            <Label className="flex items-center">
              <Clock className="h-4 w-4 mr-2" />
              Ban Duration
            </Label>
            <Select value={duration} onValueChange={setDuration}>
              <SelectTrigger>
                <SelectValue placeholder="Select duration" />
              </SelectTrigger>
              <SelectContent>
                {durationOptions.map((option) => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {duration === "permanent" && (
              <p className="text-xs text-yellow-600">
                ⚠️ Permanent bans cannot be automatically lifted
              </p>
            )}
          </div>

          {/* Reason Input */}
          <div className="space-y-2">
            <Label htmlFor="reason" className="flex items-center">
              <Info className="h-4 w-4 mr-2" />
              Reason for ban (required)
            </Label>
            <Textarea
              id="reason"
              placeholder="Explain why this user is being banned..."
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              className="min-h-[100px]"
              required
            />
            <p className="text-xs text-gray-500">
              This reason will be shown to the user and recorded in audit logs.
            </p>
          </div>

          {/* Common Reasons */}
          <div className="space-y-2">
            <p className="text-sm font-medium">Common Reasons:</p>
            <div className="flex flex-wrap gap-2">
              {[
                "Spam or bot activity",
                "Harassment",
                "Hate speech",
                "Inappropriate content",
                "Impersonation",
                "Terms of service violation",
              ].map((commonReason) => (
                <Button
                  key={commonReason}
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => setReason(commonReason)}
                  className="text-xs"
                >
                  {commonReason}
                </Button>
              ))}
            </div>
          </div>
        </div>

        <DialogFooter>
          <Button
            type="button"
            variant="outline"
            onClick={() => onOpenChange(false)}
            disabled={loading}
          >
            Cancel
          </Button>
          <Button
            type="button"
            variant="destructive"
            onClick={handleBan}
            disabled={!reason.trim() || loading}
          >
            {loading ? "Banning..." : "Ban User"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}