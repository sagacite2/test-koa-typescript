import * as Koa from 'koa';
import * as supertest from 'supertest';

const app = new Koa();
app.keys = ['xxxx secret name', 'wahaha shalala'];

app.use(async (ctx:Koa.Context,next:Function)=>{
    ctx.cookies.set('name', 'ouyang', { signed: true });
    //最终cookie会成为Cookie:name=ouyang; name.sig=R3BU0AT4-ZDuc6WWi9alA-tDB70
    //貌似并没有加密ouyang这个字符串，那这个签名的用处何在？
    //原来，浏览器得到这个cookie后，会在后面进行http请求时回传给服务器端，那么服务器端就会重新计算一下name=ouyang经过加密后的密文，和浏览器传过来的name.sig=R3BU0AT4-ZDuc6WWi9alA-tDB70比对
    //如果比对没问题，意味着客户端没有篡改cookie，那么就认可 name=ouyang 的合法性。
    await next();
})

app.listen(3000);