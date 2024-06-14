const fs = require('fs');
const path = require('path');

// Source and destination directories
const reposDir = path.dirname(__dirname);
const sourceDirectory = path.join(reposDir, 'scheduler-frontend', 'build');
const destinationDirectory = path.join(reposDir, 'scheduler', 'web');

// Define files to exclude
const excludeFiles = ['asset-manifest.json']; // Example exclude list

function removeRecursively(directory, removeDir = false) {
    if (fs.existsSync(directory)) {
        fs.readdirSync(directory).forEach(file => {
            const filePath = path.join(directory, file);
            if (fs.statSync(filePath).isDirectory()) {
                removeRecursively(filePath,true);
            } else {
                fs.unlinkSync(filePath);
                console.log(`Deleted file: ${filePath}`);
            }
        });

        if(removeDir){
            fs.rmdirSync(directory);
        }
        console.log(`Deleted directory: ${directory}`);
    }
}

removeRecursively(destinationDirectory);

// Function to recursively get files in a directory, excluding specified files
function getFiles(directory) {
    let files = [];
    const entries = fs.readdirSync(directory, { withFileTypes: true });
    for (const entry of entries) {
        const fullPath = path.join(directory, entry.name);
        if (entry.isDirectory()) {
            files = files.concat(getFiles(fullPath));
        } else {
            files.push(fullPath);
        }
    }
    return files;
}

// Get all files in the source directory and its subdirectories, excluding specified files
const files = getFiles(sourceDirectory)
    .filter(file => !excludeFiles.includes(path.basename(file)));

// Move each file to the destination directory
files.forEach(file => {
    const relativePath = path.relative(sourceDirectory, file);
    const destinationPath = path.join(destinationDirectory, relativePath);

    const destinationDir = path.dirname(destinationPath);
    if(!fs.existsSync(destinationDir)){
        fs.mkdirSync(destinationDir, {recursive: true});
        console.log(`Created directory: ${destinationDir}`);
    }
    
    // If the file already exists in the destination directory, remove it before moving
    if (fs.existsSync(destinationPath)) {
        fs.unlinkSync(destinationPath);
    }

    // Move the file to the destination directory
    fs.renameSync(file, destinationPath);
});
