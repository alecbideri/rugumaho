"use server";

import { sanityWriteClient } from './sanity';
import { Post } from './mockData';
import { Resend } from 'resend';

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
        isFeatured,
        views
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
        isFeatured,
        views
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

    // Fire welcome email notification asynchronously
    sendWelcomeEmail(subscriber.email, subscriber.name).catch((err) => {
      console.error("Failed to execute welcome email trigger:", err);
    });

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

export async function unsubscribeByEmailServer(email: string) {
  try {
    const query = `*[_type == "subscriber" && email == $email][0]._id`;
    const docId = await sanityWriteClient.fetch(query, { email });
    
    if (!docId) {
      return { success: false, error: "We couldn't find a subscriber with that email address." };
    }

    await sanityWriteClient
      .patch(docId)
      .set({ status: "Unsubscribed" })
      .commit();
      
    return { success: true };
  } catch (error: any) {
    console.error("Error unsubscribing by email in Sanity:", error);
    return { success: false, error: error.message || "Failed to process unsubscribe request." };
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

// --- Comments Actions ---

export async function getCommentsForPostServer(postSlug: string) {
  try {
    const comments = await sanityWriteClient.fetch(
      `*[_type == "comment" && postSlug == $postSlug && status == "approved"] | order(createdAt desc) {
        "id": _id,
        postSlug,
        name,
        email,
        content,
        avatar,
        likes,
        status,
        parentId,
        createdAt
      }`,
      { postSlug }
    );
    return comments || [];
  } catch (error) {
    console.error("Error fetching comments on server:", error);
    return [];
  }
}

export async function addCommentServer(commentData: {
  postSlug: string;
  name: string;
  email: string;
  content: string;
  avatar: string;
  parentId?: string;
}) {
  try {
    const doc = {
      _type: 'comment',
      postSlug: commentData.postSlug,
      name: commentData.name,
      email: commentData.email,
      content: commentData.content,
      avatar: commentData.avatar,
      likes: 0,
      status: 'pending',
      parentId: commentData.parentId,
      createdAt: new Date().toISOString()
    };

    const created = await sanityWriteClient.create(doc);

    // Fire email notification to admin asynchronously (without delaying the reader's UI loading)
    sendCommentNotificationEmail({
      postSlug: commentData.postSlug,
      name: commentData.name,
      email: commentData.email,
      content: commentData.content
    }).catch((err) => {
      console.error("Failed to execute background email trigger:", err);
    });

    return {
      success: true,
      id: created._id
    };
  } catch (error: any) {
    console.error("Error adding comment in Sanity:", error);
    throw new Error(error.message || "Failed to submit comment.");
  }
}

export async function getPendingCommentsServer() {
  try {
    const comments = await sanityWriteClient.fetch(
      `*[_type == "comment" && status == "pending"] | order(createdAt desc) {
        "id": _id,
        postSlug,
        name,
        email,
        content,
        avatar,
        likes,
        status,
        createdAt
      }`
    );
    return comments || [];
  } catch (error) {
    console.error("Error fetching pending comments:", error);
    return [];
  }
}

export async function approveCommentServer(id: string) {
  try {
    await sanityWriteClient
      .patch(id)
      .set({ status: 'approved' })
      .commit();
    return { success: true };
  } catch (error: any) {
    console.error("Error approving comment in Sanity:", error);
    throw new Error(error.message || "Failed to approve comment.");
  }
}

export async function deleteCommentServer(id: string) {
  try {
    await sanityWriteClient.delete(id);
    return { success: true };
  } catch (error: any) {
    console.error("Error deleting comment in Sanity:", error);
    throw new Error(error.message || "Failed to delete comment.");
  }
}

export async function likeCommentServer(id: string) {
  try {
    await sanityWriteClient
      .patch(id)
      .setIfMissing({ likes: 0 })
      .inc({ likes: 1 })
      .commit();
    return { success: true };
  } catch (error: any) {
    console.error("Error liking comment in Sanity:", error);
    return { success: false, error: error.message };
  }
}

export async function incrementPostViewsServer(slug: string) {
  try {
    const post = await sanityWriteClient.fetch(
      `*[_type == "post" && (slug.current == $slug || slug == $slug)][0] { _id }`,
      { slug }
    );
    if (post && post._id) {
      await sanityWriteClient
        .patch(post._id)
        .setIfMissing({ views: 0 })
        .inc({ views: 1 })
        .commit();
      console.log(`Incremented views for post: ${slug}`);
    }
  } catch (error) {
    console.error("Error incrementing views on server:", error);
  }
}

async function sendCommentNotificationEmail(comment: {
  postSlug: string;
  name: string;
  email: string;
  content: string;
}) {
  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) {
    console.log("RESEND_API_KEY is not defined in env. Skipping notification email.");
    return;
  }

  try {
    const resend = new Resend(apiKey);
    await resend.emails.send({
      from: 'Rugumaho Blog Alerts <alerts@rugumaho.com>',
      to: 'arianebloger@gmail.com', // Change this to your preferred admin email
      subject: `New Comment Pending Moderation on "${comment.postSlug}"`,
      html: `
        <div style="font-family: system-ui, -apple-system, sans-serif; max-width: 580px; margin: 0 auto; padding: 24px; border: 1px solid #f1f5f9; border-radius: 16px; background-color: #ffffff;">
          <div style="margin-bottom: 24px; text-align: center;">
            <span style="font-size: 24px;">💬</span>
            <h2 style="font-family: Georgia, serif; font-size: 22px; color: #0f172a; margin: 12px 0 4px 0;">New Blog Comment</h2>
            <p style="font-size: 13px; color: #64748b; margin: 0;">A comment is waiting for your approval in the moderation queue.</p>
          </div>
          
          <div style="background-color: #f8fafc; border-radius: 12px; padding: 20px; border-left: 4px solid #0f172a; margin-bottom: 24px;">
            <p style="margin: 0 0 10px 0; font-size: 13px; color: #475569;">
              <strong>Author:</strong> ${comment.name} (${comment.email})
            </p>
            <p style="margin: 0 0 10px 0; font-size: 13px; color: #475569;">
              <strong>Article Path:</strong> <span style="font-family: monospace; background: #e2e8f0; padding: 2px 6px; border-radius: 4px;">/posts/${comment.postSlug}</span>
            </p>
            <div style="margin-top: 14px; padding-top: 14px; border-top: 1px solid #e2e8f0; font-size: 14px; color: #334155; font-style: italic; line-height: 1.6;">
              &ldquo;${comment.content}&rdquo;
            </div>
          </div>

          <div style="text-align: center; margin-top: 28px;">
            <a href="https://rugumaho.com/admin/dashboard" target="_blank" style="background-color: #0f172a; color: #ffffff; padding: 12px 24px; border-radius: 8px; font-size: 14px; font-weight: bold; text-decoration: none; display: inline-block;">
              Open Moderation Dashboard
            </a>
          </div>
        </div>
      `
    });
    console.log("Successfully sent comment notification email via Resend.");
  } catch (err) {
    console.error("Failed to send comment notification email via Resend:", err);
  }
}

async function sendWelcomeEmail(email: string, name?: string) {
  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) {
    console.log("RESEND_API_KEY is not defined in env. Skipping welcome email.");
    return;
  }

  try {
    const resend = new Resend(apiKey);
    await resend.emails.send({
      from: 'Ariane Rugumaho <hello@rugumaho.com>',
      to: email,
      subject: 'Welcome to the Inner Circle | Rugumaho',
      html: `
        <div style="font-family: system-ui, -apple-system, sans-serif; max-width: 580px; margin: 0 auto; padding: 32px 24px; border: 1px solid #f1f5f9; border-radius: 16px; background-color: #ffffff;">
          <div style="text-align: center; margin-bottom: 32px; border-bottom: 1px solid #f1f5f9; padding-bottom: 24px;">
            <h1 style="font-family: Georgia, serif; font-size: 28px; font-weight: bold; color: #0f172a; margin: 0 0 8px 0; letter-spacing: -0.5px;">RUGUMAHO</h1>
            <p style="font-size: 11px; text-transform: uppercase; letter-spacing: 0.15em; color: #64748b; margin: 0; font-weight: 700;">Inner Circle</p>
          </div>
          
          <div style="font-size: 15px; color: #334155; line-height: 1.8; margin-bottom: 32px;">
            <p>Hello${name ? ` ${name}` : ''},</p>
            <p>Thank you for subscribing to my personal journal list. I am thrilled to welcome you to this corner of the web.</p>
            <p>Going forward, you will receive weekly updates containing personal essays, travel notes from quiet corners of the world, and insights into active lifestyle & wellness.</p>
            <p>I look forward to sharing these stories with you.</p>
            <p style="margin-top: 24px; border-left: 3px solid #0f172a; padding-left: 12px; font-style: italic; color: #475569;">
              Warmly,<br/><strong>Ariane Rugumaho</strong>
            </p>
          </div>
          
          <div style="text-align: center; border-top: 1px solid #f1f5f9; padding-top: 24px; margin-top: 32px;">
            <a href="https://rugumaho.com" target="_blank" style="background-color: #0f172a; color: #ffffff; padding: 12px 28px; border-radius: 8px; font-size: 14px; font-weight: bold; text-decoration: none; display: inline-block;">
              Explore the Journal
            </a>
          </div>
        </div>
      `
    });
    console.log(`Successfully sent welcome email to ${email} via Resend.`);
  } catch (err) {
    console.error("Failed to send welcome email via Resend:", err);
  }
}

