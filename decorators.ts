'use strict'
import Cover from './Cover';
import {Context} from 'koa';

//装饰器，注意target[name]指向了所装饰的方法
export function router(config: { path: string, method: string }) {
    return (target: any, name: string, value: PropertyDescriptor) => {
        Cover.__DecoratedRouters.set({
            target: target,
            path: config.path,
            method: config.method
        }, target[name]);
    }
}

export function validateQuery(name: string, type: String) {
    return (target: any, name: string, value: PropertyDescriptor) => {
        if (!Array.isArray(target[name])) target[name] = [target[name]]
        target[name].splice(target[name].length - 1, 0, validate)
    }

    async function validate(ctx: Context, next: Function) {
        if (typeof ctx.query[name] !== type) ctx.throw(400, `${name}'s type should be ${type}'`)
        await next();
    }
}

export function log(target: any, name: string, value: PropertyDescriptor) {
    if (!Array.isArray(target[name])) target[name] = [target[name]]
    target[name].splice(target[name].length - 1, 0, middleware)

    async function middleware(ctx: Context, next: Function) {
        let start = Date.now()
        ctx.state.log = {
            path: ctx.path
        }

        try {
            await next()
        } catch (err) {
            if (err.status && err.status < 500) {
                Object.assign(ctx.state.log, {
                    time: Date.now() - start,
                    status: err.status,
                    message: err.message
                })
                console.log(ctx.state.log)
            }
            throw err
        }

        let onEnd = done.bind(ctx)

        ctx.res.once('finish', onEnd)
        ctx.res.once('close', onEnd)

        function done() {
            ctx.res.removeListener('finish', onEnd)
            ctx.res.removeListener('close', onEnd)

            Object.assign(ctx.state.log, {
                time: Date.now() - start,
                status: ctx.status
            })
            console.log(ctx.state.log)
        }
    }
}
