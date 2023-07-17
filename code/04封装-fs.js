function mineReadFile(path){
    return new Promise((resolve, reject)=>{
        require('fs').readFile(path, (err, data)=>{
            if(err) reject(err)
            else resolve(data)
        })
    })
}

mineReadFile('../resource/test.txt')
.then(value =>{
    console.log(value.toString())
}, reason=>{
    console.log(reason.toString())
})