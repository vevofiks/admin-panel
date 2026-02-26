const fs = require('fs');
const path = require('path');

const map = {
    'bg-zinc-950': 'bg-zinc-50 dark:bg-zinc-950',
    'bg-zinc-900': 'bg-white dark:bg-zinc-900',
    'bg-zinc-800': 'bg-zinc-100 dark:bg-zinc-800',
    'bg-zinc-700': 'bg-zinc-200 dark:bg-zinc-700',

    'border-zinc-800': 'border-zinc-200 dark:border-zinc-800',
    'border-zinc-700': 'border-zinc-300 dark:border-zinc-700',
    'border-zinc-600': 'border-zinc-400 dark:border-zinc-600',

    'text-zinc-100': 'text-zinc-900 dark:text-zinc-100',
    'text-zinc-200': 'text-zinc-800 dark:text-zinc-200',
    'text-zinc-300': 'text-zinc-700 dark:text-zinc-300',
    'text-zinc-400': 'text-zinc-600 dark:text-zinc-400',
    // text-zinc-500 is fine in both modes usually, but let's make it dark:text-zinc-400 sometimes
    // We'll leave text-zinc-500 alone so it stays zinc-500 in both modes.
};

function processDir(dir) {
    const files = fs.readdirSync(dir);
    for (const file of files) {
        const fullPath = path.join(dir, file);
        if (fs.statSync(fullPath).isDirectory()) {
            processDir(fullPath);
        } else if (fullPath.endsWith('.tsx') || fullPath.endsWith('.ts')) {
            let content = fs.readFileSync(fullPath, 'utf-8');

            // Avoid double replacing
            let changed = false;
            Object.keys(map).forEach(key => {
                // Don't match if preceded by 'dark:', or preceded by '-' (like hover:bg-zinc-900 which we want to match, but wait: hover is fine! We only need to split prefix!)
                // Wait, if prefix is `hover:bg-zinc-900`, we want `hover:bg-zinc-100 hover:dark:bg-zinc-900`
                // Actually, we can just replace `bg-zinc-900` with `bg-white dark:bg-zinc-900` 
                // BUT if it has `hover:` or `focus:`, we must duplicate the prefix!
                // regex to catch prefixes: `([a-z:-]*\\b)?` 
                const regex = new RegExp(`(?<!dark:)(?:([a-z:\\-]+):)?\\b${key}(?:\\/(\\d+))?\\b`, 'g');
                content = content.replace(regex, (match, prefix, opacity) => {
                    if (opacity) {
                        const parts = map[key].split(' ');
                        const p = prefix ? prefix + ':' : '';
                        const lightClass = `${p}${parts[0]}/${opacity}`;
                        const darkClass = `${p}${parts[1]}/${opacity}`.replace(`${p}dark:`, `dark:${p}`);
                        changed = true;
                        return `${lightClass} ${darkClass}`;
                    }
                    const parts = map[key].split(' ');
                    const p = prefix ? prefix + ':' : '';
                    const lightClass = `${p}${parts[0]}`;
                    const darkClass = `${p}${parts[1]}`.replace(`${p}dark:`, `dark:${p}`); // ensure dark:hover: instead of hover:dark:
                    changed = true;
                    return `${lightClass} ${darkClass}`;
                });
            });
            if (changed) {
                fs.writeFileSync(fullPath, content);
            }
        }
    }
}

processDir(path.join(__dirname, 'src'));
console.log('Theme classes replaced!');
