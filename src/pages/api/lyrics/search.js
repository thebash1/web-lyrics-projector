import { getLyricsData } from '../../../services/lyricsService.js';

export const GET = async ({ request }) => {
  const url = new URL(request.url);
  const pathParam = url.searchParams.get('path');

  if (!pathParam) {
    return new Response(JSON.stringify({ error: 'Falta el parámetro "path"' }), {
      status: 400,
      headers: { 'Content-Type': 'application/json' }
    });
  }

  return await getLyricsData(pathParam);
}
