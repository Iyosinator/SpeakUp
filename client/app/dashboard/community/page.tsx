"use client";

import React, { useState, useEffect, useCallback } from "react";
import {
  Plus,
  Search,
  Heart,
  MessageCircle,
  Flag,
  Send,
  ShieldCheck,
  Users,
  AlertCircle,
  X,
  Check,
  Bell,
  Shield,
  Home,
  FileText,
  MessageCircle as MessageCircleIcon,
  BookOpen,
  Settings,
  Menu,
  Moon,
  Sun,
} from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Textarea } from "@/components/ui/textarea";
import { supabase } from "../../../lib/supabaseClient";
import { useDebounce } from "../../../hooks/useDebounce";
import { useSession } from "../../../hooks/useSession";

// Types
interface Comment {
  id: string;
  author_name: string;
  content: string;
  created_at: string;
  session_id: string;
}

interface Post {
  id: string;
  author_name: string;
  title: string;
  content: string;
  tag: string;
  likes: number;
  comments_count: number;
  created_at: string;
  liked_by_user?: boolean;
  comments?: Comment[];
  showComments?: boolean;
}

interface Stat {
  id: number;
  label: string;
  value: string;
}

const POSTS_PER_PAGE = 10;

// Navigation items
const navItems = [
  { icon: Home, label: "Home", href: "/dashboard" },
  { icon: FileText, label: "File a Report", href: "/dashboard/report" },
  { icon: Users, label: "Community Support", href: "/dashboard/community" },
  {
    icon: MessageCircleIcon,
    label: "Counseling Support",
    href: "/dashboard/counseling",
  },
  { icon: BookOpen, label: "Resources Hub", href: "/dashboard/resources" },
  { icon: Settings, label: "Settings", href: "/dashboard/settings" },
  { icon: AlertCircle, label: "SOS", href: "/dashboard/sos", highlight: true },
];

// Header Component
function DashboardHeader() {
  const [theme, setTheme] = useState("light");

  return (
    <header className="sticky top-0 z-40 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="flex h-16 items-center justify-between px-6">
        <Link
          href="/"
          className="flex items-center gap-2 transition-opacity hover:opacity-80"
        >
          <Shield className="h-6 w-6 text-primary" />
          <span className="font-heading text-xl font-bold text-primary">
            SpeakUp
          </span>
        </Link>

        <div className="flex items-center gap-3">
          <Button variant="ghost" size="icon" className="relative rounded-full">
            <Bell className="h-5 w-5" />
            <Badge className="absolute -right-1 -top-1 h-5 w-5 rounded-full p-0 text-xs flex items-center justify-center">
              3
            </Badge>
          </Button>

          <Button
            variant="ghost"
            size="icon"
            className="rounded-full"
            onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
          >
            {theme === "dark" ? (
              <Sun className="h-5 w-5" />
            ) : (
              <Moon className="h-5 w-5" />
            )}
          </Button>

          <Link href="/dashboard/sos">
            <Button
              size="sm"
              className="rounded-full bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              SOS
            </Button>
          </Link>
        </div>
      </div>
    </header>
  );
}

