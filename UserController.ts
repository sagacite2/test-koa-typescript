'use strict'
import {router, log, validateQuery} from './decorators'
import {Context} from 'koa'

export class UserController {
    @router({
        method: 'get',
        path: '/user/login'
    })
    @validateQuery('username', 'string')
    @log
    login(ctx: Context, next: Function) {
        ctx.body = 'login!'
    }

    @router({
        method: 'get',
        path: '/user/logout'
    })
    @log
    logout(ctx: Context, next: Function) {
        ctx.body = 'logout!'
    }
}