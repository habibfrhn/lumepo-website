import "server-only";

type BrevoValue = string | number | boolean | null;

export async function addContactToBrevo(
  email: string,
  attributes: Record<string, BrevoValue>,
): Promise<void> {
  const apiKey = process.env.BREVO_API_KEY;
  const rawListId = process.env.BREVO_LIST_ID;
  const listId = rawListId ? Number(rawListId) : NaN;

  if (!apiKey || Number.isNaN(listId)) {
    return;
  }

  try {
    const response = await fetch("https://api.brevo.com/v3/contacts", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "api-key": apiKey,
      },
      body: JSON.stringify({
        email,
        attributes,
        listIds: [listId],
        updateEnabled: true,
      }),
    });

    if (!response.ok) {
      console.error("Brevo request failed");
    }
  } catch {
    console.error("Brevo request failed");
  }
}
