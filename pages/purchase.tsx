import { useEffect, useState } from "react";
import { supabase } from "../lib/supabase";

type Pricing = Record<string, { size_mb: number; price: number }[]>;

export default function PurchasePage() {
  const [pricing, setPricing] = useState<Pricing>({});
  const [network, setNetwork] = useState("MTN");
  const [sizeMb, setSizeMb] = useState(1000);
  const [phone, setPhone] = useState("");

  useEffect(() => {
    fetch("/pricing.json")
      .then((res) => res.json())
      .then((data) => setPricing(data));
  }, []);

  const handlePurchase = async () => {
    const { data: userData } = await supabase.auth.getUser();
    if (!userData?.user) return alert("Login required");

    const plan = pricing[network]?.find((p) => p.size_mb === sizeMb);
    if (!plan) return alert("Invalid plan");

    const res = await fetch("/api/purchase", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        user_id: userData.user.id,
        network,
        phone,
        size_mb: sizeMb,
        amount: plan.price,
        provider: "jarapoint"
      })
    });

    const json = await res.json();
    if (!res.ok) return alert(json.error || "Failed");

    alert("Purchase successful!");
  };

  return (
    <main style={{ padding: 24, fontFamily: "system-ui" }}>
      <h1>Buy Data</h1>

      <label>Network</label>
      <select value={network} onChange={(e) => setNetwork(e.target.value)}>
        {Object.keys(pricing).map((net) => (
          <option key={net}>{net}</option>
        ))}
      </select>

      <label>Plan</label>
      <select value={sizeMb} onChange={(e) => setSizeMb(Number(e.target.value))}>
        {(pricing[network] || []).map((p) => (
          <option key={p.size_mb} value={p.size_mb}>
            {p.size_mb}MB — ₦{p.price}
          </option>
        ))}
      </select>

      <label>Phone</label>
      <input
        value={phone}
        onChange={(e) => setPhone(e.target.value)}
        placeholder="0803..."
      />

      <button onClick={handlePurchase}>Buy</button>
    </main>
  );
}
