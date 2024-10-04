/*
|--------------------------------------------------------------------------
| Ally Oauth driver
|--------------------------------------------------------------------------
|
| Make sure you through the code and comments properly and make necessary
| changes as per the requirements of your implementation.
|
*/

/**
|--------------------------------------------------------------------------
 *  Search keyword "BlizzardDriver" and replace it with a meaningful name
|--------------------------------------------------------------------------
 */

import { Oauth2Driver, RedirectRequest } from '@adonisjs/ally'
import type { HttpContext } from '@adonisjs/core/http'
import type {
  AllyDriverContract,
  AllyUserContract,
  ApiRequestContract,
  LiteralStringUnion,
} from '@adonisjs/ally/types'

export type BlizzardDriverAccessToken = {
  token: string
  type: 'bearer'
}

export type BlizzardDriverScopes = 'wow.profile' | 'sc2.profile' | 'd3.profile' | 'openid'

export type BlizzardDriverConfig = {
  clientId: string
  clientSecret: string
  callbackUrl: string
  authorizeUrl?: string
  accessTokenUrl?: string
  userInfoUrl?: string
  scopes?: LiteralStringUnion<BlizzardDriverScopes>[]
}

export class BlizzardDriver
  extends Oauth2Driver<BlizzardDriverAccessToken, BlizzardDriverScopes>
  implements AllyDriverContract<BlizzardDriverAccessToken, BlizzardDriverScopes>
{
  protected authorizeUrl = 'https://oauth.battle.net/authorize'
  protected accessTokenUrl = 'https://oauth.battle.net/token'
  protected userInfoUrl = 'https://oauth.battle.net/oauth/userinfo'
  protected codeParamName = 'code'
  protected errorParamName = 'error'
  protected stateCookieName = 'blizzard_oauth_state'
  protected stateParamName = 'state'
  protected scopeParamName = 'scope'
  protected scopesSeparator = ' '

  constructor(
    ctx: HttpContext,
    public config: BlizzardDriverConfig
  ) {
    super(ctx, config)

    this.loadState()
  }

  protected configureRedirectRequest(request: RedirectRequest<BlizzardDriverScopes>) {
    request.scopes(this.config.scopes || ['wow.profile'])

    request.param('response_type', 'code')
    request.param('grant_type', 'authorization_code')
  }

  // protected configureRedirectRequest(request: RedirectRequest<BlizzardDriverScopes>) {}

  // protected configureAccessTokenRequest(request: ApiRequest) {}

  accessDenied() {
    return this.ctx.request.input('error') === 'user_denied'
  }

  async user(
    callback?: (request: ApiRequestContract) => void
  ): Promise<AllyUserContract<BlizzardDriverAccessToken>> {
    const accessToken = await this.accessToken(callback)
    const user = await this.getUserInfo(accessToken.token, callback)

    return {
      ...user,
      token: accessToken,
    }
  }

  async userFromToken(
    accessToken: string,
    callback?: (request: ApiRequestContract) => void
  ): Promise<AllyUserContract<{ token: string; type: 'bearer' }>> {
    const user = await this.getUserInfo(accessToken, callback)

    return {
      ...user,
      token: {
        token: accessToken,
        type: 'bearer',
      },
    }
  }

  protected getAuthenticatedRequest(token: string) {
    const request = this.httpClient(this.config.userInfoUrl ?? this.userInfoUrl)

    request.header('Authorization', `Bearer ${token}`)
    request.header('Accept', 'application/json')
    request.param('format', 'json')
    request.parseAs('json')

    return request
  }

  protected async getUserInfo(token: string, callback?: (request: ApiRequestContract) => void) {
    const request = this.getAuthenticatedRequest(token)

    if (typeof callback === 'function') {
      callback(request)
    }

    const body = await request.get()

    return body
  }
}

/**
 * The factory function to reference the driver implementation
 * inside the "config/ally.ts" file.
 */
export function BlizzardDriverService(
  config: BlizzardDriverConfig
): (ctx: HttpContext) => BlizzardDriver {
  return (ctx) => new BlizzardDriver(ctx, config)
}
