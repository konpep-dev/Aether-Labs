const sharp = require('sharp');
const toIco = require('to-ico');
const fs = require('fs');
const path = require('path');

const svgContent = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512">
  <defs>
    <linearGradient id="bgGrad" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" style="stop-color:#0B1221"/>
      <stop offset="100%" style="stop-color:#050b14"/>
    </linearGradient>
    <linearGradient id="aGrad" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" style="stop-color:#00e5ff"/>
      <stop offset="100%" style="stop-color:#0099cc"/>
    </linearGradient>
  </defs>
  <rect width="512" height="512" rx="90" fill="url(#bgGrad)"/>
  <path d="M256 80 L96 432 L144 432 L256 176 L368 432 L416 432 Z" fill="url(#aGrad)"/>
</svg>`;

async function generateIcons() {
  const publicDir = path.join(__dirname, '..', 'public');
  
  if (!fs.existsSync(publicDir)) {
    fs.mkdirSync(publicDir, { recursive: true });
  }

  const svgBuffer = Buffer.from(svgContent);

  console.log('Generating PNG 512x512...');
  await sharp(svgBuffer).resize(512, 512).png().toFile(path.join(publicDir, 'icon.png'));

  console.log('Generating PNG sizes for ICO...');
  const sizes = [256, 128, 64, 48, 32, 16];
  const pngBuffers = await Promise.all(
    sizes.map(size => sharp(svgBuffer).resize(size, size).png().toBuffer())
  );

  console.log('Generating ICO...');
  const icoBuffer = await toIco(pngBuffers);
  fs.writeFileSync(path.join(publicDir, 'icon.ico'), icoBuffer);

  console.log('Done! Icons created:');
  console.log('- public/icon.png (512x512)');
  console.log('- public/icon.ico (multi-size)');
}

generateIcons().catch(console.error);
