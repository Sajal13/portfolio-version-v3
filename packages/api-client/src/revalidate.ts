export async function revalidateWeb(tags: string[]): Promise<void> {
  const webUrl = process.env.WEB_APP_URL;
  const secret = process.env.REVALIDATE_SECRET;

  if (!webUrl || !secret) {
    console.error('revalidateWeb: WEB_APP_URL or REVALIDATE_SECRET missing — skipping');
    return;
  }

  try {
    await fetch(`${webUrl}/api/revalidate`, {
      method: 'POST',
      headers: { 'content-type': 'application/json', 'x-revalidate-secret': secret },
      body: JSON.stringify({ tags })
    });
  } catch (e) {
    console.error('revalidateWeb failed', e);
  }
}