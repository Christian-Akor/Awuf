import type { NextApiRequest, NextApiResponse } from "next";
import crypto from "crypto";
import { supabaseAdmin } from "../../../server/supabaseAdmin";

export const config = {
  api: {
    bodyParser: false
  }
};

async function getRawBody(req: NextApiRequest): Promise<Buffer> {
  const chunks: Buffer[] = [];
  for await (const chunk of req) {
    chunks.push(typeof chunk === "string" ? Buffer.from(chunk) : chunk);
  }
  return Buffer.concat(chunks);
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "POST") return res.status(405).end();

  const rawBody = await getRawBody(req);
  const signature = req.headers["x-paystack-signature"] as string;

  const hash = crypto
    .createHmac("sha512", process.env.PAYSTACK_SECRET_KEY!)
    .update(rawBody)
    .digest("hex");

  if (hash !== signature) {
    return res.status(401).send("Invalid signature");
  }

  const event = JSON.parse(rawBody.toString("utf-8"));

  if (event.event === "charge.success") {
    const { metadata, amount, reference } = event.data;
    const userId = metadata?.user_id;
    const creditAmount = Number(amount) / 100;

    if (!userId) return res.status(400).send("Missing user_id");

    const { error } = await supabaseAdmin.rpc("credit_wallet", {
      p_user_id: userId,
      p_amount: creditAmount,
      p_reference: reference
    });

    if (error) return res.status(500).send("Wallet credit failed");
  }

  return res.status(200).send("OK");
}
