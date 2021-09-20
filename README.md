<h2 align="center">
    npm-template
</h2>

<p align="center">
  <a href="https://badge.fury.io/js/sso-oauth2-server.svg"><img src="https://badge.fury.io/js/sso-oauth2-server.svg" alt="npm package" /></a>
  <a href="https://img.shields.io/github/license/FireboltCasters/sso-oauth2-server"><img src="https://img.shields.io/github/license/FireboltCasters/sso-oauth2-server" alt="MIT" /></a>
  <a href="https://img.shields.io/github/last-commit/FireboltCasters/sso-oauth2-server?logo=git"><img src="https://img.shields.io/github/last-commit/FireboltCasters/sso-oauth2-server?logo=git" alt="last commit" /></a>
  <a href="https://www.npmjs.com/package/sso-oauth2-server"><img src="https://img.shields.io/npm/dm/sso-oauth2-server.svg" alt="downloads week" /></a>
  <a href="https://www.npmjs.com/package/sso-oauth2-server"><img src="https://img.shields.io/npm/dt/sso-oauth2-server.svg" alt="downloads total" /></a>
  <a href="https://github.com/FireboltCasters/sso-oauth2-server"><img src="https://shields.io/github/languages/code-size/FireboltCasters/sso-oauth2-server" alt="size" /></a>
  <a href="https://david-dm.org/FireboltCasters/sso-oauth2-server"><img src="https://david-dm.org/FireboltCasters/sso-oauth2-server/status.svg" alt="dependencies" /></a>
  <a href="https://app.fossa.com/projects/git%2Bgithub.com%2FFireboltCasters%2Fsso-oauth2-server?ref=badge_shield" alt="FOSSA Status"><img src="https://app.fossa.com/api/projects/git%2Bgithub.com%2FFireboltCasters%2Fsso-oauth2-server.svg?type=shield"/></a>
  <a href="https://github.com/google/gts" alt="Google TypeScript Style"><img src="https://img.shields.io/badge/code%20style-google-blueviolet.svg"/></a>
  <a href="https://shields.io/" alt="Google TypeScript Style"><img src="https://img.shields.io/badge/uses-TypeScript-blue.svg"/></a>
  <a href="https://github.com/marketplace/actions/lint-action"><img src="https://img.shields.io/badge/uses-Lint%20Action-blue.svg"/></a>
</p>

<p align="center">
  <a href="https://github.com/FireboltCasters/sso-oauth2-server/actions/workflows/npmPublish.yml"><img src="https://github.com/FireboltCasters/sso-oauth2-server/actions/workflows/npmPublish.yml/badge.svg" alt="Npm publish" /></a>
  <a href="https://github.com/FireboltCasters/sso-oauth2-server/actions/workflows/linter.yml"><img src="https://github.com/FireboltCasters/sso-oauth2-server/actions/workflows/linter.yml/badge.svg" alt="Build status" /></a>
  <a href="https://sonarcloud.io/dashboard?id=FireboltCasters_sso-oauth2-server"><img src="https://sonarcloud.io/api/project_badges/measure?project=FireboltCasters_sso-oauth2-server&metric=alert_status" alt="Quality Gate" /></a>
  <a href="https://sonarcloud.io/dashboard?id=FireboltCasters_sso-oauth2-server"><img src="https://sonarcloud.io/api/project_badges/measure?project=FireboltCasters_sso-oauth2-server&metric=bugs" alt="Bugs" /></a>
  <a href="https://sonarcloud.io/dashboard?id=FireboltCasters_sso-oauth2-server"><img src="https://sonarcloud.io/api/project_badges/measure?project=FireboltCasters_sso-oauth2-server&metric=coverage" alt="Coverage" /></a>
  <a href="https://sonarcloud.io/dashboard?id=FireboltCasters_sso-oauth2-server"><img src="https://sonarcloud.io/api/project_badges/measure?project=FireboltCasters_sso-oauth2-server&metric=code_smells" alt="Code Smells" /></a>
  <a href="https://sonarcloud.io/dashboard?id=FireboltCasters_sso-oauth2-server"><img src="https://sonarcloud.io/api/project_badges/measure?project=FireboltCasters_sso-oauth2-server&metric=duplicated_lines_density" alt="Duplicated Lines (%)" /></a>
  <a href="https://sonarcloud.io/dashboard?id=FireboltCasters_sso-oauth2-server"><img src="https://sonarcloud.io/api/project_badges/measure?project=FireboltCasters_sso-oauth2-server&metric=sqale_rating" alt="Maintainability Rating" /></a>
  <a href="https://sonarcloud.io/dashboard?id=FireboltCasters_sso-oauth2-server"><img src="https://sonarcloud.io/api/project_badges/measure?project=FireboltCasters_sso-oauth2-server&metric=reliability_rating" alt="Reliability Rating" /></a>
  <a href="https://sonarcloud.io/dashboard?id=FireboltCasters_sso-oauth2-server"><img src="https://sonarcloud.io/api/project_badges/measure?project=FireboltCasters_sso-oauth2-server&metric=security_rating" alt="Security Rating" /></a>
  <a href="https://sonarcloud.io/dashboard?id=FireboltCasters_sso-oauth2-server"><img src="https://sonarcloud.io/api/project_badges/measure?project=FireboltCasters_sso-oauth2-server&metric=sqale_index" alt="Technical Debt" /></a>
  <a href="https://sonarcloud.io/dashboard?id=FireboltCasters_sso-oauth2-server"><img src="https://sonarcloud.io/api/project_badges/measure?project=FireboltCasters_sso-oauth2-server&metric=vulnerabilities" alt="Vulnerabilities" /></a>
</p>

<p align="center">
    npm-template
</p>

## About

A simple server package for npm based on https://github.com/ankur-anand/simple-sso

## Usage

index.js

```js
import SsoAuth2Server from '../SsoAuth2Server';
import Logger from '../Logger';
import {Connector, UrlHelper} from 'studip-api';

const STUDIP_AUTH_METHOD = async (body, client_id, scope, query) => {
  Logger.log('Authentification: start');
  const username = body.username;
  const password = body.password;
  //auth or throw error
  return user;
};

const requiredLoginParams = {
  username: 'string',
  password: 'password',
};

const port = 3010;
const route = '/studip';
const sessionSecret = 'keyboard cat';
const jwtSecret = 'MySuperSecret';
let ssoServer = new SsoAuth2Server(
  port,
  route,
  sessionSecret,
  jwtSecret,
  STUDIP_AUTH_METHOD,
  requiredLoginParams
);
ssoServer.start();
```

## Contributors

The FireboltCasters

<a href="https://github.com/FireboltCasters/sso-oauth2-server"><img src="https://contrib.rocks/image?repo=FireboltCasters/sso-oauth2-server" alt="Contributors" /></a>
