import CLUI from 'clui'; // draws command-line tables, gauges and spinners
import _ from 'lodash';
import * as fs from 'fs';
import * as touch from 'touch';
import {askIgnoreFiles, askRepoDetails} from './inquirer.js';
import {getInstance} from './github.js';

import gitP from 'simple-git/promise.js';
const git = gitP();

const Spinner = CLUI.Spinner;

export const createRemoteRepo = async () => {
    const githubOctokit = getInstance();
    const userAnswers = await askRepoDetails();

    const data = {
        name: userAnswers.repoName,
        description: userAnswers.description,
        private: (userAnswers.visibility === 'private')
    };

    const status = new Spinner('Creating remote repository...');
    status.start();

    try {
        const response = await githubOctokit.repos.createForAuthenticatedUser(data);
        return response.data.ssh_url;
    } finally {
        status.stop();
    }
};


export const createGitignore = async () => {
    const localFilesList = _.without(fs.readdirSync('.'), '.git', '.gitignore');

    if (localFilesList.length) {
        const answers = await askIgnoreFiles(localFilesList);

        if (answers.ignore.length) {
            fs.writeFileSync('.gitignore', answers.ignore.join('\n'));
        } else {
            touch('.gitignore');
        }
    } else {
        touch('.gitignore');
    }
};

export const setupRepo = async (url) => {
    const status = new Spinner('Initializing local repository and pushing to remote...');
    status.start();

    try {
        await git.init();
        await git.add('.gitignore');
        await git.add('./*');

        await git.commit('Initial commit');
        await git.addRemote('origin', url);
        await git.push('origin', 'master');
    } finally {
        status.stop();
    }
};
