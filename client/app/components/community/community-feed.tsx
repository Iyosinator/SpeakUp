"use client";

import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Heart, MessageCircle, Flag, Search } from "lucide-react";
import { Badge } from "@/components/ui/badge";

const mockPosts = [
  {
    id: 1,
    author: "Anonymous User",
    title: "Finding strength after leaving an abusive relationship",
    content:
      "It's been 6 months since I left, and I want to share that it does get better. Some days are harder than others, but I'm learning to trust myself again. To anyone going through this - you're not alone.",
    category: "Success Story",
    reactions: 47,
    replies: 12,
    timestamp: "2 hours ago",
  },
  {
    id: 2,
    author: "Hope_Seeker",
    title: "Need advice on talking to a counselor for the first time",
    content:
      "I've finally decided to reach out for professional help, but I'm nervous about the first session. What should I expect? Any tips on how to prepare?",
    category: "Advice",
    reactions: 23,
    replies: 8,
    timestamp: "5 hours ago",
  },
  {
    id: 3,
    author: "Anonymous User",
    title: "Resources that helped me heal",
    content:
      "I wanted to share some books and podcasts that really helped me during my recovery journey. Sometimes just knowing others have been through similar experiences makes all the difference.",
    category: "Resources",
    reactions: 65,
    replies: 19,
    timestamp: "1 day ago",
  },
];

export function CommunityFeed() {
  const [filter, setFilter] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");

  return (
    <div className="space-y-6">
      {/* Filters & Search */}
      <Card className="p-4">
        <div className="flex flex-col gap-4 sm:flex-row">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Search posts..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9"
            />
          </div>
          <Select value={filter} onValueChange={setFilter}>
            <SelectTrigger className="w-full sm:w-[180px]">
              <SelectValue placeholder="Filter by category" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Posts</SelectItem>
              <SelectItem value="advice">Advice</SelectItem>
              <SelectItem value="success">Success Stories</SelectItem>
              <SelectItem value="resources">Resources</SelectItem>
              <SelectItem value="support">General Support</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </Card>

      {/* Safety Reminder */}
      <Card className="border-primary/20 bg-primary/5 p-4">
        <p className="text-sm text-foreground">
          <span className="font-semibold">Safety Reminder:</span> If you are in
          immediate danger, please use the SOS button or contact emergency
          services.
        </p>
      </Card>

      {/* Posts Feed */}
      <div className="space-y-4">
        {mockPosts.map((post) => (
          <Card key={post.id} className="p-6 transition-shadow hover:shadow-lg">
            <div className="mb-3 flex items-start justify-between">
              <div className="flex-1">
                <div className="mb-2 flex items-center gap-2">
                  <span className="text-sm font-medium text-muted-foreground">
                    {post.author}
                  </span>
                  <span className="text-xs text-muted-foreground">•</span>
                  <span className="text-xs text-muted-foreground">
                    {post.timestamp}
                  </span>
                </div>
                <h3 className="font-heading text-lg font-semibold text-foreground">
                  {post.title}
                </h3>
              </div>
              <Button variant="ghost" size="icon" className="flex-shrink-0">
                <Flag className="h-4 w-4" />
              </Button>
            </div>

            <p className="mb-4 text-foreground">{post.content}</p>

            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <Button variant="ghost" size="sm" className="gap-2">
                  <Heart className="h-4 w-4" />
                  <span>{post.reactions}</span>
                </Button>
                <Button variant="ghost" size="sm" className="gap-2">
                  <MessageCircle className="h-4 w-4" />
                  <span>{post.replies}</span>
                </Button>
              </div>
              <Badge variant="secondary">{post.category}</Badge>
            </div>
          </Card>
        ))}
      </div>

      {/* Load More */}
      <div className="text-center">
        <Button variant="outline">Load More Posts</Button>
      </div>
    </div>
  );
}
