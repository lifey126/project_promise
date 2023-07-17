const fs = require('fs')

let p = new Promise((resolve, reject)=>{
    fs.readFile('../resource/test.txt', (err, data)=>{
        if(err)  reject(err)
        else resolve(data)
    })
})

p.then(value=>{
    console.log(value.toString())
}, reason=>{
    console.log(reason.toString())
})