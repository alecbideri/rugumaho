"use server";

import { sanityWriteClient } from './sanity';
import { Post } from './mockData';

// --- Server-Side Read Queries (Bypasses CORS & Private Dataset limitations) ---

export async function getPostsServer() {
  try {
    const posts = await sanityWriteClient.fetch(
      `*[_type == "post"] | order(createdAt desc) {
        "id": _id,
        title,
        "slug": coalesce(slug.current, slug),
        excerpt,
        content,
        coverImage,
        category,
        tags,
        author,
        status,
        createdAt,
        readTime,
        isFeatured
      }`
    );
    return posts || [];
  } catch (error) {
    console.error("Error fetching posts on server:", error);
    return [];
  }
}

export async function getPostBySlugServer(slug: string) {
  try {
    const post = await sanityWriteClient.fetch(
      `*[_type == "post" && (slug.current == $slug || slug == $slug)][0] {
        "id": _id,
        title,
        "slug": coalesce(slug.current, slug),
        excerpt,
        content,
        coverImage,
        category,
        tags,
        author,
        status,
        createdAt,
        readTime,
        isFeatured
      }`,
      { slug }
    );
    return post || undefined;
  } catch (error) {
    console.error("Error fetching post by slug on server:", error);
    return undefined;
  }
}

export async function getSubscribersServer() {
  try {
    const subs = await sanityWriteClient.fetch(
      `*[_type == "subscriber"] | order(subscribedDate desc) {
        "id": _id,
        name,
        email,
        subscribedDate,
        status
      }`
    );
    return subs || [];
  } catch (error) {
    console.error("Error fetching subscribers on server:", error);
    return [];
  }
}

export async function getCampaignsServer() {
  try {
    const campaigns = await sanityWriteClient.fetch(
      `*[_type == "campaign"] | order(sentDate desc) {
        "id": _id,
        title,
        sentDate,
        recipients,
        openRate,
        clickRate
      }`
    );
    return campaigns || [];
  } catch (error) {
    console.error("Error fetching campaigns on server:", error);
    return [];
  }
}

interface SubscriberData {
  name: string;
  email: string;
  subscribedDate?: string;
  status: "Active" | "Unsubscribed";
}

interface CampaignData {
  title: string;
  sentDate: string;
  recipients: number;
  openRate: string;
  clickRate: string;
}

// --- Post Actions ---

export async function addPostServer(post: Omit<Post, 'id' | 'createdAt'>) {
  try {
    const doc = {
      _type: 'post',
      title: post.title,
      slug: {
        _type: 'slug',
        current: post.slug || post.title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '')
      },
      excerpt: post.excerpt,
      content: post.content,
      coverImage: post.coverImage || '',
      category: post.category || 'Lifestyle',
      tags: post.tags || [],
      author: post.author || 'Ariane Rugumaho',
      status: post.status || 'draft',
      createdAt: new Date().toISOString().split('T')[0],
      readTime: post.readTime || '3 min read',
      isFeatured: post.isFeatured || false
    };

    const created = await sanityWriteClient.create(doc);
    return {
      success: true,
      id: created._id,
      createdAt: created.createdAt
    };
  } catch (error: any) {
    console.error("Error creating post in Sanity:", error);
    throw new Error(error.message || "Failed to create post in Sanity.");
  }
}

export async function updatePostServer(post: Post) {
  try {
    const slugValue = post.slug || post.title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '');
    
    await sanityWriteClient
      .patch(post.id)
      .set({
        title: post.title,
        slug: {
          _type: 'slug',
          current: slugValue
        },
        excerpt: post.excerpt,
        content: post.content,
        coverImage: post.coverImage || '',
        category: post.category || 'Lifestyle',
        tags: post.tags || [],
        author: post.author || 'Ariane Rugumaho',
        status: post.status,
        readTime: post.readTime,
        isFeatured: post.isFeatured || false
      })
      .commit();

    return { success: true };
  } catch (error: any) {
    console.error("Error updating post in Sanity:", error);
    throw new Error(error.message || "Failed to update post in Sanity.");
  }
}

export async function deletePostServer(id: string) {
  try {
    await sanityWriteClient.delete(id);
    return { success: true };
  } catch (error: any) {
    console.error("Error deleting post in Sanity:", error);
    throw new Error(error.message || "Failed to delete post in Sanity.");
  }
}

// --- Subscriber Actions ---

export async function addSubscriberServer(subscriber: SubscriberData) {
  try {
    const doc = {
      _type: 'subscriber',
      name: subscriber.name,
      email: subscriber.email,
      subscribedDate: subscriber.subscribedDate || new Date().toLocaleDateString('en-US', { month: 'short', day: '2-digit', year: 'numeric' }),
      status: subscriber.status || 'Active'
    };

    const created = await sanityWriteClient.create(doc);
    return {
      success: true,
      id: created._id
    };
  } catch (error: any) {
    console.error("Error creating subscriber in Sanity:", error);
    throw new Error(error.message || "Failed to create subscriber in Sanity.");
  }
}

export async function toggleSubscriberStatusServer(id: string, currentStatus: "Active" | "Unsubscribed") {
  try {
    const nextStatus = currentStatus === "Active" ? "Unsubscribed" : "Active";
    await sanityWriteClient
      .patch(id)
      .set({ status: nextStatus })
      .commit();
    return { success: true, nextStatus };
  } catch (error: any) {
    console.error("Error updating subscriber status in Sanity:", error);
    throw new Error(error.message || "Failed to update subscriber status in Sanity.");
  }
}

export async function deleteSubscriberServer(id: string) {
  try {
    await sanityWriteClient.delete(id);
    return { success: true };
  } catch (error: any) {
    console.error("Error deleting subscriber in Sanity:", error);
    throw new Error(error.message || "Failed to delete subscriber in Sanity.");
  }
}

// --- Campaign Actions ---

export async function addCampaignServer(campaign: CampaignData) {
  try {
    const doc = {
      _type: 'campaign',
      title: campaign.title,
      sentDate: campaign.sentDate,
      recipients: campaign.recipients,
      openRate: campaign.openRate,
      clickRate: campaign.clickRate
    };

    const created = await sanityWriteClient.create(doc);
    return {
      success: true,
      id: created._id
    };
  } catch (error: any) {
    console.error("Error creating campaign in Sanity:", error);
    throw new Error(error.message || "Failed to create campaign in Sanity.");
  }
}

// --- Global Settings Actions ---

export async function getBlogSettingsServer() {
  try {
    const settings = await sanityWriteClient.fetch(
      `*[_type == "settings" && _id == "global-settings"][0] {
        heroLayout,
        "selectedHeroPostId": selectedHeroPost._ref
      }`
    );
    if (!settings) {
      return { heroLayout: 'carousel' as const };
    }
    return settings;
  } catch (error) {
    console.error("Error fetching settings on server:", error);
    return { heroLayout: 'carousel' as const };
  }
}

export async function updateBlogSettingsServer(settings: { heroLayout: 'single' | 'carousel'; selectedHeroPostId?: string }) {
  try {
    const doc = {
      _id: 'global-settings',
      _type: 'settings',
      heroLayout: settings.heroLayout,
      selectedHeroPost: settings.selectedHeroPostId ? {
        _type: 'reference',
        _ref: settings.selectedHeroPostId
      } : undefined
    };
    
    await sanityWriteClient.createOrReplace(doc);
    return { success: true };
  } catch (error: any) {
    console.error("Error updating settings in Sanity:", error);
    throw new Error(error.message || "Failed to update layout settings in Sanity.");
  }
}