export async function sendContactFormEmail(data: {
  name: string;
  email: string;
  subject: string;
  message: string;
}) {
  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) {
    console.log("RESEND_API_KEY is not defined in env. Skipping contact form email.");
    return { success: false, error: "Email configuration missing." };
  }

  try {
    const resend = new Resend(apiKey);
    await resend.emails.send({
      from: 'Rugumaho Contact Form <alerts@rugumaho.com>',
      to: 'arianebloger@gmail.com',
      subject: `[Contact Enquiry] ${data.subject} - from ${data.name}`,
      html: `
        <div style="font-family: system-ui, -apple-system, sans-serif; max-width: 580px; margin: 0 auto; padding: 24px; border: 1px solid #f1f5f9; border-radius: 16px; background-color: #ffffff;">
          <div style="margin-bottom: 24px; text-align: center;">
            <span style="font-size: 24px;">✉️</span>
            <h2 style="font-family: Georgia, serif; font-size: 22px; color: #0f172a; margin: 12px 0 4px 0;">New Contact Form Submission</h2>
            <p style="font-size: 13px; color: #64748b; margin: 0;">A user has submitted an enquiry through the website.</p>
          </div>
          
          <div style="background-color: #f8fafc; border-radius: 12px; padding: 20px; border-left: 4px solid #0f172a; margin-bottom: 24px;">
            <p style="margin: 0 0 10px 0; font-size: 13px; color: #475569;">
              <strong>Sender:</strong> ${data.name} (${data.email})
            </p>
            <p style="margin: 0 0 10px 0; font-size: 13px; color: #475569;">
              <strong>Subject:</strong> ${data.subject}
            </p>
            <div style="margin-top: 14px; padding-top: 14px; border-top: 1px solid #e2e8f0; font-size: 14px; color: #334155; line-height: 1.6; white-space: pre-wrap;">
              ${data.message}
            </div>
          </div>
        </div>
      `
    });
    console.log(`Successfully sent contact form notification for ${data.email} via Resend.`);
    return { success: true };
  } catch (err: any) {
    console.error("Failed to send contact form email:", err);
    return { success: false, error: err.message || "Failed to deliver message." };
  }
}

