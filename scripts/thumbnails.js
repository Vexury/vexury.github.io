const fs = require('fs');
const path = require('path');
const sharp = require('sharp');

const IMAGES_DIR = path.join(__dirname, '..', 'src', 'images');
const THUMBS_DIR = path.join(IMAGES_DIR, 'thumbs');
const THUMB_WIDTH = 400;
const EXTENSIONS = ['.jpg', '.jpeg', '.png'];

async function generateThumbnails() {
  if (!fs.existsSync(THUMBS_DIR)) {
    fs.mkdirSync(THUMBS_DIR);
  }

  const files = fs.readdirSync(IMAGES_DIR).filter(f => {
    const ext = path.extname(f).toLowerCase();
    return EXTENSIONS.includes(ext);
  });

  let generated = 0;
  let skipped = 0;

  for (const file of files) {
    const srcPath = path.join(IMAGES_DIR, file);
    // All thumbnails are JPEG for smaller file size
    const thumbName = path.parse(file).name + '.jpg';
    const thumbPath = path.join(THUMBS_DIR, thumbName);

    // Skip if thumbnail is newer than source
    if (fs.existsSync(thumbPath)) {
      const srcStat = fs.statSync(srcPath);
      const thumbStat = fs.statSync(thumbPath);
      if (thumbStat.mtimeMs >= srcStat.mtimeMs) {
        skipped++;
        continue;
      }
    }

    await sharp(srcPath)
      .resize(THUMB_WIDTH)
      .jpeg({ quality: 80 })
      .toFile(thumbPath);

    generated++;
  }

  console.log(`Thumbnails: ${generated} generated, ${skipped} up-to-date`);
}

generateThumbnails().catch(err => {
  console.error('Thumbnail generation failed:', err);
  process.exit(1);
});
