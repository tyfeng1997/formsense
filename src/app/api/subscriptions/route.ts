// app/api/subscriptions/route.ts
import { createClient } from "@/utils/supabase/server";
import { NextResponse } from "next/server";

export async function GET() {
  try {
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
      // No subscription found for this user
      return NextResponse.json({ subscriptions: [] }, { status: 200 });
    }

    // Get the subscriptions for this customer
    const { data: subscriptions, error: subscriptionsError } = await supabase
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
        next_billed_at,
        billing_frequency,
        billing_interval,
        current_period_start,
        current_period_end
      `
      )
      .eq("customer_id", customerData.customer_id)
      .order("created_at", { ascending: false });

    if (subscriptionsError) {
      return NextResponse.json(
        { error: "Failed to fetch subscriptions" },
        { status: 500 }
      );
    }

    return NextResponse.json({ subscriptions }, { status: 200 });
  } catch (error) {
    console.error("Error fetching subscription data:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
