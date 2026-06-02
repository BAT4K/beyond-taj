const fs = require('fs');
const path = require('path');

const inputDir = path.join(__dirname, '../blogs');
const outputDir = path.join(__dirname, '../blogs_formatted');

if (!fs.existsSync(outputDir)) {
  fs.mkdirSync(outputDir, { recursive: true });
}

const files = fs.readdirSync(inputDir).filter(f => f.endsWith('.txt'));

function splitSentences(text) {
  // Regex to split sentences safely, ignoring common abbreviations
  // Matches punctuation (.!?) followed by space and uppercase letter,
  // but negative lookbehinds for Mr, Mrs, Ms, Dr, Rs, St, etc.
  const regex = /(?<!\b(Mr|Mrs|Ms|Dr|Rs|St|Prof|Inc|Ltd))\s*(?:[.!?])(?=\s+[A-Z])/g;
  
  let match;
  let lastIndex = 0;
  const sentences = [];
  
  while ((match = regex.exec(text)) !== null) {
    const end = match.index + match[0].trim().length;
    sentences.push(text.slice(lastIndex, end).trim());
    lastIndex = end;
  }
  
  if (lastIndex < text.length) {
    sentences.push(text.slice(lastIndex).trim());
  }
  
  return sentences.filter(s => s.length > 0);
}

for (const file of files) {
  const content = fs.readFileSync(path.join(inputDir, file), 'utf8');
  
  // Extract Title and Target Keyword
  const titleMatch = content.match(/^#\s+(.*)$/m);
  const keywordMatch = content.match(/\*\*Target keyword:\*\*\s*(.*)$/m);
  const metaDescMatch = content.match(/\*\*Meta description:\*\*\s*(.*)$/m);
  
  // Only reformat dense/short files that lack meta description or are extremely short
  if (metaDescMatch && content.length > 1500 && content.includes('\n\n')) {
    fs.writeFileSync(path.join(outputDir, file), content);
    continue;
  }
  
  const title = titleMatch ? titleMatch[1] : file.replace('.txt', '').replace(/_/g, ' ');
  const keyword = keywordMatch ? keywordMatch[1] : '';
  
  let body = content
    .replace(/^#\s+.*$/m, '')
    .replace(/\*\*Target keyword:\*\*\s*.*$/m, '')
    .replace(/\*\*Meta description:\*\*\s*.*$/m, '')
    .replace(/---/g, '')
    .trim();
    
  const sentences = splitSentences(body);
  
  if (sentences.length === 0) {
    fs.writeFileSync(path.join(outputDir, file), content);
    continue;
  }
  
  // Extract Meta description (first 2 sentences if available)
  let metaDesc = '';
  let bodyStartIndex = 0;
  if (sentences.length >= 2) {
    metaDesc = (sentences[0] + ' ' + sentences[1]).replace(/[*#_`]/g, '');
    bodyStartIndex = 2;
  } else {
    metaDesc = sentences[0].replace(/[*#_`]/g, '');
    bodyStartIndex = 1;
  }
  
  let formattedBody = '';
  let inList = false;
  let currentParagraph = [];
  
  for (let i = bodyStartIndex; i < sentences.length; i++) {
    const s = sentences[i];
    
    // Check if sentence looks like a bullet point (contains colon near the start)
    const colonIndex = s.indexOf(':');
    const isBullet = colonIndex !== -1 && colonIndex < 30;
    
    if (isBullet) {
      if (!inList) {
        if (currentParagraph.length > 0) {
          formattedBody += currentParagraph.join(' ') + '\n\n';
          currentParagraph = [];
        }
        formattedBody += '\n'; // Blank line before list
        inList = true;
      }
      const label = s.substring(0, colonIndex).trim();
      const val = s.substring(colonIndex + 1).trim();
      formattedBody += `* **${label}:** ${val}\n`;
    } else {
      if (inList) {
        formattedBody += '\n'; // Blank line after list
        inList = false;
      }
      
      currentParagraph.push(s);
      
      // Group sentences into paragraphs of 2-3 sentences
      if (currentParagraph.length >= 3) {
        formattedBody += currentParagraph.join(' ') + '\n\n';
        currentParagraph = [];
      }
    }
  }
  
  if (currentParagraph.length > 0) {
    // Inject H2 header for the final paragraph to give editorial structure
    formattedBody += '## The Verdict\n\n' + currentParagraph.join(' ') + '\n\n';
  }
  
  const finalContent = `# ${title}\n\n**Meta description:** ${metaDesc}\n\n**Target keyword:** ${keyword}\n\n---\n\n${formattedBody.trim()}\n`;
  fs.writeFileSync(path.join(outputDir, file), finalContent);
}

console.log('Successfully formatted ' + files.length + ' blogs into blogs_formatted/');
