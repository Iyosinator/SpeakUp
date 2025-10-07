import { ReportReason } from "../types";

export const reportReasons: ReportReason[] = [
  {
    id: "harassment",
    icon: "🗯️",
    title: "Harassment, Bullying, or Hate Speech",
    description:
      "Attacks, insults, or threats based on identity, beliefs, or experiences.",
  },
  {
    id: "graphic_content",
    icon: "⚠️",
    title: "Graphic, Violent, or Triggering Content",
    description:
      "Explicit violence, blood, assault descriptions, or other triggering visuals.",
  },
  {
    id: "misinformation",
    icon: "🧠",
    title: "Misinformation or Unsafe Advice",
    description:
      "False or misleading information about health, safety, or sensitive topics.",
  },
  {
    id: "privacy",
    icon: "🔒",
    title: "Privacy Violation or Doxxing",
    description:
      "Revealing personal or identifying details about anyone without consent.",
  },
  {
    id: "spam",
    icon: "🚫",
    title: "Spam or Scam",
    description: "Unrelated links, money schemes, or fake offers.",
  },
  {
    id: "illegal_content",
    icon: "💣",
    title: "Terrorism or Illegal Content",
    description:
      "Promotes, supports, or incites violence, extremism, or illegal activity.",
  },
  {
    id: "adult_content",
    icon: "🔞",
    title: "Adult or Sexual Content",
    description:
      "Explicit sexual material, nudity, or sexually suggestive discussions.",
  },
  {
    id: "self_harm",
    icon: "🆘",
    title: "Self-Harm or Suicide Concern",
    description: "Someone expresses intent to harm themselves or others.",
  },
];
