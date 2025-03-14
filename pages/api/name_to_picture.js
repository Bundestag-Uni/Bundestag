import * as cheerio from 'cheerio';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST');
    return res.status(405).json({ error: 'Nur POST-Anfragen sind erlaubt.' });
  }

  const { firstName, lastName } = req.body;

  if (!firstName || !lastName) {
    return res.status(400).json({ error: 'firstName und lastName sind erforderlich.' });
  }

  const fullName = `${firstName} ${lastName}`;
  const pageTitle = fullName.trim().split(' ').join('_');
  const wikiUrl = `https://de.wikipedia.org/wiki/${encodeURIComponent(pageTitle)}`;

  try {
    let response = await fetch(wikiUrl);
    if (!response.ok) {

      const fullName = `${firstName} von ${lastName}`;
      const pageTitle = fullName.trim().split(' ').join('_');
      const wikiUrl = `https://de.wikipedia.org/wiki/${encodeURIComponent(pageTitle)}`;
      response = await fetch(wikiUrl);

      if (!response.ok) {
        imageURL = 'https://media.istockphoto.com/id/1341046662/vector/picture-profile-icon-human-or-people-sign-and-symbol-for-template-design.jpg?s=612x612&w=0&k=20&c=A7z3OK0fElK3tFntKObma-3a7PyO8_2xxW0jtmjzT78=';
      }
    }
    const html = await response.text();
    const $ = cheerio.load(html);
    const imgElement = $('figure.mw-default-size img').first();
    let imageURL = null;
    if (imgElement && imgElement.attr('src')) {
      imageURL = imgElement.attr('src');
      if (imageURL.startsWith('//')) {
        imageURL = 'https:' + imageURL;
      }
    }
    if (!imageURL) {
      imageURL = 'https://media.istockphoto.com/id/1341046662/vector/picture-profile-icon-human-or-people-sign-and-symbol-for-template-design.jpg?s=612x612&w=0&k=20&c=A7z3OK0fElK3tFntKObma-3a7PyO8_2xxW0jtmjzT78=';
    }

    return res.status(200).json({ imageURL });
  } catch (error) {
    console.error('Fehler beim Verarbeiten der Anfrage:', error);
    return res.status(500).json({ error: 'Serverfehler', details: error.message });
  }
}
