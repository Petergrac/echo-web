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
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import {
  Shield,
  Info,
  AlertTriangle,
  User,
  UserCog,
  Crown,
} from "lucide-react";

interface User {
  id: string;
  username: string;
  firstName: string;
  lastName: string;
  email: string;
  role: string;
  isModerator: boolean;
}

interface RoleUpdateDialogProps {
  user: User;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess: (role: string) => void;
}

export default function RoleUpdateDialog({
  user,
  open,
  onOpenChange,
  onSuccess,
}: RoleUpdateDialogProps) {
  const [role, setRole] = useState(user.role);
  const [notes, setNotes] = useState("");
  const [loading, setLoading] = useState(false);

  const handleUpdate = async () => {
    if (role === user.role) {
      onOpenChange(false);
      return;
    }

    setLoading(true);
    try {
      await onSuccess(role);
      setNotes("");
      onOpenChange(false);
    } catch (error) {
      console.error("Failed to update role:", error);
    } finally {
      setLoading(false);
    }
  };

  const roleDescriptions = {
    user: {
      icon: <User className="h-4 w-4" />,
      description: "Standard user with basic permissions",
      privileges: ["Create posts", "Like & comment", "Follow users"],
    },
    moderator: {
      icon: <UserCog className="h-4 w-4" />,
      description: "Can moderate content and manage users",
      privileges: ["Delete posts", "Warn users", "View reports", "Temporary bans"],
    },
    admin: {
      icon: <Crown className="h-4 w-4" />,
      description: "Full system access and control",
      privileges: ["All permissions", "Manage admins", "System settings", "Full ban authority"],
    },
  };

  const selectedRole = roleDescriptions[role as keyof typeof roleDescriptions];

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <div className="flex items-center space-x-2">
            <Shield className="h-6 w-6 text-blue-600" />
            <DialogTitle>Update User Role</DialogTitle>
          </div>
        </DialogHeader>

        <div className="space-y-4">
          {/* User Info */}
          <div className="rounded-lg border p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium">
                  {user.firstName} {user.lastName}
                </p>
                <p className="text-sm text-gray-500">
                  @{user.username} • {user.email}
                </p>
              </div>
              <Badge variant={user.role === "admin" ? "destructive" : 
                           user.role === "moderator" ? "default" : "outline"}>
                Current: {user.role}
              </Badge>
            </div>
          </div>

          {/* Role Selection */}
          <div className="space-y-2">
            <Label className="flex items-center">
              <Shield className="h-4 w-4 mr-2" />
              Select New Role
            </Label>
            <Select value={role} onValueChange={setRole}>
              <SelectTrigger>
                <SelectValue placeholder="Select a role" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="user">
                  <div className="flex items-center">
                    <User className="mr-2 h-4 w-4" />
                    User
                  </div>
                </SelectItem>
                <SelectItem value="moderator">
                  <div className="flex items-center">
                    <UserCog className="mr-2 h-4 w-4" />
                    Moderator
                  </div>
                </SelectItem>
                <SelectItem value="admin">
                  <div className="flex items-center">
                    <Crown className="mr-2 h-4 w-4" />
                    Administrator
                  </div>
                </SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Role Description */}
          {selectedRole && (
            <div className="rounded-lg border p-4 bg-blue-50">
              <div className="flex items-center space-x-2 mb-3">
                <div className="text-blue-600">
                  {selectedRole.icon}
                </div>
                <div>
                  <p className="font-medium text-blue-900 capitalize">{role} Role</p>
                  <p className="text-sm text-blue-700">{selectedRole.description}</p>
                </div>
              </div>
              <div className="space-y-1">
                <p className="text-sm font-medium text-blue-900">Privileges:</p>
                <ul className="text-sm text-blue-700 space-y-1">
                  {selectedRole.privileges.map((privilege, index) => (
                    <li key={index} className="flex items-center">
                      <div className="w-1 h-1 rounded-full bg-blue-500 mr-2" />
                      {privilege}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          )}

          {/* Warning if promoting to admin */}
          {role === "admin" && user.role !== "admin" && (
            <div className="rounded-lg border border-yellow-200 bg-yellow-50 p-4">
              <div className="flex items-start">
                <AlertTriangle className="h-5 w-5 text-yellow-600 mr-2 shrink mt-0.5" />
                <div>
                  <p className="font-medium text-yellow-800">⚠️ High Privilege Warning</p>
                  <p className="text-sm text-yellow-700 mt-1">
                    Admin roles have full system access. Only grant this to trusted individuals.
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Notes (optional) */}
          <div className="space-y-2">
            <Label htmlFor="notes" className="flex items-center">
              <Info className="h-4 w-4 mr-2" />
              Notes (optional)
            </Label>
            <Textarea
              id="notes"
              placeholder="Add any notes about this role change..."
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              className="min-h-20"
            />
            <p className="text-xs text-gray-500">
              These notes will be recorded in the audit log.
            </p>
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
            variant={role === "admin" ? "destructive" : "default"}
            onClick={handleUpdate}
            disabled={loading}
          >
            {loading ? "Updating..." : `Update to ${role}`}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}