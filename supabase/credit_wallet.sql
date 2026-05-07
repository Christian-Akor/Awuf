create or replace function public.credit_wallet(
  p_user_id uuid,
  p_amount numeric,
  p_reference text
) returns void
language plpgsql
security definer
as $$
begin
  update public.profiles
    set wallet_balance = wallet_balance + p_amount
  where id = p_user_id;

  insert into public.transactions (
    user_id, provider, network, phone, size_mb, amount, status, provider_ref
  ) values (
    p_user_id, 'paystack', 'wallet', 'wallet', 0, p_amount, 'success', p_reference
  );
end;
$$;