export async function sendNewsletterTestEmailServer(data: {
  subject: string;
  content: string;
  heroImage?: string;
  issueNumber: string;
  showCtaButton: boolean;
  ctaButtonText: string;
  ctaPostLink: string;
}) {
  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) {
    console.log("RESEND_API_KEY is not defined in env. Skipping test newsletter email.");
    return { success: false, error: "Email configuration missing." };
  }

  try {
    const resend = new Resend(apiKey);
    const currentMonthYear = new Date().toLocaleDateString("en-US", { month: "long", year: "numeric" });
    
    await resend.emails.send({
      from: 'Ariane Rugumaho <hello@rugumaho.com>',
      to: 'arianebloger@gmail.com',
      subject: `[TEST] ${data.subject || "The Weekly Muse"}`,
      html: `
        <div style="font-family: system-ui, -apple-system, sans-serif; max-width: 600px; margin: 0 auto; border: 1px solid #f1f5f9; border-radius: 16px; background-color: #ffffff; overflow: hidden; box-shadow: 0 10px 30px rgba(0,0,0,0.03);">
          <div style="background-color: #0f172a; height: 6px; width: 100%;"></div>
          
          <!-- Email Header -->
          <div style="padding: 45px 40px; border-bottom: 1px solid #f8fafc; text-align: center;">
            <div style="font-family: Georgia, serif; font-size: 26px; font-weight: bold; color: #0f172a; margin-bottom: 24px; letter-spacing: 2px;">RUGUMAHO</div>
            <h1 style="font-family: Georgia, serif; font-size: 32px; font-weight: bold; color: #0f172a; margin: 0; line-height: 1.3;">${data.subject || "The Weekly Muse"}</h1>
            <p style="font-size: 11px; text-transform: uppercase; letter-spacing: 0.15em; color: #64748b; margin: 8px 0 0 0; font-weight: bold;">Issue #${data.issueNumber} &bull; ${currentMonthYear}</p>
          </div>
          
          <!-- Hero Image -->
          ${data.heroImage ? `<div style="width: 100%; aspect-ratio: 16/9; overflow: hidden;"><img src="${data.heroImage}" alt="Hero Banner" style="width: 100%; height: auto; display: block;" /></div>` : ''}
          
          <!-- Email Body -->
          <div style="padding: 40px; font-family: Georgia, serif; font-size: 16px; color: #334155; line-height: 1.8;">
            <h2 style="font-family: Georgia, serif; font-size: 20px; font-weight: bold; color: #0f172a; margin-top: 0; margin-bottom: 16px;">Hello, Rugumaho community.</h2>
            <div>${data.content}</div>
            
            <!-- Dynamic CTA Button option -->
            ${data.showCtaButton ? `
            <div style="padding: 32px 0; text-align: center;">
              <a href="${data.ctaPostLink}" target="_blank" style="background-color: #0f172a; color: #ffffff; padding: 14px 32px; border-radius: 8px; font-size: 14px; font-weight: bold; text-decoration: none; display: inline-block; font-family: system-ui, -apple-system, sans-serif;">
                ${data.ctaButtonText}
              </a>
            </div>
            ` : ''}
          </div>
          
          <!-- Email Footer -->
          <div style="padding: 40px; background-color: #f8fafc; border-top: 1px solid #f1f5f9; text-align: center;">
            <div style="margin-bottom: 20px;">
              <a href="mailto:?subject=Read%20the%20Rugumaho%20Journal&body=Read%20the%20latest%20issue%20of%20the%20newsletter%20here:%20https://rugumaho.com" style="color: #64748b; text-decoration: none; margin: 0 12px; font-size: 13px; font-weight: 600; display: inline-block;">Share via Email</a>
              <span style="color: #cbd5e1;">&bull;</span>
              <a href="https://rugumaho.com" style="color: #64748b; text-decoration: none; margin: 0 12px; font-size: 13px; font-weight: 600; display: inline-block;">Visit Website</a>
            </div>
            <p style="font-size: 12px; color: #64748b; margin: 0 0 16px 0; line-height: 1.5;">
              You're receiving this because you're part of the Rugumaho community.
            </p>
            <a href="https://rugumaho.com" style="font-size: 12px; color: #0f172a; font-weight: bold; text-decoration: underline;">Unsubscribe</a>
          </div>
        </div>
      `
    });
    console.log(`Successfully sent test newsletter email to arianebloger@gmail.com via Resend.`);
    return { success: true };
  } catch (err: any) {
    console.error("Failed to send test newsletter email:", err);
    return { success: false, error: err.message || "Failed to deliver test message." };
  }
}

