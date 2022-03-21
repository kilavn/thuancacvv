const express = require('express')
const axios = require("axios")
const bodyPas = require("body-parser")
const fs = require("fs")
const path = require("path")
var os = require("os");
const account = require("./schems/account.js")
const mongo = require("./config/mongo")
const app = express()

app.use(bodyPas.urlencoded({extended : true}))
app.use(bodyPas.json())
app.set('view engine', 'ejs')
app.use(express.static("views"))

function findher(headers) {
    var hwidTypes = ["user-agent"]
    var count = 0
    var hwid = null
    hwidTypes.forEach(header => {
        if (headers[header]) {
          count = count + 1
          hwid = headers[header]
        }
    })
    if (count > 1) {
        hwid = null
    }
    return hwid
}

app.post('/update', async (req, res) => {
    const { idgame, ingame, namegame, Level, Beli, Fragment, KhhoDevilFruit, KhhoWeapon } = req.body
    const cc = []
    try {
        await mongo().then((mongoose) => {
            try {
                account.find({Name: ingame}, (a, b) => {
                    if(b.length) {
                        b[0].NameGame = namegame
                        b[0].Items = [{
                            Level: Level,
                            Beli: Beli,
                            Fragment: Fragment,
                            KhoDF: KhhoDevilFruit,
                            KhoWP: KhhoWeapon
                        }]
                        b[0].save()
                        res.send("Success")
                    } else {
                        let accousnt = new account({Name: ingame, UserId: idgame, NameGame: namegame, Items: [{
                            Level: Level,
                            Beli: Beli,
                            Fragment: Fragment,
                            KhoDF: KhhoDevilFruit,
                            KhoWP: KhhoWeapon
                        }]})
                        accousnt.save()
                        res.send("Success")
                    }
                })
            } catch(e) {
                console.log(e)
            }
        })
    } catch(e) {
        console.log(e)
    }
})

app.get('/getstatus', async (req, res) => {
    try {
        await mongo().then( async (mongoose) => {
            account.find({}, async (a, b) => {
                res.send(b)
            })      
        })
    } catch(e) {
        console.log(e)
    }
})

app.post('/delete', async (req, res) => {
    const {Name} = req.body
    try {
        await mongo().then( async (mongoose) => {
            account.findOneAndDelete({Name: Name}, async (a, b) => {
                res.send('cac')
            })
        })
    } catch(e) {
        console.log(e)
    }
})

app.get('/getscript', async (req, res) => {
    res.send('loadstring(game:HttpGet("https://thuan-cac.herokuapp.com/script"))()')
})

app.get('/script', async (req, res) => {
    var header = findher(req.headers)
    var script = fs.readFileSync(path.join(__dirname, `./script.lua`), {encoding: "binary"})

    if(header.search("Roblox/WinInet") != -1) {
        res.send(script)
    } else {
        res.send(script)
    }
})

app.get('/', async (req, res) => {
    try {
        await mongo().then( async (mongoose) => {
            account.find({}, async (a, b) => {
                res.render('index', {
                    data: b,
                })
            })      
        })
    } catch(e) {
        console.log(e)
    }
})

function updatestatus() {
    return new Promise((res, rej) => {
        setTimeout( async () => {
            try{
                await mongo().then( async (mongoose) => {
                    account.find({}, async (a, b) => {
                        b.forEach(e => {
                            axios({
                                method: 'get',
                                url: `https://api.roblox.com/users/${e.UserId}/onlinestatus/`,
                                json: true
                            }).then(function (response) {
                                account.findOneAndUpdate({UserId: e.UserId}, {$set: {Status: response.data.IsOnline}}, (a, b) => {
                                    if(b.length) {
                                        res.send("Success")
                                    }
                                })
                            }).catch(e => {
                                console.log(e)
                            })
                        })
                    })
                })
            }catch(e) {
                console.log(e)
            }
        res()
    }, 10000)
    })
}

(async () => {
    while(true) await updatestatus()
})()

app.listen(process.env.PORT || 80, () => {
    console.log('online')
})
