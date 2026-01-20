const fs = require('fs');
const path = require('path');

// Define paths
const frontendVercelPath = path.join(__dirname, 'frontend', 'vercel.json');
const rootVercelPath = path.join(__dirname, 'vercel.json');

// Create the vercel.json configuration
const vercelConfig = {
  buildCommand: 'npm run build',
  outputDirectory: 'dist',
  rewrites: [
    {
      source: '/(.*)',
      destination: '/index.html'
    }
  ]
};

// Create vercel.json in frontend folder
try {
  fs.writeFileSync(frontendVercelPath, JSON.stringify(vercelConfig, null, 2));
  console.log('✓ Created vercel.json in frontend folder');
} catch (error) {
  console.error('✗ Error creating frontend/vercel.json:', error.message);
  process.exit(1);
}

// Remove old vercel.json from root if it exists
if (fs.existsSync(rootVercelPath)) {
  try {
    fs.unlinkSync(rootVercelPath);
    console.log('✓ Removed old vercel.json from root folder');
  } catch (error) {
    console.error('✗ Error removing root vercel.json:', error.message);
  }
}

console.log('\n✓ Vercel configuration setup complete!');
console.log('  - Frontend vercel.json is ready for deployment');
