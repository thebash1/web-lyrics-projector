import { get, set } from '../../../lib/cache.js';
import { fetch } from 'undici';
import * as cheerio from 'cheerio';

function buildUrl(slug) {
  const path = slug.map(encodeURIComponent).join('/');
  return `https://www.letras.com/${path}/`;
}

function chunkVerse(text, sectionIndex) {
  const lines = text.split('\n');
  const chunks = [];
  
  // Dividir en bloques de máximo 2 líneas
  for (let i = 0; i < lines.length; i += 2) {
    chunks.push(lines.slice(i, i + 2).join('\n'));
  }
  
  return chunks.map((chunkText, idx) => {
     let sectionName = '';
     if (idx === 0) {
       sectionName = sectionIndex === 0 ? 'Intro' : `Parte ${sectionIndex + 1}`;
     }
     return {
         text: chunkText,
         section: sectionName
     };
  });
}

function parseLyrics(html) {
  const $ = cheerio.load(html);
  const verses = [];

  let sectionIdx = 0;
  $('.cnt-letra > p').each((_, el) => {
    $(el).find('br').replaceWith('\n');
    const verse = $(el).text().trim();
    if (verse) {
      verses.push(...chunkVerse(verse, sectionIdx));
      sectionIdx++;
    }
  });

  if (!verses.length) {
    sectionIdx = 0;
    $('.lyric-original > p').each((_, el) => {
      $(el).find('br').replaceWith('\n');
      const verse = $(el).text().trim();
      if (verse) {
        verses.push(...chunkVerse(verse, sectionIdx));
        sectionIdx++;
      }
    });
  }

  if (!verses.length) {
    sectionIdx = 0;
    $('.lyric > p, .lyric p, .js-lyric-content').each((_, el) => {
      $(el).find('br').replaceWith('\n');
      const txt = $(el).text().trim();
      if (txt) {
        verses.push(...chunkVerse(txt, sectionIdx));
        sectionIdx++;
      }
    });
  }

  return verses;
}

export const GET = async ({ params }) => {
  const slug = params.slug.split('/');
  const cacheKey = slug.join('/');

  const cached = get(cacheKey);
  // Don't use cache if verses is empty
  if (cached && cached.length > 0) {
    return new Response(JSON.stringify({ cached: true, verses: cached }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    });
  }

  try {
    const url = buildUrl(slug);
    const response = await fetch(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/130.0.0.0 Safari/537.36'
      }
    });

    if (!response.ok) {
      return new Response(JSON.stringify({ error: `Failed to fetch lyrics (status ${response.status})` }), {
        status: response.status,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    const html = await response.text();
    const verses = parseLyrics(html);

    if (verses.length > 0) {
      set(cacheKey, verses);
    } else {
      return new Response(JSON.stringify({ error: 'No lyrics found on page' }), {
        status: 404,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    return new Response(JSON.stringify({ cached: false, verses }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    });
  } catch (err) {
    return new Response(JSON.stringify({ error: 'Unexpected error while fetching lyrics', details: err.message }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
}
