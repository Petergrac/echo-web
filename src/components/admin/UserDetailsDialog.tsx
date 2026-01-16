"use client";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { format } from "date-fns";
import {
  Mail,
  Calendar,
  Globe,
  MapPin,
  Shield,
  Ban,
  CheckCircle,
  XCircle
} from "lucide-react";

interface User {
  id: string;
  email: string;
  username: string;
  firstName: string;
  lastName: string;
  avatar: string | null;
  bio?: string;
  website?: string;
  location?: string;
  role: string;
  isBanned: boolean;
  bannedAt: string | null;
  banReason: string | null;
  emailVerified: boolean;
  createdAt: string;
  followersCount: number;
  followingCount: number;
  postCount: number;
}

interface UserDetailsDialogProps {
  user: User;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export default function UserDetailsDialog({
  user,
  open,
  onOpenChange,
}: UserDetailsDialogProps) {
  const stats = [
    { label: "Followers", value: user.followersCount },
    { label: "Following", value: user.followingCount },
    { label: "Posts", value: user.postCount },
  ];

  const getRoleBadge = (role: string) => {
    const variants = {
      admin: "bg-red-100 text-red-800",
      moderator: "bg-blue-100 text-blue-800",
      user: "bg-gray-100 text-gray-800",
    };
    return (
      <Badge className={variants[role as keyof typeof variants] || "bg-gray-100"}>
        {role.toUpperCase()}
      </Badge>
    );
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>User Details</DialogTitle>
        </DialogHeader>
        <ScrollArea className="max-h-[80vh] pr-4">
          <div className="space-y-6">
            {/* Header */}
            <div className="flex items-start space-x-4">
              <Avatar className="h-20 w-20">
                <AvatarImage src={user.avatar || ""} />
                <AvatarFallback className="text-lg">
                  {user.firstName[0]}{user.lastName[0]}
                </AvatarFallback>
              </Avatar>
              <div className="flex-1">
                <div className="flex items-center space-x-2">
                  <h3 className="text-xl font-bold">
                    {user.firstName} {user.lastName}
                  </h3>
                  {getRoleBadge(user.role)}
                  {user.isBanned && (
                    <Badge variant="destructive">BANNED</Badge>
                  )}
                </div>
                <p className="text-gray-500">@{user.username}</p>
                
                <div className="mt-2 flex flex-wrap gap-2">
                  {user.emailVerified ? (
                    <Badge variant="outline" className="bg-green-50">
                      <CheckCircle className="mr-1 h-3 w-3" />
                      Email Verified
                    </Badge>
                  ) : (
                    <Badge variant="outline" className="bg-yellow-50">
                      <XCircle className="mr-1 h-3 w-3" />
                      Email Not Verified
                    </Badge>
                  )}
                  <Badge variant="outline">
                    <Calendar className="mr-1 h-3 w-3" />
                    Joined {format(new Date(user.createdAt), "MMM yyyy")}
                  </Badge>
                </div>
              </div>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-3 gap-4 rounded-lg border p-4">
              {stats.map((stat) => (
                <div key={stat.label} className="text-center">
                  <div className="text-2xl font-bold">{stat.value}</div>
                  <div className="text-sm text-gray-500">{stat.label}</div>
                </div>
              ))}
            </div>

            {/* Details */}
            <div className="space-y-4">
              <h4 className="font-semibold">Information</h4>
              <div className="space-y-3">
                <div className="flex items-center">
                  <Mail className="mr-3 h-4 w-4 text-gray-500" />
                  <div>
                    <div className="text-sm text-gray-500">Email</div>
                    <div>{user.email}</div>
                  </div>
                </div>
                
                {user.bio && (
                  <div>
                    <div className="text-sm text-gray-500 mb-1">Bio</div>
                    <p className="whitespace-pre-wrap">{user.bio}</p>
                  </div>
                )}

                <div className="grid grid-cols-2 gap-4">
                  {user.location && (
                    <div className="flex items-center">
                      <MapPin className="mr-3 h-4 w-4 text-gray-500" />
                      <div>
                        <div className="text-sm text-gray-500">Location</div>
                        <div>{user.location}</div>
                      </div>
                    </div>
                  )}

                  {user.website && (
                    <div className="flex items-center">
                      <Globe className="mr-3 h-4 w-4 text-gray-500" />
                      <div>
                        <div className="text-sm text-gray-500">Website</div>
                        <a 
                          href={user.website.startsWith('http') ? user.website : `https://${user.website}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-blue-600 hover:underline"
                        >
                          {user.website}
                        </a>
                      </div>
                    </div>
                  )}
                </div>

                {user.isBanned && user.banReason && (
                  <div className="rounded-lg border border-red-200 bg-red-50 p-4">
                    <div className="flex items-center">
                      <Ban className="mr-2 h-4 w-4 text-red-600" />
                      <div className="font-semibold text-red-800">Ban Details</div>
                    </div>
                    <p className="mt-2 text-sm text-red-700">{user.banReason}</p>
                    {user.bannedAt && (
                      <p className="mt-1 text-xs text-red-600">
                        Banned on {format(new Date(user.bannedAt), "PPpp")}
                      </p>
                    )}
                  </div>
                )}

                <div className="rounded-lg border p-4">
                  <div className="flex items-center">
                    <Shield className="mr-2 h-4 w-4 text-gray-500" />
                    <div className="font-semibold">Account Information</div>
                  </div>
                  <div className="mt-3 grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <div className="text-gray-500">User ID</div>
                      <code className="text-xs">{user.id}</code>
                    </div>
                    <div>
                      <div className="text-gray-500">Created</div>
                      <div>{format(new Date(user.createdAt), "PPpp")}</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
}