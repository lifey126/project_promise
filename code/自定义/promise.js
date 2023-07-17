class Promis{
    //构造方法
    constructor(executor){
        //添加属性
        this.PromiseState = 'pending';
        this.PromiseResult = null;
        //声明属性
        this.callbacks = [];
        //保存实例对象的this的值
        const self = this;
        //resolve函数
        function resolve(data){
            //判断状态
            if(self.PromiseState !== 'pending') return;
            //1.修改对象状态（PromiseState）
            self.PromiseState = 'fullfilled';
            //2.设置对象结果值（PromiseResult）
            self.PromiseResult = data;
            //调用成功的回调函数
            setTimeout(()=>{
                self.callbacks.forEach(item=>{
                    item.onResolved(data);
                })
            })
        }
        //rejecte函数
        function reject(data){
            //判断状态
            if(self.PromiseState !== 'pending') return;
            //1.修改对象状态（PromiseState）
            self.PromiseState = 'rejected';
            //2.设置对象结果值（PromiseResult）
            self.PromiseResult = data;
            //执行失败的回调函数
            setTimeout(()=>{
                self.callbacks.forEach(item=>{
                    item.onRejected(data);
                })
            })
        }
        try{
            //同步调用【执行器函数】
            executor(resolve, reject)
        }catch(e){
            //修改对象状态为失败
            reject(e);
        }
    }

    //then方法封装
    then(onResolved, onRejected){
        const self = this
        //判断回调函数的参数
        if(typeof onRejected !== 'function'){
            onRejected = reason => {
                throw reason
            }
        }
        if(typeof onResolved !== 'function'){
            onResolved = value => {
                return value
            }
        }
        return new Promise((resolve, reject)=>{
            //封装函数
            function callback(type){
                try{
                    //获取回调函数的执行结果
                    let result = type(self.PromiseResult);
                    //判断
                    if(result instanceof Promise){
                        //如果是Promise类型的对象
                        result.then(v=>{
                            resolve(v)
                        }, r=>{
                            reject(r)
                        })
                    }else{
                        //结果的状态为【成功】
                        resolve(result)
                    }
                }catch(e){
                    reject(e)
                }
            }
            if(this.PromiseState === 'fullfilled'){
                setTimeout(()=>{
                    callback(onResolved)
                })           
            }
            if(this.PromiseState === 'rejected'){
                setTimeout(()=>{
                    callback(onRejected)
                })              
            }
            //判断pending状态
            if(this.PromiseState === 'pending'){
                //保存回调函数
                this.callbacks.push({
                    onResolved: function(){
                        callback(onResolved)
                    },
                    onRejected:function(){
                        callback(onRejected) 
                    }
                })
            }
        })
    }

    //catch方法封装
    catch(onRejected){
        return this.then(undefined, onRejected)
    }

    //resolve方法封装
    static resolve(value){
        //返回Promise对象
        return new Promise((resolve, reject)=>{
            if(value instanceof Promise){
                value.then(v=>{
                    resolve(v)
                }, r=>{
                    reject(r)
                })
            }else{
                resolve(value)
            }
        })
    }

    //reject方法封装
    static reject(reason){
        return new Promise((resolve, reject)=>{
            reject(reason)
        })
    }

    //all方法封装
    static all(promises){
        return new Promise((resolve, reject)=>{
            //声明变量
            let count = 0
            let arr = []
            for(let i = 0; i < promises.length; i++){
                promises[i].then(v=>{
                    //得知对象状态成功
                    //每个promise对象都成功
                    count++;
                    //将当前promise对象成功的结果，存入到数组中
                    arr[i] = v;
                    //判断
                    if(count === promises.length){
                        //修改状态
                        resolve(arr)
                    }
                }, r=>{
                    reject(r)
                })
            }
        })
    }

    //race方法封装
    static race(promises){
        return new Promise((resolve, reject)=>{
            for(let i = 0; i < promises.length; i++){
                promises[i].then(v=>{
                    //修改返回对象的状态为【成功】
                    resolve(v)
                }, r=>{
                    //修改返回对象的状态为【失败】
                    reject(r)
                })
            }
        })
    }
}


