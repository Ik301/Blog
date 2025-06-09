const fs = require('fs/promises');
const path = require('path');
const matter = require('gray-matter');

// --- CONFIGURATION ---
const DRAFTS_PATH = "C:/Obsidian/PC Vault/Writing";
const POSTS_PATH = "C:/Chaewon/src/posts";
// --- END CONFIGURATION ---

/**
 * Recursively finds all .md files in a given directory.
 * @param {string} dir - The directory to search.
 * @returns {Promise<string[]>} - A promise that resolves to an array of full file paths.
 */
async function findMarkdownFiles(dir) {
  try {
    const entries = await fs.readdir(dir, { withFileTypes: true });
    const files = await Promise.all(
      entries.map((entry) => {
        const fullPath = path.join(dir, entry.name);
        return entry.isDirectory() ? findMarkdownFiles(fullPath) : (entry.isFile() && path.extname(entry.name) === '.md' ? fullPath : null);
      })
    );
    return files.flat().filter(file => file !== null);
  } catch (error) {
    if (error.code === 'ENOENT') return []; // If directory doesn't exist, return empty array.
    throw error; // Re-throw other errors.
  }
}

async function publishPosts() {
  console.log(`🔍 Recursively scanning for posts in "${DRAFTS_PATH}"...`);
  try {
    // --- STEP 1: Get all filenames that are ALREADY published ---
    // Using a Set provides a very fast way to check for existence.
    let existingPostNames;
    try {
      existingPostNames = new Set(await fs.readdir(POSTS_PATH));
    } catch (error) {
        if (error.code === 'ENOENT') {
            console.log('Posts directory does not exist yet. Will be created.');
            existingPostNames = new Set(); // It's the first run, so no posts exist.
        } else {
            throw error; // Re-throw other unexpected errors.
        }
    }
    // --- END OF STEP 1 ---

    const files = await findMarkdownFiles(DRAFTS_PATH);

    if (files.length === 0) {
      console.log('No Markdown files were found in the drafts path.');
      return;
    }
    
    console.log(`Found ${files.length} markdown file(s). Checking status...`);
    let publishedCount = 0;

    for (const filePath of files) {
      const fileName = path.basename(filePath);

      // --- STEP 2: The updated check ---
      if (existingPostNames.has(fileName)) {
        // If the file already exists, skip it and do nothing else.
        continue; 
      }

      const fileContent = await fs.readFile(filePath, 'utf8');
      const { data } = matter(fileContent);

      if (
        data.status &&
        Array.isArray(data.status) &&
        data.status.includes('finished') &&
        data.status.includes('blog')
      ) {
        const destinationPath = path.join(POSTS_PATH, fileName);
        await fs.copyFile(filePath, destinationPath);
        console.log(`✅ Newly Published: ${fileName}`);
        publishedCount++;
      }
    }
    // --- END OF STEP 2 ---

    if (publishedCount > 0) {
      console.log(`\n🎉 Successfully published ${publishedCount} new post(s)!`);
    } else {
      console.log('\n✨ No new posts to publish.');
    }

  } catch (error) {
    console.error('❌ An error occurred during the publishing process:');
    console.error(error);
  }
}

publishPosts();