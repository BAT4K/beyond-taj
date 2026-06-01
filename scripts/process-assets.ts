import fs from 'fs';
import path from 'path';
import sharp from 'sharp';
import os from 'os';

const rawDir = path.join(os.homedir(), 'Downloads', 'photos');
const pubDir = path.join(process.cwd(), 'public', 'destinations');
const dbPath = path.join(process.cwd(), 'prisma', 'data.json');

async function main() {
  console.log('Cleaning public/destinations directory...');
  if (fs.existsSync(pubDir)) {
    fs.rmSync(pubDir, { recursive: true, force: true });
  }
  fs.mkdirSync(pubDir, { recursive: true });

  const rawFiles = fs.readdirSync(rawDir).filter(f => f.match(/\.(jpe?g|png|webp)$/i));
  const data = JSON.parse(fs.readFileSync(dbPath, 'utf-8'));

  const normalize = (s: string) => s.toLowerCase().replace(/[^a-z0-9]/g, '');

  for (const dest of data) {
    const destNameNorm = normalize(dest.name);
    let matchedFile = rawFiles.find(f => {
      const fNorm = normalize(path.basename(f, path.extname(f)));
      return fNorm === destNameNorm || destNameNorm.includes(fNorm) || fNorm.includes(destNameNorm);
    });

    if (matchedFile) {
      const inputPath = path.join(rawDir, matchedFile);
      const outputFilename = `${dest.id}.webp`;
      const outputPath = path.join(pubDir, outputFilename);

      await sharp(inputPath)
        .resize(800, 1000, { fit: 'cover', position: 'center' })
        .webp({ quality: 80 })
        .toFile(outputPath);

      dest.imageUrl = `/destinations/${outputFilename}`;
      console.log(`Processed ${matchedFile} -> ${outputFilename}`);
    } else {
      console.log(`ORPHAN: No image found for destination "${dest.name}" (ID: ${dest.id})`);
    }
  }

  fs.writeFileSync(dbPath, JSON.stringify(data, null, 2));
  console.log('Database synced.');
}

main().catch(console.error);
