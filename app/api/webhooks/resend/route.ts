import { NextResponse } from "next/server";
import { sanityWriteClient } from "../../../../lib/sanity";

export async function POST(request: Request) {
  try {
    // 1. Verify webhook secret key via query string: ?secret=whsec_...
    const { searchParams } = new URL(request.url);
    const secret = searchParams.get("secret");
    const expectedSecret = process.env.RESEND_WEBHOOK_SECRET;

    if (!expectedSecret || secret !== expectedSecret) {
      console.warn("Unauthorized webhook attempt detected.");
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const payload = await request.json();
    const eventType = payload.type; // "email.opened" or "email.clicked"
    const data = payload.data || {};
    
    // Extract campaign_id from Resend tags array
    const tags = data.tags || [];
    let campaignId = null;
    if (Array.isArray(tags)) {
      const campaignTag = tags.find((t: any) => t.name === "campaign_id");
      if (campaignTag) {
        campaignId = campaignTag.value;
      }
    } else if (typeof tags === "object" && tags !== null) {
      campaignId = (tags as any).campaign_id;
    }

    // Extract recipient email address
    let recipientEmail = "";
    if (Array.isArray(data.to)) {
      recipientEmail = data.to[0] || "";
    } else if (typeof data.to === "string") {
      recipientEmail = data.to;
    }

    if (!campaignId || !recipientEmail) {
      console.warn(`Ignored webhook event: campaignId=${campaignId}, recipientEmail=${recipientEmail}`);
      return NextResponse.json({ message: "No campaign ID or recipient found in payload. Ignored." }, { status: 200 });
    }

    // 2. Fetch the campaign statistics from Sanity
    const campaign = await sanityWriteClient.fetch(
      `*[_type == "campaign" && _id == $campaignId][0] {
        _id,
        recipients,
        openedBy,
        clickedBy
      }`,
      { campaignId }
    );

    if (!campaign) {
      console.error(`Webhook error: Campaign ${campaignId} not found in Sanity.`);
      return NextResponse.json({ error: "Campaign not found" }, { status: 404 });
    }

    const recipientsCount = campaign.recipients || 1;
    let openedBy = campaign.openedBy || [];
    let clickedBy = campaign.clickedBy || [];

    let isModified = false;

    if (eventType === "email.opened") {
      if (!openedBy.includes(recipientEmail)) {
        openedBy.push(recipientEmail);
        isModified = true;
      }
    } else if (eventType === "email.clicked") {
      // Any click is also an open by definition
      if (!openedBy.includes(recipientEmail)) {
        openedBy.push(recipientEmail);
        isModified = true;
      }
      if (!clickedBy.includes(recipientEmail)) {
        clickedBy.push(recipientEmail);
        isModified = true;
      }
    }

    // 3. Recalculate metrics and save back to Sanity
    if (isModified) {
      const openRatePercent = `${((openedBy.length / recipientsCount) * 100).toFixed(1)}%`;
      const clickRatePercent = `${((clickedBy.length / recipientsCount) * 100).toFixed(1)}%`;

      await sanityWriteClient
        .patch(campaignId)
        .set({
          openedBy,
          clickedBy,
          openRate: openRatePercent,
          clickRate: clickRatePercent
        })
        .commit();

      console.log(`Successfully updated Campaign ${campaignId}: Open Rate: ${openRatePercent}, Click Rate: ${clickRatePercent}`);
    }

    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error("Failed to process Resend webhook event:", error);
    return NextResponse.json({ error: error.message || "Internal server error" }, { status: 500 });
  }
}
