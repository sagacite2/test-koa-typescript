async function test(){
    setTimeout(function(){
        console.log('11');
    },500);
}

const a = test.call(null);//call调用返回的是一个promise对象
console.log(a instanceof Promise);

