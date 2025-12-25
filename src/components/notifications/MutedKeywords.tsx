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
import { Hash } from "lucide-react";
import { NotPrefDto } from "@/types/notification";

interface MutedKeywordsProps {
  preferences: NotPrefDto;
  onUpdate: <K extends keyof NotPrefDto>(key: K, value: NotPrefDto[K]) => void;
}

export default function MutedKeywords({
  preferences,
  onUpdate,
}: MutedKeywordsProps) {
  const [newKeyword, setNewKeyword] = useState("");

  const addKeyword = () => {
    if (
      newKeyword.trim() &&
      !preferences.mutedKeywords.includes(newKeyword.trim())
    ) {
      onUpdate("mutedKeywords", [
        ...preferences.mutedKeywords,
        newKeyword.trim(),
      ]);
      setNewKeyword("");
    }
  };

  const removeKeyword = (keyword: string) => {
    onUpdate(
      "mutedKeywords",
      preferences.mutedKeywords.filter((k) => k !== keyword)
    );
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      e.preventDefault();
      addKeyword();
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Hash className="h-5 w-5" />
          Muted Keywords
        </CardTitle>
        <CardDescription>
          Keywords that will trigger notification muting
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="flex gap-2">
            <Input
              placeholder="Enter keyword or phrase"
              value={newKeyword}
              onChange={(e) => setNewKeyword(e.target.value)}
              onKeyDown={handleKeyDown}
            />
            <Button onClick={addKeyword} variant="outline">
              Add
            </Button>
          </div>
          <MutedKeywordsList
            keywords={preferences.mutedKeywords}
            onRemove={removeKeyword}
          />
        </div>
      </CardContent>
    </Card>
  );
}

interface MutedKeywordsListProps {
  keywords: string[];
  onRemove: (keyword: string) => void;
}

function MutedKeywordsList({ keywords, onRemove }: MutedKeywordsListProps) {
  if (keywords.length === 0) {
    return <p className="text-sm text-muted-foreground">No keywords muted</p>;
  }

  return (
    <div className="flex flex-wrap gap-2">
      {keywords.map((keyword) => (
        <Badge key={keyword} variant="outline" className="px-3 py-1">
          {keyword}
          <button
            className="ml-2 text-muted-foreground hover:text-foreground"
            onClick={() => onRemove(keyword)}
            aria-label={`Remove ${keyword}`}
          >
            ×
          </button>
        </Badge>
      ))}
    </div>
  );
}
