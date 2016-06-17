import * as Koa from 'koa';
import * as supertest from 'supertest';
const fs = require('fs-promise');

const app = new Koa();

app.use(async function (ctx, next) {
    const paths = await fs.readdir('docs');
    const files = await Promise.all(paths.map((path: String) => fs.readFile(`docs/${path}`, 'utf8')));
//上面代码演示了先后执行和同时执行的写法。
//先获得docs下面的所有文件的文件名，才能进一步读取文件内容，所以必须等fs.readdir('docs')返回结果才能走下一步，因而分开了两个await
//读取文件内容，则可以同时进行，不需要分先后（如果文件太多，为了性能着想其实还是要分先后），因此使用Promise.All来并行读取。
    ctx.type = 'markdown';
    ctx.body = files.join('');
});

app.listen(3000);


supertest('http://localhost:3000')
    .get('/')
    .expect(200)
    .expect(/111222/)
    .end((err, res) => {
        if (err) {
            throw err;
        } else {
            console.log('测试通过！');
        }
    });
