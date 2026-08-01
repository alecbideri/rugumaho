import {
  getPostsServer,
  getPostBySlugServer,
  getSubscribersServer,
  getCampaignsServer,
  addPostServer,
  updatePostServer,
  deletePostServer,
  addSubscriberServer,
  toggleSubscriberStatusServer,
  deleteSubscriberServer,
  addCampaignServer,
  getBlogSettingsServer,
  updateBlogSettingsServer,
  getCommentsForPostServer,
  addCommentServer,
  getPendingCommentsServer,
  approveCommentServer,
  deleteCommentServer,
  incrementPostViewsServer,
  sendNewsletterTestEmailServer,
  sendCampaignEmailServer
} from './sanityActions';

export interface Post {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  coverImage?: string;
  category?: 'Motherhood' | 'Travel' | 'Fitness' | 'Lifestyle';
  tags?: string[];
  author: string;
  status: 'draft' | 'published';
  createdAt: string;
  readTime: string;
  isFeatured?: boolean;
  views?: number;
}

export interface BlogSettings {
  heroLayout: 'single' | 'carousel';
  selectedHeroPostId?: string;
}

export interface BlogComment {
  id: string;
  postSlug: string;
  name: string;
  email: string;
  content: string;
  avatar: string;
  likes: number;
  status: 'pending' | 'approved';
  parentId?: string;
  createdAt: string;
}

export interface Subscriber {
  id: string;
  name: string;
  email: string;
  subscribedDate?: string;
  status: "Active" | "Unsubscribed";
}

export interface Campaign {
  id: string;
  title: string;
  sentDate: string;
  recipients: number;
  openRate: string;
  clickRate: string;
}

// Default posts fallback for development/safety if Sanity query fails or is empty
export const DEFAULT_POSTS: Post[] = [
  {
    id: "default-1",
    title: "Embracing Minimalism in 2026",
    slug: "embracing-minimalism-in-2026",
    excerpt: "How decluttering your space can declutter your mind. A deep dive into the psychology of \"less is more\" and practical steps to begin your journey.",
    content: "Minimalism is not about living in an empty room; it's about making space for what truly matters...",
    coverImage: "https://images.unsplash.com/photo-1544367567-0f2fcb009e0b",
    category: "Lifestyle",
    tags: ["Tips"],
    author: "Rugumaho",
    status: "published",
    createdAt: "2026-06-15",
    readTime: "5 min read"
  }
];

// Default fallback campaigns
export const INITIAL_CAMPAIGNS: Campaign[] = [
  { id: "default-c1", title: "The Future of Sustainable Design", sentDate: "Oct 24, 2023", recipients: 11200, openRate: "72.4%", clickRate: "12.1%" }
];

// Default fallback subscribers
export const INITIAL_SUBSCRIBERS: Subscriber[] = [
  { id: "default-s1", name: "Alex Rivera", email: "alex.r@example.com", subscribedDate: "Oct 12, 2023", status: "Active" }
];

// --- Blog Posts Fetches & Mutations ---

export async function getPosts(): Promise<Post[]> {
  return getPostsServer();
}

export async function getPostBySlug(slug: string): Promise<Post | undefined> {
  return getPostBySlugServer(slug);
}

export async function addPost(post: Omit<Post, 'id' | 'createdAt'>): Promise<Post> {
  const result = await addPostServer(post);
  return {
    ...post,
    id: result.id,
    createdAt: result.createdAt || new Date().toISOString().split('T')[0]
  } as Post;
}

export async function updatePost(updated: Post): Promise<void> {
  await updatePostServer(updated);
}

export async function deletePost(id: string): Promise<void> {
  await deletePostServer(id);
}

// --- Subscribers Fetches & Mutations ---

export async function getSubscribers(): Promise<Subscriber[]> {
  return getSubscribersServer();
}

export async function addSubscriber(sub: Omit<Subscriber, 'id'>): Promise<Subscriber> {
  const result = await addSubscriberServer(sub);
  return {
    ...sub,
    id: result.id
  } as Subscriber;
}

export async function toggleSubscriberStatus(id: string, currentStatus: "Active" | "Unsubscribed"): Promise<void> {
  await toggleSubscriberStatusServer(id, currentStatus);
}

export async function deleteSubscriber(id: string): Promise<void> {
  await deleteSubscriberServer(id);
}

// --- Campaigns Fetches & Mutations ---

export async function getCampaigns(): Promise<Campaign[]> {
  return getCampaignsServer();
}

export async function addCampaign(campaign: Omit<Campaign, 'id'>): Promise<Campaign> {
  const result = await addCampaignServer(campaign);
  return {
    ...campaign,
    id: result.id
  } as Campaign;
}

// --- Global Settings Fetches & Mutations ---

export async function getBlogSettings(): Promise<BlogSettings> {
  return getBlogSettingsServer();
}

export async function updateBlogSettings(settings: BlogSettings): Promise<void> {
  await updateBlogSettingsServer(settings);
}

// --- Comments Actions ---

export async function getApprovedComments(postSlug: string): Promise<BlogComment[]> {
  return getCommentsForPostServer(postSlug);
}

export async function addComment(comment: Omit<BlogComment, 'id' | 'likes' | 'status' | 'createdAt'>): Promise<{ success: boolean; id: string }> {
  return addCommentServer(comment);
}

export async function getPendingComments(): Promise<BlogComment[]> {
  return getPendingCommentsServer();
}

export async function approveComment(id: string): Promise<void> {
  await approveCommentServer(id);
}

export async function deleteComment(id: string): Promise<void> {
  await deleteCommentServer(id);
}

export async function incrementPostViews(slug: string): Promise<void> {
  await incrementPostViewsServer(slug);
}

export async function sendNewsletterTestEmail(data: {
  subject: string;
  content: string;
  heroImage?: string;
  issueNumber: string;
  showCtaButton: boolean;
  ctaButtonText: string;
  ctaPostLink: string;
}) {
  return sendNewsletterTestEmailServer(data);
}

export async function sendCampaignEmail(data: {
  subject: string;
  content: string;
  heroImage?: string;
  issueNumber: string;
  showCtaButton: boolean;
  ctaButtonText: string;
  ctaPostLink: string;
}) {
  return sendCampaignEmailServer(data);
}
