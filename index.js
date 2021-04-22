#!/usr/bin/env node

import chalk from 'chalk'; // colorizes the terminal output
import clear from 'clear'; // clears the terminal screen
import figlet from 'figlet'; // creates ASCII art from text
import * as  files from './lib/files.js';
import * as  github from './lib/github.js';
import * as  repo from './lib/repo.js';

// clear console and display welcome message
clear();

console.log(
    chalk.yellow(
        figlet.textSync('Ginit', {horizontalLayout: 'full'})
    )
);

// check if it's already a git project
if (files.directoryExists('.git')) {
    console.log(chalk.red('Already a Git repository!'));
    process.exit();
}

const getGithubToken = async () => {
    // Fetch token from config store
    let token = github.getStoredGithubToken();

    if (token) {
        return token;
    }

    // No token found in local config, use provided one by user to access GitHub account
    token = await github.getPersonalAccessToken();

    console.log('Retrieved token: ', token);

    return token;
};

// get gitHub token
const run = async () => {
    try {
        // Retrieve & Set Authentication Token
        const token = await getGithubToken();
        github.setGithubAuth(token);

        // Create remote repository
        const url = await repo.createRemoteRepo();

        // Create .gitignore file
        await repo.createGitignore();

        // Set up local repository and push to remote
        await repo.setupRepo(url);

        console.log(chalk.green('All done!'));
    } catch (err) {
        if (err) {
            switch (err.status) {
                case 401:
                    console.log(chalk.red('Couldn\'t log you in. Please provide correct credentials/token.'));
                    break;
                case 422:
                    console.log(chalk.red('There is already a remote repository or token with the same name'));
                    break;
                default:
                    console.log(chalk.red(err));
            }
        }
    }
};

run().then();
