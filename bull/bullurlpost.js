import Queue from "bull";
import schematiktoksource from "../models/schematiktoksource.js";


const tiktoksource = await schematiktoksource.find({}).select('-_id')
const queueLinkPost = new Queue('queueLinkPost','redis://127.0.0.1:6379')
const urlVdideo = [
  
    "https://www.tiktok.com/@comehomevietnam",
    "https://www.tiktok.com/@viechannel.music",
    "https://www.tiktok.com/@thefacevietnamofficial",
    "https://www.tiktok.com/@vietnamidol2023",
    "https://www.tiktok.com/@thenewmentorofficial",
    "https://www.tiktok.com/@thenewmenly",
    "https://www.tiktok.com/@vietnamidol2023",
    "https://www.tiktok.com/@hanhtrinhrucroofficial",
        "https://www.tiktok.com/@shopee_vn",
        "https://www.tiktok.com/@paulaschoice.vn",
        "https://www.tiktok.com/@seriinreview",
        "https://www.tiktok.com/@banker.vn",
        "https://www.tiktok.com/@homecreditvn",
    "https://www.tiktok.com/@halinhofficial",
     
    "https://www.tiktok.com/@extrim.vn",
    "https://www.tiktok.com/@chmarkets_vietnam",
    "https://www.tiktok.com/@lpltrade",
    "https://www.tiktok.com/@amtradexvn",
    "https://www.tiktok.com/@racfxvietnam?lang=en",
    "https://www.tiktok.com/@dexinvesting",
    "https://www.tiktok.com/@neotrades_vietnam",
    "https://www.tiktok.com/@langnhincuocsong.new",
"https://www.tiktok.com/@vivumuasam",
"https://www.tiktok.com/@shopee_vn",
"https://www.tiktok.com/@seriinreview",
"https://www.tiktok.com/@lam_tam_than",
"https://www.tiktok.com/@chatxam",
"https://www.tiktok.com/@autopro.hongheard",
"https://www.tiktok.com/@pingpongpingponggo",
"https://www.tiktok.com/@caubedibitishunter",
"https://www.tiktok.com/@giaohangnhanh_official",
"https://www.tiktok.com/@giaohangtietkiem",
"https://www.tiktok.com/@jntexpressvn",
"https://www.tiktok.com/@bestexpress_vietnam",
"https://www.tiktok.com/@viettelpost.official",
"https://www.tiktok.com/@bdvn.vietnampost",
"https://www.tiktok.com/@halinhofficial?lang=vi-VN",
"https://www.tiktok.com/@locashopvn",
"https://www.tiktok.com/@dautucunglocamos",
"https://www.tiktok.com/@joinlocamos",
"https://www.tiktok.com/@c2vietnam.official",
"https://www.tiktok.com/@cafekinhte2023",
"https://www.tiktok.com/@cafebiz.official",
"https://www.tiktok.com/@cafetaichinh2023",
"https://www.tiktok.com/@hoanmydongnai",
"https://www.tiktok.com/@bobbyvietnam.official",
"https://www.tiktok.com/@bobbyvn.official",
"https://www.tiktok.com/@moony.vietnam",
"https://www.tiktok.com/@alphatradinghubvn?lang=vi-VN",
"https://www.tiktok.com/@btmarketsvn?lang=vi-VN",
"https://www.tiktok.com/@londonexvietnam",

"https://www.tiktok.com/@viechannel.music",
"https://www.tiktok.com/@vieon.show",
"https://www.tiktok.com/@vieon.official",
"https://www.tiktok.com/@house.n.home",
"https://www.tiktok.com/@kenh14official",
"https://www.tiktok.com/@kenh14disoisaodi?lang=en",
"https://www.tiktok.com/@afamilyshowbiz?lang=en",
"https://www.tiktok.com/@afamilyngaylucnay?lang=en",
"https://www.tiktok.com/@sohahome",
"https://www.tiktok.com/@cafef_official",
"https://www.tiktok.com/@cafebiz.official",
"https://www.tiktok.com/@gamek.vn",
"https://www.tiktok.com/@genk.vn",
"https://www.tiktok.com/@kinglive.vn",
"https://www.tiktok.com/@vanlawelaxhai",
"https://www.tiktok.com/@mutex_official",
"https://www.tiktok.com/@happynestvn",
//16/09 dung
"https://www.tiktok.com/@vietnamidol2023",
    ]
    for(let i=0;i<urlVdideo.length;i++){
        queueLinkPost.add({authorUrl:`${urlVdideo[i]}`})

}
console.log(urlVdideo.length)
// tiktoksource.map(x=>{
//         console.log(x)
//         queueLinkPost.add(x)
//     })


// await queueLinkPost.obliterate({ force: true });
