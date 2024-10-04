import type Configure from '@adonisjs/core/commands/configure'

export async function configure(command: Configure) {
  const codemods = await command.createCodemods()

  await codemods.defineEnvVariables({
    BLIZZARD_CLIENT_ID: '',
    BLIZZARD_CLIENT_SECRET: '',
    BLIZZARD_CALLBACK_URL: '',
  })

  await codemods.defineEnvValidations({
    variables: {
      BLIZZARD_CLIENT_ID: 'Env.schema.string()',
      BLIZZARD_CLIENT_SECRET: 'Env.schema.string()',
      BLIZZARD_CALLBACK_URL: 'Env.schema.string()',
    },
    leadingComment: 'Variables for ally-blizzard',
  })
}
