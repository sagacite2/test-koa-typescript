import * as Koa from 'koa';
import * as supertest from 'supertest';

const app = new Koa();

//注意输出的执行次序
app.use(async (ctx, next) => {
    const start = new Date();
    await next();
    const ms = (new Date()).getMilliseconds() - start.getMilliseconds();
    console.log('3. got ' + ms + 'ms');
    ctx.set('X-Reponse-Time', ms + 'ms');
});

app.use(async (ctx, next) => {
    await next();
    console.log('2. got ' + ctx.method + ', ' + ctx.originalUrl + ', ' + ctx.status)
})

app.use(async (ctx, next) => {
    await next();
    if (!ctx.body) {
        return;
    }
    console.log('1, got ' + ctx.body.length);
    ctx.set('Content-Length', ctx.body.length);

})

app.use(async (ctx, next) => {
    await next();
    if (ctx.path !== '/') {
        return;
    }
    ctx.body = 'Hello World';
    console.log('0. start ');
});

app.listen(3000);


supertest('http://localhost:3000')
    .get('/')
    .expect('Content-Length', /\d+/)
    .expect(200)
    .expect('Hello World')
    .end((err, res) => {
        if (err) {
            throw err;
        } else {
            console.log('测试通过！');
        }
    });