const fs = require('fs');
const path = require('path');

function copyFolderSync(from, to) {
  // Create destination folder if it doesn't exist
  if (!fs.existsSync(to)) {
    fs.mkdirSync(to, { recursive: true });
  }

  // Read all files/folders in source
  const files = fs.readdirSync(from);

  files.forEach(file => {
    const fromPath = path.join(from, file);
    const toPath = path.join(to, file);

    const stat = fs.statSync(fromPath);

    if (stat.isDirectory()) {
      // Recursively copy subdirectories
      copyFolderSync(fromPath, toPath);
    } else {
      // Copy file
      fs.copyFileSync(fromPath, toPath);
      console.log(`Copied: ${fromPath} -> ${toPath}`);
    }
  });
}

// Copy mails folder to build directory
const mailsSource = path.join(__dirname, 'mails');
const mailsDest = path.join(__dirname, 'build', 'mails');

console.log('Copying email templates...');
copyFolderSync(mailsSource, mailsDest);
console.log('Email templates copied successfully!');
