"use client";

import { useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { UserX } from "lucide-react";
import { NotPrefDto } from "@/types/notification";

interface MutedUsersProps {
  preferences: NotPrefDto;
  onUpdate: <K extends keyof NotPrefDto>(key: K, value: NotPrefDto[K]) => void;
}

export default function MutedUsers({ preferences, onUpdate }: MutedUsersProps) {
  const [newMutedUser, setNewMutedUser] = useState("");

  const addMutedUser = () => {
    if (
      newMutedUser.trim() &&
      !preferences.mutedUsers.includes(newMutedUser.trim())
    ) {
      onUpdate("mutedUsers", [...preferences.mutedUsers, newMutedUser.trim()]);
      setNewMutedUser("");
    }
  };

  const removeMutedUser = (user: string) => {
    onUpdate(
      "mutedUsers",
      preferences.mutedUsers.filter((u) => u !== user)
    );
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      e.preventDefault();
      addMutedUser();
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <UserX className="h-5 w-5" />
          Muted Users
        </CardTitle>
        <CardDescription>
          Users you won&apos;t receive notifications from
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="flex gap-2">
            <Input
              placeholder="Enter user ID or username"
              value={newMutedUser}
              onChange={(e) => setNewMutedUser(e.target.value)}
              onKeyDown={handleKeyDown}
            />
            <Button onClick={addMutedUser} variant="outline">
              Add
            </Button>
          </div>
          <MutedUsersList
            users={preferences.mutedUsers}
            onRemove={removeMutedUser}
          />
        </div>
      </CardContent>
    </Card>
  );
}

interface MutedUsersListProps {
  users: string[];
  onRemove: (user: string) => void;
}

function MutedUsersList({ users, onRemove }: MutedUsersListProps) {
  if (users.length === 0) {
    return <p className="text-sm text-muted-foreground">No users muted</p>;
  }

  return (
    <div className="flex flex-wrap gap-2">
      {users.map((user) => (
        <Badge key={user} variant="secondary" className="px-3 py-1">
          {user}
          <button
            className="ml-2 text-muted-foreground hover:text-foreground"
            onClick={() => onRemove(user)}
            aria-label={`Remove ${user}`}
          >
            ×
          </button>
        </Badge>
      ))}
    </div>
  );
}
