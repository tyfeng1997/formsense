// app/api/subscriptions/[id]/cancel/route.ts
import { createClient } from "@/utils/supabase/server";
import { NextRequest, NextResponse } from "next/server";

export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const subscriptionId = params.id;
    const supabase = await createClient();

    // 获取当前用户
    const {
      data: { user },
      error: userError,
    } = await supabase.auth.getUser();

    if (userError || !user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // 获取与用户电子邮件关联的 customer_id
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

    // 获取特定订阅并验证它是否属于此客户
    const { data: subscription, error: subscriptionError } = await supabase
      .from("subscriptions")
      .select(
        `
        subscription_id,
        customer_id,
        scheduled_change
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

    // 检查订阅是否属于当前用户
    if (subscription.customer_id !== customerData.customer_id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
    }

    // 检查订阅是否已经被安排取消
    if (subscription.scheduled_change) {
      return NextResponse.json(
        { error: "Subscription cancellation already scheduled" },
        { status: 400 }
      );
    }

    // 调用 Paddle API 取消订阅
    // 注意：这需要您的 Paddle API 凭据
    const paddleResponse = await fetch(
      "https://sandbox-api.paddle.com/subscriptions/" +
        subscriptionId +
        "/cancel",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${process.env.PADDLE_API_KEY}`,
        },
        body: JSON.stringify({
          // 默认行为是在账单周期结束时取消
          effective_from: "next_billing_period",
        }),
      }
    );

    if (!paddleResponse.ok) {
      const errorData = await paddleResponse.json();
      console.error("Paddle API error:", errorData);
      return NextResponse.json(
        { error: "Failed to cancel subscription with Paddle" },
        { status: 500 }
      );
    }

    const paddleResponseData = await paddleResponse.json();

    // scheduled_change 中应该包含取消将会生效的日期
    const effectiveDate =
      paddleResponseData.data?.scheduled_change?.effective_at;
    console.log(
      "Paddle subscription cancellation scheduled for:",
      effectiveDate
    );
    // Paddle webhook 将更新您的数据库，但我们可以在此处更新以提供即时反馈
    const { error: updateError } = await supabase
      .from("subscriptions")
      .update({
        scheduled_change: effectiveDate || new Date().toISOString(),
      })
      .eq("subscription_id", subscriptionId);

    if (updateError) {
      console.error("Error updating subscription status:", updateError);
      // 即使数据库更新失败，取消仍然有效，所以我们返回成功
    }

    return NextResponse.json(
      {
        success: true,
        effective_date: effectiveDate,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error canceling subscription:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
