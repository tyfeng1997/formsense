create table
  public.usage_tracking (
    id uuid not null default uuid_generate_v4(),
    user_id uuid not null,
    customer_id text not null,
    usage_count integer not null default 0,
    reset_date timestamp with time zone not null,
    created_at timestamp with time zone not null default now(),
    updated_at timestamp with time zone not null default now(),
    constraint usage_tracking_pkey primary key (id),
    constraint usage_tracking_user_id_fkey foreign key (user_id) references auth.users (id),
    constraint usage_tracking_customer_id_fkey foreign key (customer_id) references customers (customer_id)
  ) tablespace pg_default;

-- Grant access to authenticated users to read their own usage data
create policy "Enable read access for users to their own usage data" 
  on "public"."usage_tracking" 
  as permissive for select 
  to authenticated 
  using (auth.uid() = user_id);

-- Only allow the service role to update usage data
create policy "Enable update access for service role" 
  on "public"."usage_tracking" 
  as permissive for update 
  to service_role 
  using (true);