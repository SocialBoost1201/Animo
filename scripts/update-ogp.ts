import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const walkSync = function(dir: string, filelist: string[] = []): string[] {
  const files = fs.readdirSync(dir);
  files.forEach(function(file) {
    const filePath = path.join(dir, file);
    if (fs.statSync(filePath).isDirectory()) {
      filelist = walkSync(filePath, filelist);
    }
    else {
      filelist.push(filePath);
    }
  });
  return filelist;
};

const dirsToScan = [
  'app/(public)/blog',
  'app/(public)/area',
  'app/(public)/about',
  'app/(public)/guide'
];

dirsToScan.forEach(dirPath => {
  const absoluteDir = path.join(__dirname, '..', dirPath);
  if (!fs.existsSync(absoluteDir)) {
    console.log('Not found:', absoluteDir);
    return;
  }
  const files = walkSync(absoluteDir);
  files.forEach(file => {
    if (file.endsWith('page.tsx')) {
      let content = fs.readFileSync(file, 'utf8');
      
      // Match the openGraph block carefully
      const ogRegex = /openGraph:\s*\{([^}]*)\}/;
      const match = content.match(ogRegex);
      if (match) {
        const ogContent = match[1];
        if (!ogContent.includes('images:')) {
          const titleMatch = ogContent.match(/title:\s*['"](.*?)['"]/);
          let title = 'CLUB Animo';
          if (titleMatch) {
            title = encodeURIComponent(titleMatch[1]);
          }
          
          let category = 'Guide';
          if (file.includes('/blog/')) category = 'Blog';
          if (file.includes('/area/')) category = 'Area Info';
          if (file.includes('/about/')) category = 'About';
          
          const insertStr = `\n    images: ['/api/og?title=${title}&category=${category}'],`;
          const newOgContent = ogContent + insertStr;
          content = content.replace(ogContent, newOgContent);
          fs.writeFileSync(file, content);
          console.log('Updated:', file);
        }
      }
    }
  });
});
