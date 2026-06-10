const fs = require('fs');
const https = require('https');
const path = require('path');

async function downloadFont() {
  const cssUrl = 'https://fonts.googleapis.com/css2?family=Playfair+Display&display=swap';
  
  const options = {
    headers: {
      'User-Agent': 'Mozilla/5.0 (Windows NT 6.1; WOW64; Trident/7.0; rv:11.0) like Gecko' // Force TTF
    }
  };

  https.get(cssUrl, options, (res) => {
    let data = '';
    res.on('data', chunk => data += chunk);
    res.on('end', () => {
      const match = data.match(/url\((https:\/\/[^)]+\.ttf)\)/i);
      if (match && match[1]) {
        const ttfUrl = match[1];
        console.log('Found TTF URL:', ttfUrl);
        const fontPath = path.join(process.cwd(), 'public', 'fonts', 'PlayfairDisplay-Regular.ttf');
        fs.mkdirSync(path.join(process.cwd(), 'public', 'fonts'), { recursive: true });
        
        const file = fs.createWriteStream(fontPath);
        https.get(ttfUrl, (ttfRes) => {
          ttfRes.pipe(file);
          file.on('finish', () => {
            file.close();
            console.log('Font downloaded successfully to', fontPath);
          });
        }).on('error', (err) => {
          console.error('Error downloading TTF:', err.message);
        });
      } else {
        console.log('No TTF URL found in CSS.');
      }
    });
  }).on('error', (err) => {
    console.error('Error fetching CSS:', err.message);
  });
}

downloadFont();
