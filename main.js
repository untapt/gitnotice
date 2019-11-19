#! /usr/bin/env node
const VERSION = '0.2.1';
const HOOK_VERSION = '0.2.0';
const fs = require('fs');
const { argv } = process;
const path = require('path');
const { exec } = require('child_process');


if(argv.length < 3) {
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
    // console.log(`GITNOTICE - distributed notifications in your VCS\n`);
    console.log(`gitnotice-cli: v${VERSION}`);
    console.log(`(notice-hook v${HOOK_VERSION})`)
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
    console.log('gitnotice initialized ('+VERSION+')');
}

if (argv[2] === 'check') {
    check(argv[3]);
}

function initAll(directory='') {

    const cwd = path.join(process.cwd(), directory);

    // console.log('checking ', cwd);

    if (fs.existsSync(path.join(cwd, '.git'))) {
        // console.log('initializing in directoryyyy', directory);
        const initializedIn = init(directory);
        return [initializedIn];
    }

    const subfolders = fs.readdirSync(cwd).filter(item => {
        // console.log ('itenmmm ', item);
        // console.log('cwd???', cwd);
        return fs.lstatSync(path.join(cwd,item)).isDirectory()
    });

    if (!subfolders.length) {
        return
    }
    // console.log('subfolders ', subfolders);
    return [].concat(subfolders.map(subfolder => initAll(path.join(directory, subfolder))).filter(result => result && result.length));
}

function init(directory='.') {
    enforceGitExistsOrExit(directory);
    const cwd = path.join(process.cwd(), directory);

    exec(`cp -f ${path.join(__dirname, 'post-merge')} .git/hooks/`, {cwd, timeout: 5}, (err, stdout, stderr) => {
        if (err) {
            // console.error(err);
            // throw err;
        }
        if (stderr) {
            // console.error(stderr);
        }
    });

    return cwd;

}


function check(directory='.') {
    enforceGitExistsOrExit(directory);
    const cwd = path.join(process.cwd(), directory);
    exec(`cat ${path.join(cwd, directory, '.git/hooks/post-merge')} | head -n 2 | tail -n 1`, {cwd}, (err, stdout, stderr) => {
        const match = stdout.match(/#(v[\d.\w]*)/);
        if (match && match.length > 1) {
            console.log(`✅ gitnotice (${match[1]}) initialized in ${path.join(cwd, directory)}`);
        }
    })

}


function enforceGitExistsOrExit(directory='.') {
    const cwd = path.join(process.cwd(), directory);
    if(!fs.existsSync(path.join(cwd, '.git'))) {
        console.error("No git project found");
        process.exit(2);
    }
}