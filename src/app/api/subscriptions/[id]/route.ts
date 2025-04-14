// app/api/subscriptions/[id]/route.ts
import { createClient } from "@/utils/supabase/server";
import { NextRequest, NextResponse } from "next/server";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id: subscriptionId } = await params;
    const supabase = await createClient();

    // Get the current user
    const {
      data: { user },
      error: userError,
    } = await supabase.auth.getUser();

    if (userError || !user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Get the customer_id associated with the user's email
    const { data: customerData, error: customerError } = await supabase
      .from("customers")
      .select("customer_id")
      .eq("email", user.email)
      .single();

    if (customerError || !customerData) {
      return NextResponse.json(
        { error: "No customer record found" },
        { status: 404 }
      );
    }

    // Get the specific subscription and verify it belongs to this customer
    const { data: subscription, error: subscriptionError } = await supabase
      .from("subscriptions")
      .select(
        `
        subscription_id,
        subscription_status,
        price_id,
        product_id,
        scheduled_change,
        created_at,
        updated_at,
        customer_id
      `
      )
      .eq("subscription_id", subscriptionId)
      .single();

    if (subscriptionError || !subscription) {
      return NextResponse.json(
        { error: "Subscription not found" },
        { status: 404 }
      );
    }

    // Check if the subscription belongs to the current user
    if (subscription.customer_id !== customerData.customer_id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
    }

    // Remove customer_id from the response for security
    const { customer_id, ...subscriptionData } = subscription;

    return NextResponse.json(
      { subscription: subscriptionData },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error fetching subscription details:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
