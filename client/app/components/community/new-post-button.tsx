"use client"
import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Checkbox } from "@/components/ui/checkbox"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Plus } from "lucide-react"

export function NewPostButton() {
  const [open, setOpen] = useState(false)
  const [isAnonymous, setIsAnonymous] = useState(true)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // Handle post submission
    setOpen(false)
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button size="lg" className="gap-2">
          <Plus className="h-5 w-5" />
          New Post
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle className="font-heading text-2xl">Share Your Story</DialogTitle>
          <DialogDescription>
            Your voice matters. Share your experience, ask for advice, or offer support to others.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="post-title">Title *</Label>
            <Input id="post-title" placeholder="Give your post a title" required />
          </div>

          <div>
            <Label htmlFor="post-category">Category *</Label>
            <Select required>
              <SelectTrigger id="post-category">
                <SelectValue placeholder="Select a category" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="advice">Advice</SelectItem>
                <SelectItem value="success">Success Story</SelectItem>
                <SelectItem value="resources">Resources</SelectItem>
                <SelectItem value="support">General Support</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label htmlFor="post-content">Your Message *</Label>
            <Textarea
              id="post-content"
              placeholder="Share your thoughts, experiences, or questions..."
              className="min-h-[150px]"
              required
            />
          </div>

          <div className="flex items-start gap-3 rounded-lg bg-muted p-4">
            <Checkbox
              id="post-anonymous"
              checked={isAnonymous}
              onCheckedChange={(checked) => setIsAnonymous(checked as boolean)}
            />
            <div className="flex-1">
              <Label htmlFor="post-anonymous" className="cursor-pointer font-medium">
                Post anonymously
              </Label>
              <p className="mt-1 text-xs text-muted-foreground">Your identity will remain private</p>
            </div>
          </div>

          <div className="flex justify-end gap-3">
            <Button type="button" variant="outline" onClick={() => setOpen(false)}>
              Cancel
            </Button>
            <Button type="submit">Publish Post</Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}
