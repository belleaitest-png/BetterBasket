const BASE = "/api";

export async function* streamChat(
  sessionId: string,
  message: string
): AsyncGenerator<string> {
  const response = await fetch(`${BASE}/chat`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ session_id: sessionId, message }),
  });

  if (!response.ok || !response.body) {
    throw new Error(`Chat request failed: ${response.status}`);
  }

  const reader = response.body.getReader();
  const decoder = new TextDecoder();
  let buffer = "";

  while (true) {
    const { done, value } = await reader.read();
    if (done) break;

    buffer += decoder.decode(value, { stream: true });
    const lines = buffer.split("\n");
    buffer = lines.pop() ?? "";

    for (const line of lines) {
      if (line.startsWith("data: ")) {
        const data = line.slice(6);
        if (data === "[DONE]") return;
        yield data;
      }
    }
  }
}

export async function getBasket(sessionId: string) {
  const res = await fetch(`${BASE}/basket/${sessionId}`);
  return res.json();
}

export async function removeBasketItem(sessionId: string, productId: string) {
  const res = await fetch(`${BASE}/basket/${sessionId}/item`, {
    method: "DELETE",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ product_id: productId }),
  });
  return res.json();
}

export async function updateBasketQuantity(
  sessionId: string,
  productId: string,
  quantity: number
) {
  const res = await fetch(`${BASE}/basket/${sessionId}/quantity`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ product_id: productId, quantity }),
  });
  return res.json();
}

export async function* streamList(sessionId: string): AsyncGenerator<string> {
  const response = await fetch(`${BASE}/list/${sessionId}/stream`);
  if (!response.ok || !response.body) return;

  const reader = response.body.getReader();
  const decoder = new TextDecoder();
  let buffer = "";

  while (true) {
    const { done, value } = await reader.read();
    if (done) break;
    buffer += decoder.decode(value, { stream: true });
    const lines = buffer.split("\n");
    buffer = lines.pop() ?? "";
    for (const line of lines) {
      if (line.startsWith("data: ")) {
        const data = line.slice(6);
        if (data === "[DONE]") return;
        yield data;
      }
    }
  }
}
