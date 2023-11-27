# Welcome to Remix!

![Main Workflow](https://github.com/IleelI/remix-standard/actions/workflows/deploy.yml/badge.svg)
[![License: MIT](https://img.shields.io/badge/license-MIT-blue)](https://opensource.org/licenses/MIT)

## Overview

**Well, hello there! 👋**

Welcome to Remix Standard! This repository contains starter template to help you start journey with Remix.

Template contains:

- [Remix](https://remix.run/)
- [Prisma ORM](https://www.prisma.io/docs/getting-started)
- [TailwindCSS](https://tailwindcss.com/)
- [Vitest](https://vitest.dev/)
- [RTL (React Testing Library)](https://testing-library.com/)

## Table of Contents

- [Installation](#installation)
- [Usage](#usage)
- [Testing](#testing)
- [Prodcution](#production)

## Installation

To use Remix Standard, you need to have Node.js (version 18 or higher) and PNPM installed on your machine. Follow the steps below to get started:

1. **Install Node.js:**

   If you don't have Node.js installed, download and install it from the [official Node.js website](https://nodejs.org/). Or even better use [NVM (Node Version Manager)](https://github.com/nvm-bash/nvm)

2. (Optional) **Install PNPM:**
   Package manager is purly optional choice, but I recommend PNPM as it gives you speed and great UX while developing your next great application.

   ```bash
   $ npm install -g pnpm
   ```

3. Clone the Repository

```bash
  git clone https://github.com/IleelI/remix-standard.git
  cd remix-standard
```

4. Install Dependencies

```bash
  pnpm install
```

5. Initialize Prisma

```bash
  pnpm prisma.setup
```

6. Run the Project

```bash
pnpm dev
```

## Usage

- To run application, type in your terminal:

  ```bash
  pnpm dev
  ```

- To run prisma studio, type in your terminal:

  ```bash
  pnpm prisma.studio
  ```

- To seed local database, type in your terminal:

  ```bash
  pnpm prisma.seed
  ```

## Testing

- To run tests in console, type in your terminal:

  ```bash
  pnpm test
  ```

- To run tests in browser, type in your terminal:

  ```bash
  pnpm test.ui
  ```

- To run tests in console only once, type in your terminal:

  ```bash
  pnpm test.single
  ```

- To run test coverage, type in your terminal:

  ```bash
  pnpm test.coverage
  ```

## Production

- To build application, type in your terminal:

  ```bash
  pnpm build
  ```

- To serve already built application, type in your terminal:

  ```bash
  pnpm start
  ```
