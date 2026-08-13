# Rugumaho Blog & Lifestyle Journal

A premium, high-performance personal journal, lifestyle blog, and email newsletter platform built for **Ariane Rugumaho**.

This repository houses the complete codebase, featuring dynamic serverless API routing, email campaign triggers, comment moderation workflows, and progressive image loader structures.

---

## 🛠️ Technology Stack & Services

The platform utilizes a modern serverless architecture designed to load instantly and cost nothing to maintain under launch traffic:

* **Framework**: [Next.js (App Router)](https://nextjs.org/) for hybrid static-site generation (SSG) and dynamic Edge API routes.
* **Content Management**: [Sanity CMS](https://www.sanity.io/) to manage posts, comments, campaigns, and subscriber databases.
* **Email Delivery**: [Resend](https://resend.com/) for automated welcome emails, newsletter broadcasts, and admin notifications.
* **Media Optimization**: [ImageKit CDN](https://imagekit.io/) for on-the-fly compression, resizing, and delivery of cover image graphics.
* **DNS & Routing**: [Cloudflare](https://www.cloudflare.com/) for domain configuration, SSL encryption, and catch-all email forwarding rules.
* **Hosting**: [Vercel](https://vercel.com/) for optimized deployment and automated Git builds.

---

## 📂 Project Structure

```
├── app/                      # Next.js App Router (pages and layouts)
│   ├── api/                  # Edge API routes (Resend webhooks, contact relays)
│   ├── admin/                # Moderation dashboard and campaign composer
│   │   ├── dashboard/        # Main admin overview page
│   │   ├── newsletter/       # Mailing list and past newsletter reports
│   │   └── posts/            # Article composer and editor
│   ├── category/             # Category post list archives
│   ├── posts/                # Dynamic article detail pages
│   └── unsubscribe/          # Automated subscriber one-click opt-out
├── components/               # Reusable React components (Logo, carousel, cards)
├── lib/                      # Helper libraries (Sanity clients, ImageKit hooks)
├── public/                   # Static public assets (icons, covers, vector logo)
├── Rugumaho_Organic_SEO_Growth_Guide.pdf  # Strategy PDF for client
└── Rugumaho_Project_Handover_Guide.pdf    # Platform limitations and hosting info
```

---

## 🚀 Getting Started Locally

### 1. Prerequisites
Ensure you have **Node.js (v18.0 or higher)** installed.

### 2. Environment Setup
Create a file named `.env.local` in the project root and add the following keys:

```env
# Sanity CMS Configuration
NEXT_PUBLIC_SANITY_PROJECT_ID=ap3pugku
NEXT_PUBLIC_SANITY_DATASET=production
SANITY_API_WRITE_TOKEN=your_sanity_write_token

# ImageKit Configuration
IMAGEKIT_PUBLIC_KEY=your_imagekit_public_key
IMAGEKIT_PRIVATE_KEY=your_imagekit_private_key
IMAGEKIT_URL_ENDPOINT=your_imagekit_endpoint_url

# Resend Email Configuration
RESEND_API_KEY=your_resend_api_key
RESEND_WEBHOOK_SECRET=your_resend_webhook_secret_key
```

### 3. Install Dependencies & Run
```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser to see the live site.

---

## 🔑 Administrative Control Panel

The admin dashboard is fully secure and can be accessed at:
* **URL**: [rugumaho.com/admin/login?key=ariane-secret-token](https://rugumaho.com/admin/login?key=ariane-secret-token)
* **Master Username**: `arianebloger@gmail.com` (or `arianebloger`)
* **Master Password**: `Ariane200@.`

* **Dashboard**: Track views, moderate comments, and view active lists.
* **Compose Campaign**: Send custom HTML rich-text newsletters (teasers, CTAs, hero graphics) to your active list.
* **Subscriber List**: Search subscribers, delete records, or manually toggle subscription statuses.

---

## 📦 Reference Guides & Handover

We have compiled three dedicated PDF guides in the root directory for easy download and handover:

1. **[Technical Handover Guide (PDF)](file:///c:/Users/BIDERI%20ALEC/Downloads/Projects/For%20normal%20businesses/Ariane/rugumaho%20blog/Rugumaho_Project_Handover_Guide.pdf)**: Detailed breakdown of the cloud service accounts, free tier limits (such as Resend's 100 emails/day cap), and instructions on when and how to scale plans.
2. **[SEO & Audience Growth Guide (PDF)](file:///c:/Users/BIDERI%20ALEC/Downloads/Projects/For%20normal%20businesses/Ariane/rugumaho%20blog/Rugumaho_Organic_SEO_Growth_Guide.pdf)**: Best practices for writing search-engine-friendly headlines, bridging Substack, and leveraging YouTube/Vlogs for traffic growth.
3. **[Credentials Handover Guide (PDF)](file:///c:/Users/BIDERI%20ALEC/Downloads/Projects/For%20normal%20businesses/Ariane/rugumaho%20blog/Rugumaho_Credentials_Handover_Guide.pdf)**: Confidential login sheet containing the exact account credentials for all connected services.
