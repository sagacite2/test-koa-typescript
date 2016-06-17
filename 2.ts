import * as Koa from 'koa';
import * as supertest from 'supertest';

const app = new Koa();

//最佳实践，中间件应接受可选参数options，如下面logger中的format参数

function logger(format: String = '') {//最佳实践：中间件最好有名字（不用匿名函数）
    format = format || ':method | :url';

    return async function (ctx: Koa.Context, next: Function) {
        const str = format
            .replace(':method', ctx.method)
            .replace(':url', ctx.url);
        if (ctx.body) {
            ctx.body += ' ' + str;
        } else {
            ctx.body = str;
        }
        await next();
    };
}

app.use(logger(':method & :url'));

app.listen(3000);

supertest('http://localhost:3000')
    .get('/test')
    .expect(200)
    .expect('GET & /test')
    .end((err, res) => {
        if (err) {
            throw err;
        } else {
            console.log('测试通过！');
        }
    });