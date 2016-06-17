import * as Koa from 'koa';
import * as supertest from 'supertest';
const crypto = require('crypto');

const app = new Koa();

app.use(async (ctx: Koa.Context, next: Function) => {
    console.log('请求头 => ctx.headers:\r\n----------begin-------------\r\n' + JSON.stringify(ctx.headers) + '\r\n----------end-------------');
    ctx.method = 'POST';
    console.log('请求方法 => ctx.method:   ' + JSON.stringify(ctx.method));
    console.log('请求 url  =>  ctx.url:   ' + JSON.stringify(ctx.url));
    console.log('返回 req 对象的 Content-Length => ctx.length:   ' + JSON.stringify(ctx.length));
    console.log('请求 pathname => ctx.path:   ' + JSON.stringify(ctx.path));
    ctx.query = { a: 1 };
    console.log('返回经过解析的查询字符串 => ctx.query:   ' + JSON.stringify(ctx.query));
    ctx.querystring = 'a=2';
    console.log('返回 url 中的查询字符串，去除了了头部的 \'?\' => ctx.querystring:   ' + JSON.stringify(ctx.querystring));
    console.log('返回请求主机名，不包含端口 => ctx.host:   ' + JSON.stringify(ctx.host));
    console.log('检查客户端请求的缓存是否是最新。当缓存为最新时，可编写业务逻辑直接返回 304 => ctx.fresh:   ' + JSON.stringify(ctx.fresh));
    console.log('与 req.fresh 返回的结果正好相反 => ctx.stale:   ' + JSON.stringify(ctx.stale));
    console.log('Koa.Request.Socket => ctx.socket:   ' + ctx.socket);
    console.log('返回请求协议名，如 "https" 或者 "http"=> ctx.protocol:   ' + JSON.stringify(ctx.protocol));
    console.log('判断请求协议是否为 HTTPS 的快捷方法，等同于 this.protocol == "https" => ctx.secure:   ' + JSON.stringify(ctx.secure));
    console.log('返回请求IP => ctx.ip:   ' + JSON.stringify(ctx.ip));
    console.log('返回请求IP列表，仅当 app.proxy 设置为 true ，并存在 X-Forwarded-For 列表时，否则返回空数组 => ctx.ips:   ' + JSON.stringify(ctx.ips));
    console.log('返回请求对象中的子域名数组 => ctx.subdomains:   ' + JSON.stringify(ctx.subdomains));
    console.log('返回 req 对象的 Content-Type，不包括 charset 属性 => ctx.type:   ' + JSON.stringify(ctx.type));
    console.log('判断请求对象中 Content-Type 是否为给定 type 的快捷方法，\
    如果不存在 request.body，将返回 undefined，如果没有符合的类型，返回 false，\
    除此之外，返回匹配的类型字符串 => ctx.is():   ' + ctx.is.call(ctx, 'text'));//注：这里输出为null，因为没有请求实体，在请求头中也没有定义Content-Type。
    console.log('判断请求对象中 Accept 是否为给定 type 的快捷方法，当匹配到符合的类型时，\
    返回最匹配的类型，否则返回 false => ctx.accepts():   ' + ctx.accepts.call(ctx, 'text', 'html'));//注：因为typings的定义没有参数，实际上需要传参，所以用call来避开ts的检查
    console.log('判断客户端是否接受给定的编码方式的快捷方法，\
    当有传入参数时，返回最应当返回的一种编码方式  => ctx.acceptsEncodings():   ' + ctx.acceptsEncodings.call(ctx, 'gzip', 'deflate'));
    console.log('  => ctx.acceptsCharsets():   ' + ctx.acceptsCharsets.call(ctx, 'utf-8'));
    console.log('  => ctx.acceptsLanguages():   ' + ctx.acceptsLanguages.call(ctx, 'zh-cn'));

    //Response
    ctx.res.setHeader('hahaha', 'wawawa');
    console.log('ctx.res.getHeader:' + ctx.res.getHeader('Content-Length'));//这时候为undefined，因为响应头在这个时候还没完全生成
    ctx.res.removeHeader('Date');
    console.log('ctx.body: ' + ctx.body);
    ctx.body = 'haha';
    console.log('ctx.body changed: ' + ctx.body);
    console.log('ctx.status: ' + ctx.status);
    ctx.status = 201;
    console.log('ctx.status changed: ' + ctx.status);
    console.log('ctx.length: ' + ctx.length);
    ctx.length = 10;
    console.log('ctx.length changed: ' + ctx.length);
    console.log('ctx.type: ' + ctx.type);//获取返回头中的 Content-Type，不包括 "charset" 等属性。
    ctx.type = 'markdown';//相当于用ctx.res.setHeader修改Content-Type
    console.log('ctx.type changed: ' + ctx.type);
    console.log('ctx.headerSent: ' + ctx.headerSent);//判断一个响应头是否已经发送到客户端，通常用来检测客户端是否收到了错误信息。
    ctx.lastModified = new Date();
    console.log('ctx.lastModified : ' + ctx.lastModified);
    ctx.status = 301;
    if (ctx.path === '/') {
        ctx.redirect('/wawawa', '');//返回一个 302 跳转到给定的 url
    }

    ctx.body = '301';
    ctx.etag = crypto.createHash('md5').update(ctx.body).digest('hex');
    await next();
})



app.listen(3000);