import type { NextApiRequest, NextApiResponse } from "next";
import { supabaseAdmin } from "../../server/supabaseAdmin";
import { giftData } from "../../server/jarapoint";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "POST") return res.status(405).end();

  const { user_id, network, phone, size_mb, amount, provider } = req.body;

  const { data, error } = await supabaseAdmin.rpc("purchase_data_atomic", {
    p_user_id: user_id,
    p_provider: provider,
    p_network: network,
    p_phone: phone,
    p_size_mb: size_mb,
    p_amount: amount
  });

  if (error) return res.status(400).json({ error: error.message });

  try {
    const apiRes = await giftData({ network, phone, size_mb });

    await supabaseAdmin
      .from("transactions")
      .update({ status: "success", provider_ref: apiRes.reference })
      .eq("id", data.transaction_id);

    return res.json({ success: true, transaction_id: data.transaction_id });
  } catch (e) {
    await supabaseAdmin.rpc("purchase_rollback", {
      p_transaction_id: data.transaction_id
    });

    return res.status(500).json({ error: "Provider failed, rolled back" });
  }
}
