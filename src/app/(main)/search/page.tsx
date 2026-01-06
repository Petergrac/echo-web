/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useSearch } from "@/lib/hooks/useSearch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Users,
  MessageSquare,
  Hash,
  Search as SearchIcon,
  User,
  Calendar,
  ArrowUpDown,
} from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import Image from "next/image";
import Link from "next/link";
import BackBar from "@/components/post/post-detail/Back-Bar";

export default function SearchPage() {
  const searchParams = useSearchParams();
  const q = searchParams.get("q") ?? "";
  const [query, setQuery] = useState(q);
  const [activeTab, setActiveTab] = useState<
    "combined" | "users" | "posts" | "hashtags"
  >("combined");
  const [filters, setFilters] = useState({
    sortBy: "relevance" as "relevance" | "popularity" | "recent",
    timeframe: "all" as "day" | "week" | "month" | "all",
    limit: 20,
    offset: 0,
  });

  const {
    data: searchResults,
    isLoading,
    error,
    refetch,
  } = useSearch(query, activeTab, query.length >= 2);
  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.length >= 2) {
      refetch();
      //* Update URL without page reload
      const params = new URLSearchParams(searchParams);
      params.set("q", query);
      window.history.pushState({}, "", `?${params.toString()}`);
    }
  };

  const handleFilterChange = (
    key: keyof typeof filters,
    value: string | number
  ) => {
    setFilters((prev) => ({ ...prev, [key]: value }));
    //* Refetch with new filters after a short delay
    setTimeout(() => refetch(), 300);
  };

  return (
    <div className="">
      <BackBar type="Advance Search"/>
      <div className="container w-full sm:w-150 mt-15 mx-auto p-4 space-y-6">
        {/* Search Header */}
        <div className="space-y-4">
          <h1 className="text-3xl font-bold">Search</h1>
          <form onSubmit={handleSearch} className="relative">
            <div className="flex gap-2">
              <div className="flex-1 relative">
                <SearchIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                <Input
                  type="text"
                  placeholder="Search for users, posts, or hashtags..."
                  className="pl-10 pr-4 py-6 text-lg"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                />
              </div>
              <Button type="submit" size="lg" disabled={query.length < 2}>
                Search
              </Button>
            </div>
            {query.length > 0 && query.length < 2 && (
              <p className="text-sm text-destructive mt-2">
                Please enter at least 2 characters
              </p>
            )}
          </form>
          {/* Search Stats */}
          {searchResults && !isLoading && (
            <div className="flex items-center justify-between text-sm text-muted-foreground">
              <div>
                Found <span className="font-semibold">{searchResults.total}</span>{" "}
                results for &quot;{query}&quot;
              </div>
              <div className="flex items-center gap-4">
                <Select
                  value={filters.sortBy}
                  onValueChange={(value: string) =>
                    handleFilterChange("sortBy", value)
                  }
                >
                  <SelectTrigger className="w-[180px]">
                    <ArrowUpDown className="h-4 w-4 mr-2" />
                    <SelectValue placeholder="Sort by" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="relevance">Relevance</SelectItem>
                    <SelectItem value="popularity">Popularity</SelectItem>
                    <SelectItem value="recent">Most Recent</SelectItem>
                  </SelectContent>
                </Select>
                <Select
                  value={filters.timeframe}
                  onValueChange={(value: string | number) =>
                    handleFilterChange("timeframe", value)
                  }
                >
                  <SelectTrigger className="w-[180px]">
                    <Calendar className="h-4 w-4 mr-2" />
                    <SelectValue placeholder="Timeframe" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All time</SelectItem>
                    <SelectItem value="month">Past month</SelectItem>
                    <SelectItem value="week">Past week</SelectItem>
                    <SelectItem value="day">Past 24 hours</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          )}
        </div>
        {/* Main Content */}
        <Tabs
          value={activeTab}
          onValueChange={(value: string) => setActiveTab(value)}
          className="space-y-4"
        >
          <TabsList className="grid grid-cols-4 w-full">
            <TabsTrigger value="combined" className="flex items-center gap-2">
              <SearchIcon className="h-4 w-4" />
              All
            </TabsTrigger>
            <TabsTrigger value="users" className="flex items-center gap-2">
              <Users className="h-4 w-4" />
              Users
            </TabsTrigger>
            <TabsTrigger value="posts" className="flex items-center gap-2">
              <MessageSquare className="h-4 w-4" />
              Posts
            </TabsTrigger>
            <TabsTrigger value="hashtags" className="flex items-center gap-2">
              <Hash className="h-4 w-4" />
              Hashtags
            </TabsTrigger>
          </TabsList>
          {/* Loading State */}
          {isLoading && (
            <div className="space-y-4">
              {[...Array(5)].map((_, i) => (
                <Card key={i}>
                  <CardContent className="p-4">
                    <div className="flex items-center space-x-4">
                      <Skeleton className="h-12 w-12 rounded-full" />
                      <div className="space-y-2 flex-1">
                        <Skeleton className="h-4 w-[250px]" />
                        <Skeleton className="h-3 w-[200px]" />
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
          {/* Error State */}
          {error && (
            <Card>
              <CardContent className="p-6 text-center">
                <div className="text-destructive mb-2">
                  Error loading search results
                </div>
                <Button onClick={() => refetch()} variant="outline">
                  Try Again
                </Button>
              </CardContent>
            </Card>
          )}
          {/* Combined Results */}
          <TabsContent value="combined" className="space-y-6">
            {searchResults && !isLoading && (
              <>
                {/* Users Section */}
                {searchResults.users.length > 0 && (
                  <section>
                    <div className="flex items-center justify-between mb-4">
                      <h2 className="text-xl font-semibold flex items-center gap-2">
                        <Users className="h-5 w-5" />
                        Users ({searchResults.users.length})
                      </h2>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => setActiveTab("users")}
                      >
                        View all
                      </Button>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                      {searchResults.users.slice(0, 6).map((user) => (
                        <UserCard key={user.id} user={user} />
                      ))}
                    </div>
                  </section>
                )}
                {/* Posts Section */}
                {searchResults.posts.length > 0 && (
                  <section>
                    <div className="flex items-center justify-between mb-4">
                      <h2 className="text-xl font-semibold flex items-center gap-2">
                        <MessageSquare className="h-5 w-5" />
                        Posts ({searchResults.posts.length})
                      </h2>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => setActiveTab("posts")}
                      >
                        View all
                      </Button>
                    </div>
                    <div className="space-y-4">
                      {searchResults.posts.slice(0, 5).map((post) => (
                        <PostCard key={post.id} post={post} />
                      ))}
                    </div>
                  </section>
                )}
                {/* Hashtags Section */}
                {searchResults.hashtags.length > 0 && (
                  <section>
                    <div className="flex items-center justify-between mb-4">
                      <h2 className="text-xl font-semibold flex items-center gap-2">
                        <Hash className="h-5 w-5" />
                        Hashtags ({searchResults.hashtags.length})
                      </h2>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => setActiveTab("hashtags")}
                      >
                        View all
                      </Button>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {searchResults.hashtags.slice(0, 10).map((hashtag) => (
                        <HashtagCard key={hashtag.id} hashtag={hashtag} />
                      ))}
                    </div>
                  </section>
                )}
                {/* No Results */}
                {searchResults.total === 0 && (
                  <Card>
                    <CardContent className="p-6 text-center">
                      <div className="text-muted-foreground mb-2">
                        No results found for &quot;{query}&quot;
                      </div>
                      <p className="text-sm text-muted-foreground">
                        Try different keywords or check your spelling
                      </p>
                    </CardContent>
                  </Card>
                )}
              </>
            )}
          </TabsContent>
          {/* Users Tab */}
          <TabsContent value="users" className="space-y-4">
            {searchResults?.users.map((user) => (
              <UserCard key={user.id} user={user} />
            ))}
            {searchResults?.users.length === 0 && !isLoading && (
              <Card>
                <CardContent className="p-6 text-center">
                  <div className="text-muted-foreground">
                    No users found for &quot;{query}&quot;
                  </div>
                </CardContent>
              </Card>
            )}
          </TabsContent>
          {/* Posts Tab */}
          <TabsContent value="posts" className="space-y-4">
            {searchResults?.posts.map((post) => (
              <PostCard key={post.id} post={post} />
            ))}
            {searchResults?.posts.length === 0 && !isLoading && (
              <Card>
                <CardContent className="p-6 text-center">
                  <div className="text-muted-foreground">
                    No posts found for &quot;{query}&quot;
                  </div>
                </CardContent>
              </Card>
            )}
          </TabsContent>
          {/* Hashtags Tab */}
          <TabsContent value="hashtags">
            <div className="flex flex-wrap gap-2">
              {searchResults?.hashtags.map((hashtag) => (
                <HashtagCard key={hashtag.id} hashtag={hashtag} />
              ))}
              {searchResults?.hashtags.length === 0 && !isLoading && (
                <Card>
                  <CardContent className="p-6 text-center">
                    <div className="text-muted-foreground">
                      No hashtags found for &quot;{query}&quot;
                    </div>
                  </CardContent>
                </Card>
              )}
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}

function UserCard({ user }: { user: any }) {
  return (
    <Card className="hover:shadow-md cursor-pointer transition-shadow">
      <CardContent className="p-4">
        <Link
          href={`/${user.username}`}
          className="flex flex-col justify-between h-full items-start space-x-4"
        >
          <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center overflow-hidden">
            {user.avatar ? (
              <Image
                src={user.avatar}
                alt={user.username}
                className="h-full w-full object-cover"
                height={48}
                width={48}
              />
            ) : (
              <User className="h-6 w-6 text-primary" />
            )}
          </div>
          <div className="flex-1">
            <h3 className="font-semibold">
              {user.firstName} {user.lastName}
            </h3>
            <p className="text-sm text-muted-foreground">@{user.username}</p>
            {user.bio && (
              <p className="text-sm mt-2 line-clamp-2">{user.bio}</p>
            )}
          </div>
        </Link>
      </CardContent>
    </Card>
  );
}

// Post Card Component
// eslint-disable-next-line @typescript-eslint/no-explicit-any
function PostCard({ post }: { post: any }) {
  return (
    <Card className="hover:shadow-md transition-shadow">
      <CardContent className="p-4">
        <Link href={`/posts/${post.id}`} className="flex space-x-4">
          <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center overflow-hidden">
            {post.author.avatar ? (
              <Image
                src={post.author.avatar}
                alt={post.author.username}
                className="h-full w-full object-cover"
                height={40}
                width={40}
              />
            ) : (
              <User className="h-5 w-5 text-primary" />
            )}
          </div>
          <div className="flex-1 space-y-2">
            <div className="flex items-center space-x-2">
              <span className="font-semibold">
                {post.author.firstName} {post.author.lastName}
              </span>
              <span className="text-sm text-muted-foreground">
                @{post.author.username}
              </span>
            </div>
            <p className="text-sm">{post.content}</p>
            <div className="flex items-center gap-4 text-sm text-muted-foreground">
              <span>{new Date(post.createdAt).toLocaleDateString()}</span>
              <span>·</span>
              <span>{post.likeCount} likes</span>
              <span>·</span>
              <span>{post.replyCount} replies</span>
            </div>
          </div>
        </Link>
      </CardContent>
    </Card>
  );
}

//* Hashtag Card Component
function HashtagCard({
  hashtag,
}: {
  hashtag: {
    tag: string;
    postCount: number;
    usageCount: number;
  };
}) {
  return (
    <Card className="hover:shadow-md transition-shadow">
      <CardContent className="p-4">
        <Link
          href={`/hashtag/${hashtag.tag}`}
          className="flex items-center justify-between"
        >
          <div>
            <h3 className="font-semibold text-lg">#{hashtag.tag}</h3>
            <div className="flex items-center gap-4 text-sm text-muted-foreground mt-1">
              <span>{hashtag.postCount} posts</span>
              <span>·</span>
              <span>{hashtag.usageCount} uses</span>
            </div>
          </div>
          <Button variant="outline" size="sm">
            Follow
          </Button>
        </Link>
      </CardContent>
    </Card>
  );
}
