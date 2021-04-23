import inquirer from 'inquirer'; // creates interactive command-line user interface

import {getCurrentDirectoryBase} from './files.js';

export const askGithubCredentials = () => {
    const questions = [
        {
            name: 'username',
            type: 'input',
            message: 'Enter your GitHub username or e-mail address:',
            validate: function (value) {
                if (value.length) {
                    return true;
                } else {
                    return 'Please enter your username or e-mail address.';
                }
            }
        },
        {
            name: 'password',
            type: 'password',
            message: 'Enter your password:',
            validate: function (value) {
                if (value.length) {
                    return true;
                } else {
                    return 'Please enter your password.';
                }
            }
        }
    ];

    return inquirer.prompt(questions);
};

export const askGithubToken = () => {
    const question = {
        name: 'token',
        type: 'input',
        message: 'Enter your GitHub Personal Access token:',
        validate: function (value) {
            if (value.length) {
                return true;
            } else {
                return 'Please enter your valid Personal Access token.';
            }
        }
    };

    return inquirer.prompt(question);
};

export const askRepoDetails = () => {

    const questions = [
        {
            type: 'input',
            name: 'repoName',
            message: 'Enter a name for the repository:',
            default: process.argv.slice(2)[0] || getCurrentDirectoryBase(),
            validate: function (value) {
                if (value.length) {
                    return true;
                } else {
                    return 'Please enter a name for the repository.';
                }
            }
        },
        {
            type: 'input',
            name: 'description',
            default: process.argv.slice(2)[1] || null,
            message: 'Optionally enter a description of the repository:'
        },
        {
            type: 'list',
            name: 'visibility',
            message: 'Public or private:',
            choices: ['public', 'private'],
            default: 'public'
        }
    ];
    return inquirer.prompt(questions);
};

export const askIgnoreFiles = (fileList) => {
    const questions = [
        {
            type: 'checkbox',
            name: 'ignore',
            message: 'Select the files and/or folders you wish to ignore:',
            choices: fileList,
            default: ['node_modules', 'bower_components']
        }
    ];
    return inquirer.prompt(questions);
};
