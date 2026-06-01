import 'dotenv/config';
import prisma from '../lib/prisma';
import fs from 'fs';
import path from 'path';

async function main() {
  const dbPath = path.join(process.cwd(), 'prisma', 'data.json');
  const data = JSON.parse(fs.readFileSync(dbPath, 'utf-8'));

  for (const dest of data) {
    if (dest.imageUrl) {
      await prisma.destination.update({
        where: { id: dest.id },
        data: { imageUrl: dest.imageUrl }
      });
      console.log(`Updated ${dest.id} with imageUrl: ${dest.imageUrl}`);
    }
  }
  console.log('Finished syncing image URLs to database.');
}

main().catch(console.error);
