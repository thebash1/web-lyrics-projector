import { get, set } from '../lib/cache.js';
import { capitalizeTitle } from '../lib/textFormatting.js';
import fs from 'fs/promises';
import path from 'path';

function chunkVerse(text, sectionIndex) {
  const lines = text.split('\n');
  const chunks = [];

  for (let i = 0; i < lines.length; i += 4) {
    chunks.push(lines.slice(i, i + 4).join('\n'));
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

function parseTextLyrics(text) {
  const verses = [];
  // Normalize line endings and split by blank lines to separate verses
  const rawVerses = text.replace(/\r\n/g, '\n').split(/\n\s*\n/);

  let sectionIdx = 0;
  for (const rawVerse of rawVerses) {
    const verse = rawVerse.trim();
    if (verse) {
      verses.push(...chunkVerse(verse, sectionIdx));
      sectionIdx++;
    }
  }

  return verses;
}

export async function getLyricsData(slugParam) {
  const slug = slugParam.split('/');
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
    // Construct the file path: public/ly/[slug path].txt
    const filePath = path.join(process.cwd(), 'public', 'ly', `${slug.join('/')}.txt`);

    let text;
    try {
      text = await fs.readFile(filePath, 'utf-8');
    } catch (err) {
      if (err.code === 'ENOENT') {
        return new Response(JSON.stringify({ error: `Lyrics file not found for: ${slug.join('/')}` }), {
          status: 404,
          headers: { 'Content-Type': 'application/json' }
        });
      }
      throw err;
    }

    const verses = parseTextLyrics(text);

    if (verses.length > 0) {
      set(cacheKey, verses);
    } else {
      return new Response(JSON.stringify({ error: 'No lyrics found in file' }), {
        status: 404,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    return new Response(JSON.stringify({ cached: false, verses }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    });
  } catch (err) {
    return new Response(JSON.stringify({ error: 'Unexpected error while reading lyrics', details: err.message }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
}

export async function findSongsByArtist(artistSlug, songQuery) {
  try {
    const dirPath = path.join(process.cwd(), 'public', 'ly', artistSlug);
    
    let files;
    try {
      files = await fs.readdir(dirPath);
    } catch (err) {
      if (err.code === 'ENOENT') {
        return new Response(JSON.stringify({ error: `Artist not found: ${artistSlug}` }), {
          status: 404,
          headers: { 'Content-Type': 'application/json' }
        });
      }
      throw err;
    }

    // Filter only .txt files
    let songs = files
      .filter(file => file.endsWith('.txt'))
      .map(file => {
        const slug = file.replace('.txt', '');
        // Usar la función de capitalización personalizada
        const name = capitalizeTitle(slug.replace(/-/g, ' '));
        return {
          slug,
          name
        };
      });

    // If there is a query, filter by it
    if (songQuery) {
      const queryLower = songQuery.toLowerCase().replace(/ /g, '-');
      songs = songs.filter(song => song.slug.includes(queryLower));
    }

    return new Response(JSON.stringify({ songs }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    });
  } catch (err) {
    return new Response(JSON.stringify({ error: 'Unexpected error while listing songs', details: err.message }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
}
