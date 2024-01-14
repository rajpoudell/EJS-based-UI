const shortid = require('shortid');
const URL = require("../model/url")
async function generateNewShortURL(req,res){
    const body = req.body;
    if(!body.url) return res.status(400).json({error:'Url is required...'})


    const shortId = shortid(8); //=> "3Ny5WaZT-R"
    await URL.create({
        shortId:shortId ,//(nonoId),
        redirectURL:body.url,
        visitHistory:[],

    })
    return res.render('home',{
        id:shortId
    })

}


module.exports = {
    generateNewShortURL,
}