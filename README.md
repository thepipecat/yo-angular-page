# Yeoman Angular.io pages generator

## Getting Started

**Steps:**
1. Install Yeoman if not had yet: `npm i -g yo`
2. Install the generator: `npm i -g generator-angular-page`

**Use:**

`yo angular-page`

## Features

• Generates Angular.io new pages with routing support.

• Default prefixes for better directory organization.

• Uses defaults from the Angular.io config file (`.angular-cli.json`) in the root directory.

## Options

*--prefix `value`*  - Set the page selector prefix. Default: `page-`

*--no-routing* - The page will not have a route receiver.

*--no-sass*    - Uses the `.css` as default StyleSheet file.

*--no-spec*    - Do no create Angular component base test `.spec.ts` file.

*--inline*     - Do not create HTML template and StyleSheet files.

**Warning:** `.angular-cli.json` *defaults* will have precedence.
