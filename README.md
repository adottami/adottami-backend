<h1 align="center">Adottami Backend</h1>

- [Technologies](#technologies)
- [Installation](#installation)
- [Development guide](#development-guide)
  - [Tests](#tests)
    - [Unit and integration tests](#unit-and-integration-tests)

## Technologies

- [Node.js](https://nodejs.org/), [Express](https://expressjs.com/) and [Typescript](https://www.typescriptlang.org/)
- [Prisma](https://www.prisma.io/) and [PostgreSQL](https://www.postgresql.org/)
- Linting with [ESLint](https://eslint.org/)
- Formatting with [Prettier](https://prettier.io/)
- Pre-commit and pre-push Git hooks with [Husky](https://github.com/typicode/husky)
- Testing with [Jest](https://jestjs.io/)

## Installation

This project runs on [Node.js v16](https://nodejs.org/) and uses [Yarn v1](https://yarnpkg.com/) as dependency manager.

1. Clone the repository and install dependencies:

   ```bash
   $ git clone git@github.com:es-2021-2-grupo-2/adottami-backend.git
   $ cd adottami-backend
   $ yarn install
   ```

2. To run the project in development mode, start a development database:

   ```bash
   $ yarn db:up
   ```

3. Apply the current schema (if the database is not up-to-date):

   ```bash
   $ yarn db:migrate
   ```

4. Start the server in development mode:

   ```bash
   $ yarn dev
   ```

## Development guide

Learn more about the contributing conventions and guidelines at [CONTRIBUTING.md](./CONTRIBUTING.md).

### Tests

The project uses [Jest](https://jestjs.io/) for unit and integration tests.

#### Unit and integration tests

Once you have installed the project dependencies as explained at [Installation](./README.md#installation), run the following command to run the project's unit and integration tests:

```bash
$ yarn test
```

To learn more about the CLI options supported by Jest, access the [documentation](https://jestjs.io/docs/cli).
