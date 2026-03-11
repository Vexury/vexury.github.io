const fs = require('fs');
const path = require('path');
const sharp = require('sharp');
const matter = require('gray-matter');

const IMAGES_DIR = path.join(__dirname, '..', 'src', 'images');
const THUMBS_DIR = path.join(IMAGES_DIR, 'thumbs');
const LARGE_THUMBS_DIR = path.join(THUMBS_DIR, 'large');
const PROJECTS_DIR = path.join(__dirname, '..', 'src', 'projects');
const THUMB_WIDTH = 400;
const LARGE_THUMB_WIDTH = 900;
const EXTENSIONS = ['.jpg', '.jpeg', '.png'];

function getFeaturedImageNames() {
  const names = new Set();
  const files = fs.readdirSync(PROJECTS_DIR).filter(f => f.endsWith('.md'));
  for (const file of files) {
    const { data } = matter(fs.readFileSync(path.join(PROJECTS_DIR, file), 'utf8'));
    if (!data.featured || !data.images) continue;
    for (const img of data.images) {
      names.add(path.basename(img, path.extname(img)));
    }
  }
  return names;
}

async function generateThumbnails() {
  if (!fs.existsSync(THUMBS_DIR)) {
    fs.mkdirSync(THUMBS_DIR);
  }
  if (!fs.existsSync(LARGE_THUMBS_DIR)) {
    fs.mkdirSync(LARGE_THUMBS_DIR);
  }

  const files = fs.readdirSync(IMAGES_DIR).filter(f => {
    const ext = path.extname(f).toLowerCase();
    return EXTENSIONS.includes(ext);
  });

  const featuredImages = getFeaturedImageNames();
  let generated = 0;
  let skipped = 0;

  for (const file of files) {
    const srcPath = path.join(IMAGES_DIR, file);
    // All thumbnails are JPEG for smaller file size
    const thumbName = path.parse(file).name + '.jpg';
    const thumbPath = path.join(THUMBS_DIR, thumbName);

    const srcMtime = fs.statSync(srcPath).mtimeMs;

    const needsSmall = !fs.existsSync(thumbPath) ||
      fs.statSync(thumbPath).mtimeMs < srcMtime;
    const isFeatured = featuredImages.has(path.parse(file).name);
    const largeThumbPath = path.join(LARGE_THUMBS_DIR, thumbName);
    const needsLarge = isFeatured && (!fs.existsSync(largeThumbPath) ||
      fs.statSync(largeThumbPath).mtimeMs < srcMtime);

    if (!needsSmall && !needsLarge) {
      skipped++;
      continue;
    }

    if (needsSmall) {
      await sharp(srcPath)
        .resize(THUMB_WIDTH)
        .jpeg({ quality: 80 })
        .toFile(thumbPath);
    }

    if (needsLarge) {
      await sharp(srcPath)
        .resize(LARGE_THUMB_WIDTH)
        .jpeg({ quality: 80 })
        .toFile(largeThumbPath);
    }

    generated++;
  }

  console.log(`Thumbnails: ${generated} generated, ${skipped} up-to-date`);
}

generateThumbnails().catch(err => {
  console.error('Thumbnail generation failed:', err);
  process.exit(1);
});
