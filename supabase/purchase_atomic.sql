create or replace function public.purchase_data_atomic(
  p_user_id uuid,
  p_provider text,
  p_network text,
  p_phone text,
  p_size_mb integer,
  p_amount numeric
) returns json
language plpgsql
security definer
as $$
declare
  v_balance numeric;
  v_tx_id uuid;
begin
  select wallet_balance into v_balance
  from public.profiles where id = p_user_id for update;

  if v_balance < p_amount then
    raise exception 'Insufficient balance';
  end if;

  update public.profiles
    set wallet_balance = wallet_balance - p_amount
  where id = p_user_id;

  insert into public.transactions (
    user_id, provider, network, phone, size_mb, amount, status
  ) values (
    p_user_id, p_provider, p_network, p_phone, p_size_mb, p_amount, 'pending'
  ) returning id into v_tx_id;

  return json_build_object('transaction_id', v_tx_id);
end;
$$;

create or replace function public.purchase_rollback(
  p_transaction_id uuid
) returns void
language plpgsql
security definer
as $$
declare
  v_user uuid;
  v_amount numeric;
begin
  select user_id, amount into v_user, v_amount
  from public.transactions where id = p_transaction_id;

  update public.profiles
    set wallet_balance = wallet_balance + v_amount
  where id = v_user;

  update public.transactions
    set status = 'failed'
  where id = p_transaction_id;
end;
$$;
