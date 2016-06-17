'use strict';
import * as Koa from 'koa';
const router = require('koa-route');//与文章https://cnodejs.org/topic/56a46ec8073124894b190aa4 有所不同，这里使用了模块koa-route

class Cover {
    //__DecoratedRouters是个Map实例，存储的是装饰器所定义的路由
    static __DecoratedRouters: Map<{ target: any, method: string, path: string }, Function | Function[]> = new Map()
    private router: any
    private app: Koa

    constructor() {
        this.app = new Koa()
        this.router = router
        this.app.on('error', (err: any) => {
            if (err.status && err.status < 500) return
            console.error(err)
        })
    }

    //这个方法在app.ts里用到，执行最后的注册工作（遍历缓存里的所有定义）
    registerRouters() {
        for (let [config, controller] of Cover.__DecoratedRouters) {
            let controllers = Array.isArray(controller) ? controller : [controller]
            controllers.forEach((controller) => {
                this.app.use(this.router[config.method](config.path, controller));
            });
        }
    }

    listen(port: number) {
        this.app.listen(port);
    }
}

export default Cover;