import * as Koa from 'koa';
import * as supertest from 'supertest';

const app = new Koa();


async function random(ctx: Koa.Context, next: Function) {

    if ('/random' == ctx.path) {
        ctx.body = Math.floor(Math.random() * 10);
    } else {
        await next();
    }
};

async function backwards(ctx: Koa.Context, next: Function) {

    if ('/backwards' == ctx.path) {
        ctx.body = 'sdrawkcab';
    } else {
        await next();
    }
}

async function pi(ctx: Koa.Context, next: Function) {

    if ('/pi' == ctx.path) {
        ctx.body = String(Math.PI);
    } else {
        await next();
    }
}

async function noop() { }

//这段代码改写自https://github.com/koajs/compose/blob/master/index.js
//koa-compose模块不能用，所以直接改动其源码。
//因为中间件在call之后返回的是Promise对象，所以还要封装到一个函数里进行await调用，不知道有没有更好的写法
function compose(middleware: Array<(ctx: Koa.Context, next: Function) => any>) {
    return async function (ctx: Koa.Context, next: Function) {
        let promise: Promise<void>;
        if (!next) {
            promise = noop();
        } else {
            promise = next();
        }

        var i = middleware.length;

        while (i--) {
            promise = middleware[i].call(this, ctx, () => promise);
        }

        return await (() => promise)();
    }
}



//把几个中间件打包成一个中间件，注册到app上
const all = compose([random, backwards, pi]);

app.use(all);
//相当于：
// app.use(random);
// app.use(backwards);
// app.use(pi);

app.listen(3000);

supertest('http://localhost:3000')
    .get('/random')
    .expect(200)
    .expect(/\d+/)
    .end((err, res) => {
        if (err) {
            throw err;
        } else {
            console.log('测试通过！');
        }
    });
supertest('http://localhost:3000')
    .get('/backwards')
    .expect(200)
    .expect('sdrawkcab')
    .end((err, res) => {
        if (err) {
            throw err;
        } else {
            console.log('测试通过！');
        }
    });
supertest('http://localhost:3000')
    .get('/pi')
    .expect(200)
    .expect(/3.14159/)
    .end((err, res) => {
        if (err) {
            throw err;
        } else {
            console.log('测试通过！');
        }
    });