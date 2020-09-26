import { dedupExchange, fetchExchange } from '@urql/core'
import { cacheExchange } from '@urql/exchange-graphcache'
import { LogoutMutation, MeQuery, MeDocument, LoginMutation, RegisterMutation } from '../generated/graphql'
import { betterUpdateQuery } from './betterUpdateQuery'

export function createUrqlClient(ssrExchange: any) {
    return ({
        url: 'http://localhost:4000/graphql',
        fetchOptions: {
            credentials: "include" as const,
        },
        exchanges: [
            dedupExchange,
            cacheExchange({
                updates: {
                    Mutation: {
                        logout: (_result, _args, cache, _info) => {
                            betterUpdateQuery<LogoutMutation, MeQuery>(
                                cache,
                                { query: MeDocument },
                                _result,
                                () => ({
                                    me: null
                                })
                            )
                        },
                        login: (result, _args, cache, _info) => {
                            betterUpdateQuery<LoginMutation, MeQuery>(
                                cache,
                                { query: MeDocument },
                                result,
                                (result, query) => {
                                    if (result.login.errors) {
                                        return query
                                    } else {
                                        return {
                                            me: result.login.user,
                                        }
                                    }
                                }
                            )
                        },
                        register: (result, _args, cache, _info) => {
                            betterUpdateQuery<RegisterMutation, MeQuery>(
                                cache,
                                { query: MeDocument },
                                result,
                                (result, query) => {
                                    if (result.register.errors) {
                                        return query
                                    } else {
                                        return {
                                            me: result.register.user,
                                        }
                                    }
                                }
                            )
                        }
                    }
                }
            }),
            ssrExchange,
            fetchExchange
        ],
    })
}
