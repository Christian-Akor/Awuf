import { useEffect, useState } from "react";
import { supabase } from "../lib/supabase";

type Profile = {
  wallet_balance: number;
  full_name: string | null;
};

export default function Home() {
  const [profile, setProfile] = useState<Profile | null>(null);

  useEffect(() => {
    const fetchProfile = async () => {
      const { data: userData } = await supabase.auth.getUser();
      if (!userData?.user) return;

      const { data } = await supabase
        .from("profiles")
        .select("wallet_balance, full_name")
        .eq("id", userData.user.id)
        .single();

      if (data) setProfile(data);
    };

    fetchProfile();
  }, []);

  return (
    <main style={{ padding: 24, fontFamily: "system-ui" }}>
      <h1>Awuf Wallet</h1>
      <p>Hello {profile?.full_name || "User"}</p>

      <div style={{ marginTop: 16 }}>
        <h2>Wallet Balance</h2>
        <p style={{ fontSize: 24 }}>₦{profile?.wallet_balance ?? 0}</p>
      </div>

      <a href="/purchase">Buy Data</a>
    </main>
  );
}
