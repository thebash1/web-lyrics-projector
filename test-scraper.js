import { fetch } from 'undici';
import * as cheerio from 'cheerio';

async function test() {
  const url = 'https://www.letras.com/coldplay/yellow/';
  const res = await fetch(url, {
    headers: {
      'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/130.0.0.0 Safari/537.36'
    }
  });
  console.log('Status:', res.status);
  const html = await res.text();
  console.log('HTML length:', html.length);
  
  const $ = cheerio.load(html);
  const verses = [];

  $('.cnt-letra > p').each((_, el) => {
    $(el).find('br').replaceWith('\n');
    const verse = $(el).text().trim();
    if (verse) verses.push(verse);
  });

  if (!verses.length) {
    // New selector for Letras.com as they often update their UI
    $('.lyric-original > p').each((_, el) => {
      $(el).find('br').replaceWith('\n');
      const verse = $(el).text().trim();
      if (verse) verses.push(verse);
    });
  }
  
  if (!verses.length) {
      // Fallback: look for generic lyric blocks
      $('.lyric > p, .lyric p, .js-lyric-content').each((_, el) => {
        $(el).find('br').replaceWith('\n');
        const verse = $(el).text().trim();
        if (verse) verses.push(verse);
      });
  }

  console.log('Found verses:', verses.length);
  console.log(verses.slice(0, 2));
}
test();
