type GiftDataInput = {
  network: string;
  phone: string;
  size_mb: number;
};

export async function giftData(input: GiftDataInput) {
  // TODO: Replace with real Jarapoint endpoint and payload fields
  const response = await fetch(`${process.env.JARAPOINT_BASE_URL}/gift`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${process.env.JARAPOINT_API_KEY}`
    },
    body: JSON.stringify({
      network: input.network,
      phone: input.phone,
      size_mb: input.size_mb
    })
  });

  if (!response.ok) {
    throw new Error("Jarapoint request failed");
  }

  return response.json();
}
