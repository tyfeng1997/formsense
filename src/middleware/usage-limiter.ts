import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/utils/supabase/server";

interface PlanLimits {
  [key: string]: number;
}

// 定义计划限制 - 可以移到环境变量或数据库中
const PLAN_LIMITS: PlanLimits = {
  pri_01jrnh4z3hmr6zm4e6tf8fxg4x: 500, // Basic 计划 ID，500 次请求
  pri_01jrnh5sqd8kqmfe6jzf0sd6n0: 1500, // Pro 计划 ID，1500 次请求
  default: 50, // 默认限制（如果未找到订阅）
};

export async function usageLimiter(
  req: NextRequest,
  handler: (req: NextRequest) => Promise<NextResponse>
) {
  try {
    const supabase = await createClient();

    // 获取当前用户
    const {
      data: { user },
      error: userError,
    } = await supabase.auth.getUser();

    if (userError || !user) {
      console.error("Authentication error:", userError);
      return NextResponse.json(
        { error: "未授权访问", details: "用户未登录或会话无效" },
        { status: 401 }
      );
    }

    // 获取用户的 customer_id
    const { data: customer, error: customerError } = await supabase
      .from("customers")
      .select("customer_id")
      .eq("email", user.email)
      .single();

    if (customerError || !customer) {
      console.error("Customer lookup error:", customerError);
      return NextResponse.json(
        { error: "找不到客户信息", details: "请确保您已完成注册并设置了订阅" },
        { status: 404 }
      );
    }

    // 获取当前订阅及其 price_id
    const { data: subscription, error: subscriptionError } = await supabase
      .from("subscriptions")
      .select("price_id, subscription_status")
      .eq("customer_id", customer.customer_id)
      .eq("subscription_status", "active")
      .order("created_at", { ascending: false })
      .limit(1)
      .maybeSingle(); // 使用 maybeSingle 而不是 single，因为用户可能没有活跃订阅
    console.log("Subscription data:", subscription);
    // 根据 price_id 确定请求限制
    const requestLimit = subscription?.price_id
      ? PLAN_LIMITS[subscription.price_id] || PLAN_LIMITS.default
      : PLAN_LIMITS.default;
    console.log("Request limit:", requestLimit);
    // 获取这个用户的当前使用情况
    const { data: usage, error: usageError } = await supabase
      .from("usage_tracking")
      .select("id, usage_count, reset_date")
      .eq("user_id", user.id)
      .eq("customer_id", customer.customer_id)
      .order("created_at", { ascending: false })
      .limit(1)
      .maybeSingle();

    const now = new Date();

    // 如果不存在使用记录或者是时候重置，创建/更新一个
    if (!usage || new Date(usage.reset_date) < now) {
      // 计算当前月份结束日期作为重置日期
      const resetDate = new Date(now.getFullYear(), now.getMonth() + 1, 1);

      // 创建新的使用记录
      const { error: insertError } = await supabase
        .from("usage_tracking")
        .upsert({
          user_id: user.id,
          customer_id: customer.customer_id,
          usage_count: 1, // 从这个请求开始计数
          reset_date: resetDate.toISOString(),
        });

      if (insertError) {
        console.error("创建使用记录时出错:", insertError);
        // 如果只是记录错误，仍然允许请求继续
        console.warn("尽管跟踪出错，但继续处理请求");
        return handler(req);
      }

      // 继续处理请求，因为这是第一个请求
      return handler(req);
    }

    // 检查用户是否超出了限制
    if (usage.usage_count >= requestLimit) {
      return NextResponse.json(
        {
          error: "已达到使用限制",
          details: {
            limit: requestLimit,
            current: usage.usage_count,
            resetDate: usage.reset_date,
            planType: subscription?.price_id ? "付费计划" : "免费计划",
          },
        },
        { status: 429 }
      );
    }

    // 增加使用计数
    const { error: updateError } = await supabase
      .from("usage_tracking")
      .update({
        usage_count: usage.usage_count + 1,
        updated_at: now.toISOString(),
      })
      .eq("id", usage.id);

    if (updateError) {
      console.error("更新使用计数时出错:", updateError);
      // 即使跟踪失败，也继续处理请求
      console.warn("尽管更新计数出错，但继续处理请求");
    }

    // 继续处理请求
    return handler(req);
  } catch (error) {
    console.error("Usage limiter middleware error:", error);
    return NextResponse.json(
      { error: "服务器内部错误", details: "处理使用限制时出错" },
      { status: 500 }
    );
  }
}
