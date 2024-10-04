`ally-blizzard` is a Blizzard/Battle.net driver for [AdonisJS Ally](https://docs.adonisjs.com/guides/social-auth).

## Getting Started

This package is available in the npm registry.

```bash
npm install --save ally-blizzard
```

Next, configure the package by running the following command.

```bash
node ace configure ally-blizzard
```

Then register the service inside the configuration file `config/ally.ts`.

```ts
// config/ally.ts
import { defineConfig } from '@adonisjs/ally'
import { blizzard } from 'ally-blizzard'
import env from '#start/env'

const allyConfig = defineConfig({
  blizzard: blizzard({
    clientId: env.get('BLIZZARD_CLIENT_ID'),
    clientSecret: env.get('BLIZZARD_CLIENT_SECRET'),
    callbackUrl: env.get('BLIZZARD_CALLBACK_URL'),
  }),
})
```

## Scopes 

The Blizzard driver exposes the following scopes : 

- `wow.profile`
- `sc2.profile`
- `d3.profile`
- `openid`

You can configure the scopes by setting the `scopes` property inside the configuration file `config/ally.ts`.
The default scope is `openid`.
More infos can be found in the [official documentation](https://develop.battle.net/documentation/guides/using-oauth).