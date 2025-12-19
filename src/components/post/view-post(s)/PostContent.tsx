"use client";

import { useState } from "react";
import Link from "next/link";

interface PostContentProps {
  content: string;
  id: string;
  maxLength?: number;
}

export default function PostContent({
  content,
  id,
  maxLength = 280,
}: PostContentProps) {
  const [expanded, setExpanded] = useState(false);

  const shouldTruncate = content.length > maxLength;
  const displayContent =
    expanded || !shouldTruncate ? content : `${content.slice(0, maxLength)}...`;

  //* Parse mentions and hashtags
  const parseContent = (text: string) => {
    const regex = /(@\w+)|(#\w+)/g;
    const parts = text.split(regex);

    return parts.map((part, index) => {
      if (!part) return null;

      if (part.startsWith("@")) {
        const username = part.slice(1);
        return (
          <Link
            key={index}
            href={`/${username}`}
            className="text-sky-500 hover:underline font-medium"
            onClick={(e) => e.stopPropagation()}
          >
            {part}
          </Link>
        );
      }

      if (part.startsWith("#")) {
        const tag = part.slice(1);
        return (
          <Link
            key={index}
            href={`/hashtag/${tag}`}
            className="text-sky-500 hover:underline font-medium"
            onClick={(e) => e.stopPropagation()}
          >
            {part}
          </Link>
        );
      }

      return (
        <Link href={`posts/${id}`} key={index}>
          {part}
        </Link>
      );
    });
  };

  return (
    <div className="mb-3">
      <p className=" whitespace-pre-wrap wrap-break-words">
        {parseContent(displayContent)}
      </p>

      {shouldTruncate && !expanded && (
        <button
          onClick={() => setExpanded(true)}
          className="text-sky-500 hover:text-sky-600 text-sm mt-1"
        >
          Show more
        </button>
      )}
    </div>
  );
}