// Sidebar Component
function DashboardSidebar() {
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <Button
        variant="ghost"
        size="icon"
        className="fixed left-4 top-4 z-50 lg:hidden"
        onClick={() => setIsOpen(!isOpen)}
      >
        {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
      </Button>

      <aside
        className={`fixed inset-y-0 left-0 z-40 w-64 transform border-r border-border bg-card transition-transform lg:relative lg:translate-x-0 ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <nav className="flex h-full flex-col gap-2 p-4 pt-20 lg:pt-4">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setIsOpen(false)}
                className={`flex items-center gap-3 rounded-lg px-4 py-3 transition-colors ${
                  item.highlight
                    ? "bg-destructive/10 text-destructive hover:bg-destructive/20"
                    : isActive
                    ? "bg-primary/10 text-primary"
                    : "text-muted-foreground hover:bg-muted hover:text-foreground"
                }`}
              >
                <Icon className="h-5 w-5" />
                <span className="font-medium">{item.label}</span>
              </Link>
            );
          })}
        </nav>
      </aside>

      {isOpen && (
        <div
          className="fixed inset-0 z-30 bg-background/80 backdrop-blur-sm lg:hidden"
          onClick={() => setIsOpen(false)}
        />
      )}
    </>
  );
}

// New Post Modal Component
function NewPostModal({
  isOpen,
  onClose,
  onPostCreated,
}: {
  isOpen: boolean;
  onClose: () => void;
  onPostCreated: (post: Post) => void;
}) {
  const sessionId = useSession();
  const [isAnonymous, setIsAnonymous] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handlePost = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!sessionId) {
      setError("Session not found. Please refresh the page.");
      return;
    }
    setIsSubmitting(true);
    setError(null);

    const formData = new FormData(e.currentTarget);
    const title = formData.get("title") as string;
    const tag = formData.get("category") as string;
    const content = formData.get("message") as string;
    const formName = formData.get("name") as string;

    const author_name = isAnonymous
      ? `User-${sessionId.substring(0, 4)}`
      : formName || `User-${sessionId.substring(0, 4)}`;

    const { data, error } = await supabase
      .from("posts")
      .insert({
        title,
        tag,
        content,
        author_name,
        session_id: sessionId,
        likes: 0,
        comments_count: 0,
      })
      .select()
      .single();

    if (error) {
      console.error("Error creating post:", error);
      setError(`Failed to publish post: ${error.message}`);
      setIsSubmitting(false);
    } else if (data) {
      onPostCreated(data as Post);
      onClose();
      setTimeout(() => {
        setIsSubmitting(false);
        (e.target as HTMLFormElement).reset();
        setIsAnonymous(true);
        setError(null);
      }, 300);
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="fixed inset-0 bg-black/70 backdrop-blur-sm flex justify-center items-center z-50 p-4"
        >
          <motion.div
            initial={{ scale: 0.95, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.95, opacity: 0, y: 20 }}
            transition={{ duration: 0.2 }}
            onClick={(e) => e.stopPropagation()}
            className="bg-card rounded-xl shadow-2xl w-full max-w-lg p-6 sm:p-8 relative border"
          >
            <button
              onClick={onClose}
              className="absolute top-4 right-4 text-muted-foreground hover:text-foreground transition-colors"
            >
              <X size={24} />
            </button>

            <div className="mb-6">
              <h2 className="text-2xl font-bold text-foreground">
                Share Your Story
              </h2>
              <p className="text-muted-foreground mt-1">
                Your voice matters. Share your experience, ask for advice, or
                offer support to others.
              </p>
            </div>

            <form onSubmit={handlePost} className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">
                  Title <span className="text-primary">*</span>
                </label>
                <input
                  type="text"
                  name="title"
                  placeholder="Give your post a title"
                  required
                  className="w-full bg-background border rounded-lg px-4 py-3 text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-foreground mb-2">
                  Category <span className="text-primary">*</span>
                </label>
                <select
                  name="category"
                  required
                  defaultValue=""
                  className="w-full bg-background border rounded-lg px-4 py-3 text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                >
                  <option value="" disabled>
                    Select a category
                  </option>
                  <option value="Success Story">Success Story</option>
                  <option value="Advice">Advice</option>
                  <option value="Venting">Venting</option>
                  <option value="Question">Question</option>
                  <option value="Resources">Resources</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-foreground mb-2">
                  Your Message <span className="text-primary">*</span>
                </label>
                <textarea
                  name="message"
                  rows={5}
                  placeholder="Share your thoughts..."
                  required
                  className="w-full bg-background border rounded-lg px-4 py-3 text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary resize-none"
                ></textarea>
              </div>

              <div className="bg-muted rounded-lg p-4 flex items-start gap-4">
                <button
                  type="button"
                  onClick={() => setIsAnonymous(!isAnonymous)}
                  className={`flex-shrink-0 w-6 h-6 mt-1 rounded-md flex items-center justify-center transition-colors ${
                    isAnonymous
                      ? "bg-primary"
                      : "bg-transparent border-2 border-muted-foreground"
                  }`}
                >
                  {isAnonymous && (
                    <Check size={16} className="text-primary-foreground" />
                  )}
                </button>
                <div>
                  <h4 className="font-semibold text-foreground">
                    Post anonymously
                  </h4>
                  <p className="text-muted-foreground text-sm">
                    Your identity will remain private
                  </p>
                </div>
              </div>

              {!isAnonymous && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  className="overflow-hidden"
                >
                  <label className="block text-sm font-medium text-foreground mb-2">
                    Your Name (optional)
                  </label>
                  <input
                    type="text"
                    name="name"
                    placeholder="Enter your name"
                    className="w-full bg-background border rounded-lg px-4 py-3 text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                  />
                </motion.div>
              )}

              {error && (
                <p className="text-destructive text-sm bg-destructive/10 border border-destructive/20 rounded-lg p-3">
                  {error}
                </p>
              )}

              <div className="flex justify-end gap-4 pt-4">
                <Button
                  type="button"
                  onClick={onClose}
                  disabled={isSubmitting}
                  variant="outline"
                >
                  Cancel
                </Button>
                <Button type="submit" disabled={isSubmitting || !sessionId}>
                  {isSubmitting ? "Publishing..." : "Publish Post"}
                </Button>
              </div>
            </form>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

// Main Component
export default function CommunityFeedPage() {
  const sessionId = useSession();
  const [filter, setFilter] = useState("All Posts");
  const [searchQuery, setSearchQuery] = useState("");
  const debouncedSearch = useDebounce(searchQuery, 500);

  const [posts, setPosts] = useState<Post[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [page, setPage] = useState(0);
  const [hasMore, setHasMore] = useState(true);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [isNewPostModalOpen, setIsNewPostModalOpen] = useState(false);

  const [loadingComments, setLoadingComments] = useState<{
    [key: string]: boolean;
  }>({});
  const [commentInputs, setCommentInputs] = useState<{ [key: string]: string }>(
    {}
  );
  const [submittingComment, setSubmittingComment] = useState<{
    [key: string]: boolean;
  }>({});

  const [stats, setStats] = useState<Stat[]>([]);
  const [statsLoading, setStatsLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      const { data, error } = await supabase
        .from("community_stats")
        .select("*")
        .order("id");
      if (error) console.error("Error fetching stats:", error);
      else setStats(data as Stat[]);
      setStatsLoading(false);
    };
    fetchStats();
  }, []);

  const fetchPosts = useCallback(
    async (pageNum: number = 0, isNewSearch: boolean = false) => {
      if (!sessionId) return;

      if (isNewSearch) {
        setIsLoading(true);
        setPosts([]);
      } else {
        setIsLoadingMore(true);
      }

      const from = pageNum * POSTS_PER_PAGE;
      const to = from + POSTS_PER_PAGE - 1;

      let query = supabase
        .from("posts")
        .select("*, post_likes!left(session_id)")
        .order("created_at", { ascending: false })
        .range(from, to);

      if (debouncedSearch) query = query.ilike("title", `%${debouncedSearch}%`);
      if (filter !== "All Posts") query = query.eq("tag", filter);
      query = query.eq("post_likes.session_id", sessionId);

      const { data, error } = await query;

      if (error) {
        console.error("Error fetching posts:", error);
      } else if (data) {
        const formattedPosts = data.map((p) => ({
          ...p,
          liked_by_user: p.post_likes.length > 0,
          comments: [],
          showComments: false,
        }));

        if (isNewSearch) {
          setPosts(formattedPosts);
        } else {
          setPosts((prev) => [...prev, ...formattedPosts]);
        }

        setHasMore(data.length === POSTS_PER_PAGE);
        setPage(pageNum);
      }

      setIsLoading(false);
      setIsLoadingMore(false);
    },
    [sessionId, debouncedSearch, filter]
  );

  const fetchComments = async (postId: string) => {
    setLoadingComments((prev) => ({ ...prev, [postId]: true }));

    const { data, error } = await supabase
      .from("comments")
      .select("*")
      .eq("post_id", postId)
      .order("created_at", { ascending: true });

    if (error) {
      console.error("Error fetching comments:", error);
    } else {
      setPosts((prevPosts) =>
        prevPosts.map((post) =>
          post.id === postId ? { ...post, comments: data as Comment[] } : post
        )
      );
    }

    setLoadingComments((prev) => ({ ...prev, [postId]: false }));
  };

  const toggleComments = async (postId: string) => {
    const post = posts.find((p) => p.id === postId);

    if (
      !post?.showComments &&
      (!post?.comments || post.comments.length === 0)
    ) {
      await fetchComments(postId);
    }

    setPosts((prevPosts) =>
      prevPosts.map((p) =>
        p.id === postId ? { ...p, showComments: !p.showComments } : p
      )
    );
  };

  const handleSubmitComment = async (postId: string) => {
    if (!sessionId || !commentInputs[postId]?.trim()) return;

    setSubmittingComment((prev) => ({ ...prev, [postId]: true }));

    const { data, error } = await supabase
      .from("comments")
      .insert({
        post_id: postId,
        session_id: sessionId,
        author_name: `User-${sessionId.substring(0, 4)}`,
        content: commentInputs[postId].trim(),
      })
      .select()
      .single();

    if (error) {
      console.error("Error posting comment:", error);
    } else if (data) {
      setPosts((prevPosts) =>
        prevPosts.map((post) => {
          if (post.id === postId) {
            return {
              ...post,
              comments: [...(post.comments || []), data as Comment],
              comments_count: post.comments_count + 1,
            };
          }
          return post;
        })
      );
      setCommentInputs((prev) => ({ ...prev, [postId]: "" }));
    }

    setSubmittingComment((prev) => ({ ...prev, [postId]: false }));
  };

  const handleLike = async (postId: string) => {
    if (!sessionId) return;

    setPosts((prevPosts) =>
      prevPosts.map((post) => {
        if (post.id === postId) {
          const liked = !post.liked_by_user;
          return {
            ...post,
            liked_by_user: liked,
            likes: liked ? post.likes + 1 : post.likes - 1,
          };
        }
        return post;
      })
    );

    const { error } = await supabase.rpc("toggle_like", {
      p_post_id: postId,
      p_session_id: sessionId,
    });

    if (error) {
      console.error("Error toggling like:", error);
      fetchPosts(0, true);
    }
  };

  const handlePostCreated = (newPost: Post) => {
    setPosts((prev) => [
      { ...newPost, liked_by_user: false, comments: [], showComments: false },
      ...prev,
    ]);
  };

  const timeAgo = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const seconds = Math.floor((now.getTime() - date.getTime()) / 1000);

    let interval = seconds / 31536000;
    if (interval > 1) return Math.floor(interval) + " years ago";
    interval = seconds / 2592000;
    if (interval > 1) return Math.floor(interval) + " months ago";
    interval = seconds / 86400;
    if (interval > 1) return Math.floor(interval) + " days ago";
    interval = seconds / 3600;
    if (interval > 1) return Math.floor(interval) + " hours ago";
    interval = seconds / 60;
    if (interval > 1) return Math.floor(interval) + " minutes ago";
    return "Just now";
  };

  const getTagColor = (tag: string) => {
    switch (tag) {
      case "Success Story":
        return "bg-green-500/10 text-green-700 border-green-500/20";
      case "Advice":
        return "bg-blue-500/10 text-blue-700 border-blue-500/20";
      case "Resources":
        return "bg-purple-500/10 text-purple-700 border-purple-500/20";
      case "Venting":
        return "bg-orange-500/10 text-orange-700 border-orange-500/20";
      case "Question":
        return "bg-indigo-500/10 text-indigo-700 border-indigo-500/20";
      default:
        return "bg-gray-500/10 text-gray-700 border-gray-500/20";
    }
  };

  const getInitials = (name: string) => {
    if (name.startsWith("User-")) return "A";
    const parts = name.split(" ");
    return parts.length > 1 ? parts[0][0] + parts[1][0] : name.substring(0, 2);
  };

  useEffect(() => {
    if (sessionId) {
      fetchPosts(0, true);
    }
  }, [sessionId, debouncedSearch, filter, fetchPosts]);

  return (
    <div className="flex min-h-screen bg-background">
      {/* Sidebar */}
      <DashboardSidebar />

      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        {/* Header */}
        <DashboardHeader />

        {/* Page Content */}
        <main className="flex-1">
          <div className="container mx-auto max-w-7xl p-6 space-y-6">
            {/* Page Header */}
            <div className="flex flex-col md:flex-row justify-between md:items-center gap-4">
              <div>
                <h1 className="text-4xl font-bold text-foreground">
                  Community Support
                </h1>
                <p className="text-muted-foreground mt-2">
                  A safe space to share, connect, and support each other
                </p>
              </div>
              <Button
                size="lg"
                className="gap-2"
                onClick={() => setIsNewPostModalOpen(true)}
              >
                <Plus className="h-5 w-5" />
                New Post
              </Button>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Main Feed */}
              <div className="lg:col-span-2 space-y-6">
                {/* Filters */}
                <Card className="p-4">
                  <div className="flex flex-col sm:flex-row gap-4">
                    <div className="relative flex-1">
                      <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                      <Input
                        placeholder="Search posts..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="pl-9"
                      />
                    </div>
                    <select
                      value={filter}
                      onChange={(e) => setFilter(e.target.value)}
                      className="px-4 py-2 rounded-md border bg-background"
                    >
                      <option>All Posts</option>
                      <option>Advice</option>
                      <option>Success Story</option>
                      <option>Resources</option>
                      <option>Venting</option>
                      <option>Question</option>
                    </select>
                  </div>
                </Card>

                {/* Safety Reminder */}
                <Card className="border-primary/20 bg-primary/5 p-4">
                  <p className="text-sm text-foreground">
                    <span className="font-semibold">Safety Reminder:</span> If
                    you are in immediate danger, please use the SOS button or
                    contact emergency services.
                  </p>
                </Card>

                {/* Posts */}
                {isLoading ? (
                  <div className="text-center py-12">Loading...</div>
                ) : posts.length === 0 ? (
                  <Card className="p-12 text-center">
                    <p className="text-muted-foreground">
                      No posts found. Be the first to share!
                    </p>
                  </Card>
                ) : (
                  <div className="space-y-4">
                    {posts.map((post) => (
                      <Card key={post.id} className="overflow-hidden">
                        <div className="p-6">
                          <div className="flex items-start justify-between mb-3">
                            <div className="flex items-center gap-3">
                              <Avatar className="h-10 w-10">
                                <AvatarFallback className="bg-primary/10 text-primary font-semibold">
                                  {getInitials(post.author_name)}
                                </AvatarFallback>
                              </Avatar>
                              <div>
                                <span className="text-sm font-semibold">
                                  {post.author_name}
                                </span>
                                <div className="text-xs text-muted-foreground">
                                  {timeAgo(post.created_at)}
                                </div>
                              </div>
                            </div>
                            <Button variant="ghost" size="icon">
                              <Flag className="h-4 w-4" />
                            </Button>
                          </div>

                          <h3 className="font-bold text-lg mb-2">
                            {post.title}
                          </h3>
                          <p className="text-foreground mb-4">{post.content}</p>

                          <div className="flex items-center justify-between pt-2 border-t">
                            <div className="flex items-center gap-1">
                              <Button
                                variant="ghost"
                                size="sm"
                                className={`gap-2 ${
                                  post.liked_by_user ? "text-red-500" : ""
                                }`}
                                onClick={() => handleLike(post.id)}
                              >
                                <Heart
                                  className={`h-4 w-4 ${
                                    post.liked_by_user ? "fill-current" : ""
                                  }`}
                                />
                                <span>{post.likes}</span>
                              </Button>
                              <Button
                                variant="ghost"
                                size="sm"
                                className="gap-2"
                                onClick={() => toggleComments(post.id)}
                              >
                                <MessageCircle className="h-4 w-4" />
                                <span>{post.comments_count}</span>
                              </Button>
                            </div>
                            <Badge
                              className={`border ${getTagColor(post.tag)}`}
                            >
                              {post.tag}
                            </Badge>
                          </div>
                        </div>

                        {/* Comments */}
                        <AnimatePresence>
                          {post.showComments && (
                            <motion.div
                              initial={{ height: 0, opacity: 0 }}
                              animate={{ height: "auto", opacity: 1 }}
                              exit={{ height: 0, opacity: 0 }}
                              transition={{ duration: 0.2 }}
                              className="border-t bg-muted/30 overflow-hidden"
                            >
                              <div className="p-6 space-y-4">
                                <h4 className="font-semibold">Comments</h4>

                                {loadingComments[post.id] ? (
                                  <div className="text-center py-4 text-muted-foreground">
                                    Loading comments...
                                  </div>
                                ) : post.comments &&
                                  post.comments.length > 0 ? (
                                  <div className="space-y-3">
                                    {post.comments.map((comment) => (
                                      <div
                                        key={comment.id}
                                        className="bg-background rounded-lg p-4"
                                      >
                                        <div className="flex items-start gap-3">
                                          <Avatar className="h-8 w-8">
                                            <AvatarFallback className="text-xs">
                                              {getInitials(comment.author_name)}
                                            </AvatarFallback>
                                          </Avatar>
                                          <div className="flex-1">
                                            <div className="flex items-center gap-2 mb-1">
                                              <span className="text-sm font-medium">
                                                {comment.author_name}
                                              </span>
                                              <span className="text-xs text-muted-foreground">
                                                •
                                              </span>
                                              <span className="text-xs text-muted-foreground">
                                                {timeAgo(comment.created_at)}
                                              </span>
                                            </div>
                                            <p className="text-sm">
                                              {comment.content}
                                            </p>
                                          </div>
                                        </div>
                                      </div>
                                    ))}
                                  </div>
                                ) : (
                                  <p className="text-sm text-muted-foreground text-center py-4">
                                    No comments yet. Be the first to reply!
                                  </p>
                                )}

                                {/* Add Comment */}
                                <div className="pt-4 border-t flex gap-3">
                                  <Avatar className="h-8 w-8">
                                    <AvatarFallback className="text-xs">
                                      You
                                    </AvatarFallback>
                                  </Avatar>
                                  <div className="flex-1 space-y-2">
                                    <Textarea
                                      placeholder="Add a comment..."
                                      value={commentInputs[post.id] || ""}
                                      onChange={(e) =>
                                        setCommentInputs({
                                          ...commentInputs,
                                          [post.id]: e.target.value,
                                        })
                                      }
                                      onKeyDown={(e) => {
                                        if (
                                          e.key === "Enter" &&
                                          !e.shiftKey &&
                                          commentInputs[post.id]?.trim()
                                        ) {
                                          e.preventDefault();
                                          handleSubmitComment(post.id);
                                        }
                                      }}
                                      className="min-h-[80px]"
                                      disabled={submittingComment[post.id]}
                                    />
                                    <div className="flex justify-end">
                                      <Button
                                        size="sm"
                                        onClick={() =>
                                          handleSubmitComment(post.id)
                                        }
                                        disabled={
                                          submittingComment[post.id] ||
                                          !commentInputs[post.id]?.trim()
                                        }
                                        className="gap-2"
                                      >
                                        <Send className="h-3 w-3" />
                                        {submittingComment[post.id]
                                          ? "Posting..."
                                          : "Post"}
                                      </Button>
                                    </div>
                                  </div>
                                </div>
                              </div>
                            </motion.div>
                          )}
                        </AnimatePresence>
                      </Card>
                    ))}
                  </div>
                )}

                {hasMore && posts.length > 0 && (
                  <div className="text-center">
                    <Button
                      variant="outline"
                      onClick={() => fetchPosts(page + 1, false)}
                      disabled={isLoadingMore}
                    >
                      {isLoadingMore ? "Loading..." : "Load More Posts"}
                    </Button>
                  </div>
                )}
              </div>

              {/* Sidebar */}
              <aside className="space-y-6">
                <Card className="p-6">
                  <h2 className="text-xl font-semibold mb-4">
                    Community Guidelines
                  </h2>
                  <div className="space-y-4">
                    <div className="flex gap-3">
                      <Heart className="h-5 w-5 text-primary flex-shrink-0" />
                      <div>
                        <h3 className="font-medium">Be Supportive</h3>
                        <p className="text-sm text-muted-foreground">
                          Offer kindness and understanding
                        </p>
                      </div>
                    </div>
                    <div className="flex gap-3">
                      <ShieldCheck className="h-5 w-5 text-primary flex-shrink-0" />
                      <div>
                        <h3 className="font-medium">Respect Privacy</h3>
                        <p className="text-sm text-muted-foreground">
                          Never share personal information
                        </p>
                      </div>
                    </div>
                    <div className="flex gap-3">
                      <Users className="h-5 w-5 text-primary flex-shrink-0" />
                      <div>
                        <h3 className="font-medium">Stay Anonymous</h3>
                        <p className="text-sm text-muted-foreground">
                          Use anonymous mode to protect identity
                        </p>
                      </div>
                    </div>
                    <div className="flex gap-3">
                      <AlertCircle className="h-5 w-5 text-primary flex-shrink-0" />
                      <div>
                        <h3 className="font-medium">Report Concerns</h3>
                        <p className="text-sm text-muted-foreground">
                          Flag inappropriate content
                        </p>
                      </div>
                    </div>
                  </div>
                </Card>

                <Card className="p-6">
                  <h2 className="text-xl font-semibold mb-4">
                    Community Stats
                  </h2>
                  {statsLoading ? (
                    <div className="space-y-3 animate-pulse">
                      <div className="h-4 bg-muted rounded" />
                      <div className="h-4 bg-muted rounded" />
                      <div className="h-4 bg-muted rounded" />
                    </div>
                  ) : (
                    <div className="space-y-3">
                      {stats.map((stat) => (
                        <div key={stat.id} className="flex justify-between">
                          <span className="text-sm text-muted-foreground">
                            {stat.label}
                          </span>
                          <span className="font-semibold">{stat.value}</span>
                        </div>
                      ))}
                    </div>
                  )}
                </Card>
              </aside>
            </div>
          </div>
        </main>
      </div>

      {/* New Post Modal */}
      <NewPostModal
        isOpen={isNewPostModalOpen}
        onClose={() => setIsNewPostModalOpen(false)}
        onPostCreated={handlePostCreated}
      />
    </div>
  );
}
