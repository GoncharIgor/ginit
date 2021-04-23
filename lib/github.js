import CLUI from 'clui'; // draws command-line tables, gauges and spinners
import Configstore from 'configstore'; // loads and saves config without you having to think about where and how
import {createTokenAuth} from "@octokit/auth-token";
import {Octokit} from '@octokit/rest';

import {askGithubToken} from './inquirer.js';
import pkgJsonFile from '../package.json';

const Spinner = CLUI.Spinner;
const configstore = new Configstore(pkgJsonFile.name);

let octokit;

export const setGithubAuth = (token) => {
    octokit = new Octokit({
        auth: token
    });
};

// function that allows other libs to access octokit (GitHub) functions
export const getInstance = () => {
    return octokit;
};

export const getPersonalAccessToken = async () => {
    const providedToken = await askGithubToken();
    const githubToken = providedToken?.token || 'my_default_GitHub_token';

    const status = new Spinner(`Authenticating you with token "${githubToken}", please wait...`);
    status.start();

    const auth = createTokenAuth(githubToken);

    /*
    const credentials = await askGithubCredentials();

    const auth = createBasicAuth({
        username: credentials.username,
        password: credentials.password,
        async on2Fa() {
            // TBD
        },
        token: {
            scopes: ['user', 'public_repo', 'repo', 'repo:status'], // a list of scopes that this authorization is in
            note: 'ginit, the command-line tool for initalizing Git repos' // a note to remind us what the OAuth token is for
        }
    });

    const res = await auth();
    */

    try {
        const authenticationResult = await auth();

        if (authenticationResult.token) {
            configstore.set('github.token', authenticationResult.token);
            return authenticationResult.token;
        } else {
            throw new Error("GitHub token was not found in the response");
        }
    } finally {
        status.stop();
    }
};

// checks whether we’ve already got an access token
export const getStoredGithubToken = () => {
    return configstore.get('github.token');
};


export const removeStoredGithubToken = () => {
    console.log('github.token was removed from configstore');
    return configstore.delete('github.token');
};
