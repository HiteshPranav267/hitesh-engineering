import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const BASE_DIR = path.join(__dirname, '..');
const PUBLIC_NOTES = path.join(BASE_DIR, 'public', 'notes');
const DATA_FILE = path.join(BASE_DIR, 'data', 'resources.ts');

function getResourceType(filename) {
    const ext = path.extname(filename).toLowerCase();
    if (ext === '.pdf') return 'PDF';
    if (['.jpg', '.jpeg', '.png', '.webp'].includes(ext)) return 'Image';
    return 'Other';
}

function getDeptShortcut(folder) {
    const f = folder.toLowerCase();
    if (f.includes('1st') || f.includes('s&h') || f.includes('chem') || f.includes('phys')) return 'S&H';
    if (f.includes('ece') || f.includes('electronics')) return 'ECE';
    if (f.includes('cse') || f.includes('computer')) return 'CSE';
    return 'Other';
}

function getYearShortcut(folder) {
    if (folder.includes('1st') || folder.includes('year 1') || folder.includes('chem') || folder.includes('phys')) return '1';
    if (folder.includes('ece') || folder.includes('2nd') || folder.includes('sem 3') || folder.includes('sem 4')) return '2';
    if (folder.includes('sem 5') || folder.includes('sem 6')) return '3';
    return '1';
}

function walkDir(dir, fileList = []) {
    if (!fs.existsSync(dir)) return [];
    const files = fs.readdirSync(dir);
    for (const file of files) {
        const filePath = path.join(dir, file);
        if (fs.statSync(filePath).isDirectory()) {
            walkDir(filePath, fileList);
        } else {
            if (file.startsWith('.') || file.startsWith('_')) continue;
            fileList.push(filePath);
        }
    }
    return fileList;
}

let existingResources = [];
if (fs.existsSync(DATA_FILE)) {
    const content = fs.readFileSync(DATA_FILE, 'utf8');
    const blocks = content.match(/\{[\s\S]+?\}/g);
    if (blocks) {
        blocks.forEach(block => {
            try {
                // Better JSON-like parsing for TS objects
                let cleaned = block
                    .replace(/([\{\s,])(\w+):/g, '$1"$2":') // Quote unquoted keys
                    .replace(/'/g, '"') // Normalize quotes
                    .replace(/,\s*([\}\]])/g, '$1'); // Remove trailing commas

                const obj = JSON.parse(cleaned);
                if (obj.url) existingResources.push(obj);
            } catch (e) {
                // Skip if still invalid
            }
        });
    }
}

// Ensure the PYQ link is definitely in there if it was lost
if (!existingResources.some(r => r.url.includes('11U56PJ-VZ_5zaJ1fVrV6h3kzN4rnNX7E'))) {
    existingResources.push({
        id: "res-ext-pyqs",
        title: "PYQs (Sem 1 & 2)",
        subject: "General",
        year: "1",
        department: "S&H",
        type: "Drive",
        url: "https://drive.google.com/drive/folders/11U56PJ-VZ_5zaJ1fVrV6h3kzN4rnNX7E",
        semester: 1
    });
}

const manualResources = existingResources.filter(r => r.url && r.url.startsWith('http'));

const localResources = [];
if (fs.existsSync(PUBLIC_NOTES)) {
    // To scan only a certain subfolder, change the path below
    // e.g., path.join(PUBLIC_NOTES, 'ece')
    const TARGET_FOLDER = PUBLIC_NOTES; // Change this to path.join(PUBLIC_NOTES, 'chem') if desired

    const allFiles = walkDir(TARGET_FOLDER);

    allFiles.forEach((fullPath, index) => {
        const relativePath = path.relative(PUBLIC_NOTES, fullPath);
        const parts = relativePath.split(path.sep);

        const deptFolder = parts[0];
        const subject = parts.length > 1 ? parts[1] : 'General';
        const filename = parts[parts.length - 1];

        const url = `/notes/${relativePath.replace(/\\/g, '/')}`;

        localResources.push({
            id: `res-local-${index}`,
            title: filename.replace(/\.[^/.]+$/, "").replace(/_/g, " ").replace(/-/g, " "),
            subject: subject,
            year: getYearShortcut(deptFolder),
            department: getDeptShortcut(deptFolder),
            type: getResourceType(filename),
            url: url,
            tags: parts.slice(2, -1)
        });
    });
}

const finalResources = [...manualResources, ...localResources];

const output = `
export type Year = '1' | '2' | '3' | '4';
export type Department = 'S&H' | 'ECE' | 'CSE' | 'Other';
export type ResourceType = 'PDF' | 'Website' | 'Drive' | 'GitHub' | 'Image' | 'Other';

export interface Resource {
    id: string;
    title: string;
    subject: string;
    year: Year;
    department: Department;
    type: ResourceType;
    url: string;
    semester?: number;
    description?: string;
    tags?: string[];
}

export const resources: Resource[] = ${JSON.stringify(finalResources, null, 4)};
`;

fs.writeFileSync(DATA_FILE, output);
console.log(`✅ Success! Synced ${localResources.length} local files.`);
console.log(`🔗 Kept ${manualResources.length} external links.`);
