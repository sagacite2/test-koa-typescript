import * as Koa from 'koa';
import * as supertest from 'supertest';

// Koa application is now a class and requires the new operator.
const app = new Koa();

async function responseTime(ctx: Koa.Context, next: Function) {
  const start = new Date();
  await next();
  const ms = (new Date()).getMilliseconds() - start.getMilliseconds();
  ctx.set('X-Response-Time', `${ms}ms`);
}

app.use(responseTime);

app.listen(3000);


supertest('http://localhost:3000')
  .get('/')
  .expect('X-Response-Time', /\d+ms/)//测试上面代码中ctx.set()是否成功（响应头）
  .expect(404)//因为没有定义任何response，所以肯定404
  .end((err, res) => {
    if (err) {
      throw err;
    } else {
      console.log('测试通过！');
    }
  });