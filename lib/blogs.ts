import fs from 'fs';
import path from 'path';

export type BlogCategory = 'Safety' | 'Culture & Etiquette' | 'Logistics' | 'Regions' | 'Itineraries' | 'General';

export interface BlogPost {
  slug: string;
  title: string;
  metaDescription: string;
  targetKeyword: string;
  content: string;
  filename: string;
  category: BlogCategory;
}

const blogsDirectory = path.join(process.cwd(), 'blogs');

/**
 * Parses a raw blog text file into a structured BlogPost object.
 */
function parseBlogFile(filename: string, fileContents: string): BlogPost {
  let title = filename.replace('.txt', '').replace(/_/g, ' ');
  let metaDescription = '';
  let targetKeyword = '';
  let content = fileContents;

  // Extract Title (first # heading)
  const titleMatch = fileContents.match(/^#\s+(.*)$/m);
  if (titleMatch) {
    title = titleMatch[1].trim();
    // Remove the title from the content to avoid duplicate rendering
    content = content.replace(titleMatch[0], '');
  }

  // Extract Meta Description
  const metaDescMatch = fileContents.match(/\*\*Meta description:\*\*\s*(.*)$/m);
  if (metaDescMatch) {
    metaDescription = metaDescMatch[1].trim();
    content = content.replace(metaDescMatch[0], '');
  }

  // Extract Target Keyword
  const keywordMatch = fileContents.match(/\*\*Target keyword:\*\*\s*(.*)$/m);
  if (keywordMatch) {
    targetKeyword = keywordMatch[1].trim();
    content = content.replace(keywordMatch[0], '');
  }

  // Generate a clean slug from the title
  // e.g., "Is Kolkata Safe for Tourists?" -> "is-kolkata-safe-for-tourists"
  const slug = title
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');

  // Clean up any remaining leading formatting (like stray horizontal rules)
  content = content.replace(/^[\s\S]*?(?=^## |^[A-Z]|^\*)/m, '').trim();

  // If there's no clear start to the content after stripping metadata, fallback to just trimming
  if (!content) {
     content = fileContents.replace(titleMatch?.[0] || '', '').replace(metaDescMatch?.[0] || '', '').replace(keywordMatch?.[0] || '', '').trim();
  }

  // Heuristic Categorizer
  let category: BlogCategory = 'General';
  const lowercaseTitle = title.toLowerCase();
  const lowercaseContent = content.toLowerCase();

  if (lowercaseTitle.includes('safe') || lowercaseTitle.includes('danger') || lowercaseTitle.includes('scam') || lowercaseTitle.includes('sick') || lowercaseTitle.includes('belly') || lowercaseTitle.includes('poisoning') || lowercaseTitle.includes('diarrhea') || lowercaseTitle.includes('hospital')) {
    category = 'Safety';
  } else if (lowercaseTitle.includes('itinerary') || lowercaseTitle.includes('day') || lowercaseTitle.includes('week') || lowercaseTitle.includes('route')) {
    category = 'Itineraries';
  } else if (lowercaseTitle.includes('how to') || lowercaseTitle.includes('budget') || lowercaseTitle.includes('cost') || lowercaseTitle.includes('visa') || lowercaseTitle.includes('train') || lowercaseTitle.includes('sim') || lowercaseTitle.includes('packing') || lowercaseTitle.includes('app')) {
    category = 'Logistics';
  } else if (lowercaseTitle.includes('culture') || lowercaseTitle.includes('etiquette') || lowercaseTitle.includes('wear') || lowercaseTitle.includes('stare') || lowercaseTitle.includes('wedding') || lowercaseTitle.includes('religion') || lowercaseTitle.includes('spiritual') || lowercaseTitle.includes('ayurveda')) {
    category = 'Culture & Etiquette';
  } else if (lowercaseTitle.includes('kerala') || lowercaseTitle.includes('rajasthan') || lowercaseTitle.includes('goa') || lowercaseTitle.includes('delhi') || lowercaseTitle.includes('mumbai') || lowercaseTitle.includes('himalayas') || lowercaseTitle.includes('ladakh') || lowercaseTitle.includes('northeast') || lowercaseTitle.includes('kolkata')) {
    category = 'Regions';
  } else {
    // Fallback categorization based on content density
    if (lowercaseContent.includes('itinerary')) category = 'Itineraries';
    else if (lowercaseContent.includes('scam') || lowercaseContent.includes('safe')) category = 'Safety';
    else if (lowercaseContent.includes('train') || lowercaseContent.includes('flight')) category = 'Logistics';
  }

  return {
    slug,
    title,
    metaDescription,
    targetKeyword,
    content,
    filename,
    category,
  };
}

export function getAllBlogs(): BlogPost[] {
  let fileNames: string[] = [];
  try {
    fileNames = fs.readdirSync(blogsDirectory);
  } catch (e) {
    console.warn("Could not read blogs directory:", e);
    return [];
  }
  
  const allBlogs = fileNames
    .filter(name => name.endsWith('.txt'))
    .map(fileName => {
      const fullPath = path.join(blogsDirectory, fileName);
      const fileContents = fs.readFileSync(fullPath, 'utf8');
      return parseBlogFile(fileName, fileContents);
    });

  const premiumFiles = [
    'Article_34_Best_Time_to_Visit_India__Region_by.txt',
    'Article_22_Top_10_Scams_Targeting_Foreign_Tour.txt',
    'Article_32_How_to_Get_an_India_Visa__The_Compl.txt',
    'Article_21_Is_India_Safe_for_Solo_Female_Trave.txt',
    'Article_48_Best_India_Itinerary_for_FirstTimer.txt',
    'Article_103_Ayurveda_in_Kerala__The_Honest_Guid.txt',
    'Article_104_Is_Amritsar_Safe_for_Tourists.txt',
    'Article_105_Is_Udaipur_Safe_for_Solo_Female_Tra.txt'
  ];

  // Sort blogs: Premium rewritten articles first, then alphabetically
  return allBlogs.sort((a, b) => {
    const aIsPremium = premiumFiles.includes(a.filename);
    const bIsPremium = premiumFiles.includes(b.filename);
    
    if (aIsPremium && !bIsPremium) return -1;
    if (!aIsPremium && bIsPremium) return 1;
    
    return a.title.localeCompare(b.title);
  });
}

export function getBlogBySlug(slug: string): BlogPost | undefined {
  const blogs = getAllBlogs();
  return blogs.find(blog => blog.slug === slug);
}
