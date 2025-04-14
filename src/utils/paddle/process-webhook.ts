import {
  CustomerCreatedEvent,
  CustomerUpdatedEvent,
  EventEntity,
  EventName,
  SubscriptionCreatedEvent,
  SubscriptionUpdatedEvent,
} from "@paddle/paddle-node-sdk";
import { createClient } from "@/utils/supabase/server";

export class ProcessWebhook {
  async processEvent(eventData: EventEntity) {
    switch (eventData.eventType) {
      case EventName.SubscriptionCreated:
      case EventName.SubscriptionUpdated:
        await this.updateSubscriptionData(eventData);
        break;
      case EventName.CustomerCreated:
      case EventName.CustomerUpdated:
        await this.updateCustomerData(eventData);
        break;
    }
  }

  private async updateSubscriptionData(
    eventData: SubscriptionCreatedEvent | SubscriptionUpdatedEvent
  ) {
    const supabase = await createClient();
    const { error } = await supabase
      .from("subscriptions")
      .upsert({
        subscription_id: eventData.data.id,
        subscription_status: eventData.data.status,
        price_id: eventData.data.items[0].price?.id ?? "",
        product_id: eventData.data.items[0].price?.productId ?? "",
        scheduled_change: eventData.data.scheduledChange?.effectiveAt,
        customer_id: eventData.data.customerId,
        next_billed_at: eventData.data.nextBilledAt,
        billing_frequency: eventData.data.billingCycle.frequency,
        billing_interval: eventData.data.billingCycle.interval,
        current_period_start: eventData.data.currentBillingPeriod?.startsAt,
        current_period_end: eventData.data.currentBillingPeriod?.endsAt,
      })
      .select();
    console.log(
      "Subscription data updated",
      eventData.data.id,
      eventData.data.status,
      eventData.data.items[0].price?.id ?? "",
      eventData.data.items[0].price?.productId ?? "",
      eventData.data.scheduledChange?.effectiveAt,
      eventData.data.customerId,
      eventData.data.nextBilledAt,
      eventData.data.billingCycle.frequency,
      eventData.data.billingCycle.interval,
      eventData.data.currentBillingPeriod?.startsAt,
      eventData.data.currentBillingPeriod?.endsAt
    );

    if (error) throw error;
  }

  private async updateCustomerData(
    eventData: CustomerCreatedEvent | CustomerUpdatedEvent
  ) {
    const supabase = await createClient();
    const { error } = await supabase
      .from("customers")
      .upsert({
        customer_id: eventData.data.id,
        email: eventData.data.email,
      })
      .select();
    console.log(
      "Customer data updated",
      eventData.data.id,
      eventData.data.email
    );
    if (error) throw error;
  }
}