export async function sendCampaignEmailServer(data: {
  subject: string;
  content: string;
  heroImage?: string;
  issueNumber: string;
  showCtaButton: boolean;
  ctaButtonText: string;
  ctaPostLink: string;
}) {
  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) {
    console.log("RESEND_API_KEY is not defined in env. Skipping campaign newsletter email.");
    return { success: false, error: "Email configuration missing." };
  }

  try {
    const resend = new Resend(apiKey);
    const currentMonthYear = new Date().toLocaleDateString("en-US", { month: "long", year: "numeric" });
    const subscribers = await getSubscribersServer();
    const activeSubscribers = subscribers.filter((s: any) => s.status === "Active");
    
    if (activeSubscribers.length === 0) {
      console.log("No active subscribers to send campaign newsletter to.");
      return { success: true, count: 0 };
    }

    // 1. Create the campaign document in Sanity first to obtain the campaign ID for tracking tags
    const currentMonthYearShort = new Date().toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
    const campaignDoc = {
      _type: 'campaign',
      title: data.subject,
      sentDate: currentMonthYearShort,
      recipients: activeSubscribers.length,
      openRate: "0.0%",
      clickRate: "0.0%",
      openedBy: [],
      clickedBy: []
    };

    const createdCampaign = await sanityWriteClient.create(campaignDoc);
    const campaignId = createdCampaign._id;

    // 2. Transmit campaign emails to all active list accounts tagged with the campaign ID
    for (const sub of activeSubscribers) {
      await resend.emails.send({
        from: 'Ariane Rugumaho <hello@rugumaho.com>',
        to: sub.email,
        subject: data.subject || "The Weekly Muse",
        tags: [
          {
            name: 'campaign_id',
            value: campaignId
          }
        ],
        html: `
          <div style="font-family: system-ui, -apple-system, sans-serif; max-width: 600px; margin: 0 auto; border: 1px solid #f1f5f9; border-radius: 16px; background-color: #ffffff; overflow: hidden; box-shadow: 0 10px 30px rgba(0,0,0,0.03);">
            <div style="background-color: #0f172a; height: 6px; width: 100%;"></div>
            
            <!-- Email Header -->
            <div style="padding: 45px 40px; border-bottom: 1px solid #f8fafc; text-align: center;">
              <div style="font-family: Georgia, serif; font-size: 26px; font-weight: bold; color: #0f172a; margin-bottom: 24px; letter-spacing: 2px;">RUGUMAHO</div>
              <h1 style="font-family: Georgia, serif; font-size: 32px; font-weight: bold; color: #0f172a; margin: 0; line-height: 1.3;">${data.subject || "The Weekly Muse"}</h1>
              <p style="font-size: 11px; text-transform: uppercase; letter-spacing: 0.15em; color: #64748b; margin: 8px 0 0 0; font-weight: bold;">Issue #${data.issueNumber} &bull; ${currentMonthYear}</p>
            </div>
            
            <!-- Hero Image -->
            ${data.heroImage ? `<div style="width: 100%; aspect-ratio: 16/9; overflow: hidden;"><img src="${data.heroImage}" alt="Hero Banner" style="width: 100%; height: auto; display: block;" /></div>` : ''}
            
            <!-- Email Body -->
            <div style="padding: 40px; font-family: Georgia, serif; font-size: 16px; color: #334155; line-height: 1.8;">
              <h2 style="font-family: Georgia, serif; font-size: 20px; font-weight: bold; color: #0f172a; margin-top: 0; margin-bottom: 16px;">Hello ${sub.name || "friend"},</h2>
              <div>${data.content}</div>
              
              <!-- Dynamic CTA Button option -->
              ${data.showCtaButton ? `
              <div style="padding: 32px 0; text-align: center;">
                <a href="${data.ctaPostLink}" target="_blank" style="background-color: #0f172a; color: #ffffff; padding: 14px 32px; border-radius: 8px; font-size: 14px; font-weight: bold; text-decoration: none; display: inline-block; font-family: system-ui, -apple-system, sans-serif;">
                  ${data.ctaButtonText}
                </a>
              </div>
              ` : ''}
            </div>
            
            <!-- Email Footer -->
            <div style="padding: 40px; background-color: #f8fafc; border-top: 1px solid #f1f5f9; text-align: center;">
              <div style="margin-bottom: 20px;">
                <a href="mailto:?subject=Read%20the%20Rugumaho%20Journal&body=Read%20the%20latest%20issue%20of%20the%20newsletter%20here:%20https://rugumaho.com" style="color: #64748b; text-decoration: none; margin: 0 12px; font-size: 13px; font-weight: 600; display: inline-block;">Share via Email</a>
                <span style="color: #cbd5e1;">&bull;</span>
                <a href="https://rugumaho.com" style="color: #64748b; text-decoration: none; margin: 0 12px; font-size: 13px; font-weight: 600; display: inline-block;">Visit Website</a>
              </div>
              <p style="font-size: 12px; color: #64748b; margin: 0 0 16px 0; line-height: 1.5;">
                You're receiving this because you're part of the Rugumaho community.
              </p>
              <a href="https://rugumaho.com/unsubscribe?email=${encodeURIComponent(sub.email)}" style="font-size: 12px; color: #0f172a; font-weight: bold; text-decoration: underline;">Unsubscribe</a>
            </div>
          </div>
        `
      });
    }

    console.log(`Successfully sent campaign newsletter to ${activeSubscribers.length} subscribers via Resend.`);
    return { success: true, id: campaignId, count: activeSubscribers.length };
  } catch (err: any) {
    console.error("Failed to send campaign newsletter email:", err);
    return { success: false, error: err.message || "Failed to deliver campaign messages." };
  }
}

