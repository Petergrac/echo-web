'use client';

import { Heart, Repeat2, Bookmark, MessageCircle } from 'lucide-react';

interface EngagementBadgeProps {
  type: 'like' | 'repost' | 'bookmark' | 'reply';
  showText?: boolean;
}

export default function EngagementBadge({ type, showText = false }: EngagementBadgeProps) {
  const config = {
    like: {
      icon: Heart,
      text: 'Liked',
      color: 'text-red-500 bg-red-500/10',
      iconColor: 'text-red-500',
    },
    repost: {
      icon: Repeat2,
      text: 'Reposted',
      color: 'text-green-500 bg-green-500/10',
      iconColor: 'text-green-500',
    },
    bookmark: {
      icon: Bookmark,
      text: 'Bookmarked',
      color: 'text-yellow-500 bg-yellow-500/10',
      iconColor: 'text-yellow-500',
    },
    reply: {
      icon: MessageCircle,
      text: 'Replied',
      color: 'text-sky-500 bg-sky-500/10',
      iconColor: 'text-sky-500',
    },
  };

  const { icon: Icon, text, color, iconColor } = config[type];

  return (
    <div className={`inline-flex items-center px-2 py-1 rounded-full text-xs ${color}`}>
      <Icon className={`w-3 h-3 mr-1 ${iconColor}`} />
      {showText && <span>{text}</span>}
    </div>
  );
}