#! /usr/bin/env node
const VERSION = '0.5.0';
const HOOK_VERSION = '0.2.0';
const fs = require('fs');
const {argv} = process;
const path = require('path');
const {exec, execSync} = require('child_process');


if (argv.length < 3) {
    // no arguments were passed
    console.log(
        `
Usage:

gitnotice init-all - from the working directory, initializes gitnotice hooks for all git projects found recursivly
gitnotice init [directory] - initialize gitnotice hook in directory, or in current project.
gitnotice check - check if gitnotice is initialize in current project (must be at root level where .git resides)
gitnotice -v - print the version and exit
`)
}

if (argv.includes('-v')) {
    console.log(`GITNOTICE - distributed notifications in your VCS\n`);
    console.log(`gitnotice-cli: v${VERSION}`);
    console.log(`notice-hook:   v${HOOK_VERSION}`);
}

if (argv[2] === 'init-all') {
    const inits = initAll(argv[3]);
    if (!inits.length) {
        return 'No git repositories found';
    }
    console.log("Initialized Gitnotice in the following repositories:");
    console.log(inits.map(i => '✅  ' + i).join("\n"))
}

if (argv[2] === 'init') {
    init(argv[3]);
    console.log('gitnotice initialized (notice-hook: ' + HOOK_VERSION + ')');
}

if (argv[2] === 'check') {
    check(argv[3]);
}


function initAll(directory = '') {

    const cwd = path.join(process.cwd(), directory);

    if (fs.existsSync(path.join(cwd, '.git'))) {
        const initializedIn = init(directory);
        return [initializedIn];
    }

    const subfolders = fs.readdirSync(cwd).filter(item => {
        return fs.lstatSync(path.join(cwd, item)).isDirectory()
    });

    if (!subfolders.length) {
        return
    }
    return [].concat(subfolders.map(subfolder => initAll(path.join(directory, subfolder))).filter(result => result && result.length));
}


function init(directory = '.') {
    enforceGitExistsOrExit(directory);
    const cwd = path.join(process.cwd(), directory);

    // update notice-hook (also adds if it doesn't exist)
    _copyProjectFileToDirectory('notice-hook', directory + '/.git/hooks/');

    // If there's no post-merge hook, use ours
    if (!fs.existsSync(path.join(cwd, '.git/hooks/post-merge'))) {
        _copyProjectFileToDirectory('post-merge', directory + '/.git/hooks/')
    }

    // If the post-merge hook does not call post-merge, add a line to call it.
    if (!execSync(`cat ${path.join(cwd, '.git/hooks/post-merge')} | grep "./notice-hook" || exit 0`)) {
        execSync(`echo '## gitnotice (https://github.com/untapt/gitnotice)' >> ${path.join(cwd, '.git/hooks/post-merge')}`);
        execSync(`echo './notice-hook' >> ${path.join(cwd, '.git/hooks/post-merge')}`);
    }

    return cwd;

}

function _copyProjectFileToDirectory(file, directory = '.') {
    if (!file) {
        throw new Error('file name must be specified');
    }
    const cwd = path.join(process.cwd(), directory);
    exec(`cp -f ${path.join(__dirname, file)} .`, {cwd, timeout: 5}, (err, stdout, stderr) => {
        if (err) {
            console.error(err);
            throw err;
        }
        if (stderr) {
            console.error(stderr);
        }
    });
}


function check(directory = '.') {
    enforceGitExistsOrExit(directory);
    const cwd = path.join(process.cwd(), directory);
    exec(`cat ${path.join(cwd, directory, '.git/hooks/post-merge')} | head -n 2 | tail -n 1`, {cwd}, (err, stdout, stderr) => {
        const match = stdout.match(/#(v[\d.\w]*)/);
        if (match && match.length > 1) {
            console.log(`✅ gitnotice (${match[1]}) initialized in ${path.join(cwd, directory)}`);
        }
    })

}


function enforceGitExistsOrExit(directory = '.') {
    const cwd = path.join(process.cwd(), directory);
    if (!fs.existsSync(path.join(cwd, '.git'))) {
        console.error("No git project found");
        process.exit(2);
    }
}