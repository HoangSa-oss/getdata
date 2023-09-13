import puppeteer from 'puppeteer';
import domDetailUrl from '../dom/detailurl.json' assert { type: 'json' }
import moment from 'moment';
import Queue from 'bull';
import schemadetailurl from '../models/schemadetailurl.js';
const queueDetailUrlGetCopy = new Queue('queueDetailUrlGetCopy','redis://127.0.0.1:6379')
import cookie from "./cookies.json" assert { type: 'json' }



const  tiktokProfile = async()=>{
    const date = '2023-01-30'
    const dateTimeStamp = moment(date).format('x')
    const browser = await puppeteer.launch({
        headless: false,
        // userDataDir: 'C:\Users\Twice\AppData\Local\Google\Chrome\User Data\Profile 3',
    });
        queueDetailUrlGetCopy.process(4,async (job,done)=>{
                const page = await browser.newPage();
                page.setViewport({width: 1600, height: 1080});
                // await page.setCookie(...cookie)
            try {
                await page.goto(job.data.urlVideo)
                const checkForm = await page.$(domDetailUrl.checkFormUrl.elementCheckFromUrl)
                if(checkForm==null){
                    const vieOrEng = await page.evaluate((domDetailUrl)=>{
                        return document.querySelector(domDetailUrl.checkLanguage.elementLanguage).textContent
                    },domDetailUrl)
                    if(vieOrEng == 'For You'){
                        var domTiktok = domDetailUrl.domCheckFormLinkFalse.english
                    } else{
                        domTiktok = domDetailUrl.domCheckFormLinkFalse.vietnamese
                    }
                    await page.waitForSelector(domTiktok.elementProfile)
                    const detailUrl = await page.evaluate((domTiktok)=>{
                        var totalShares = document.querySelector(domTiktok.elementtotalShares).textContent.trim()
                        if(totalShares == "Share"){
                            totalShares = '0'
                        }
                        return({
                            publishedDate:document.querySelector(domTiktok.elementDate)?.textContent.trim(),
                         
                        })
                    },domTiktok)
                   
                  
                    detailUrl.date = await processTime(detailUrl.date.slice(detailUrl.date.indexOf('·')+2,1000))
                    let interactions = detailUrl.likes+detailUrl.comments+detailUrl.shares
                    await page.evaluate((domTiktok)=>{

                    })
                    const detailUrlInsert = {
                        type:"snsTopic",
                        id : "",
                        siteName:"",
                        url:"",
                        author:"",
                        authorId:"",
                        ...detailUrl,
                        interactions,
                       
                    }
                    
                    const insertDetailUrl = new schemadetailurl(detailUrlInsert)
                    await insertDetailUrl.save()
                }else{
                    const vieOrEng = await page.evaluate((domDetailUrl)=>{
                        return document.querySelector(domDetailUrl.checkLanguage.elementLanguage).textContent
                    },domDetailUrl)
                    if(vieOrEng == 'For You'){
                        var domTiktok = domDetailUrl.domCheckFromLinkTrue.english
                    } else{
                        domTiktok = domDetailUrl.domCheckFromLinkTrue.vietnamese
                    }
                    await page.waitForSelector(domTiktok.elementProfile)
                    const detailUrl = await page.evaluate((domTiktok)=>{
                        // var totalShares = document.querySelector(domTiktok.elementtotalShares).textContent.trim()
                        // if(totalShares == "Share"){
                        //     totalShares = '0'
                        // }
                        return({
                            publishedDate:document.querySelector(domTiktok.elementDate)?.textContent.trim(),
                            // content:document.querySelector(domTiktok.elementContent)?.textContent.trim(),
                            // likes:document.querySelector(domTiktok.elementTotalLikes)?.textContent.trim(),
                            // shares:totalShares,
                            // comments:document.querySelector(domTiktok.elementTotalComments)?.textContent.trim(),
                        })
                    },domTiktok)
                    // detailUrl.likes = processStringToNumber(detailUrl.likes)
                    // detailUrl.comments = processStringToNumber(detailUrl.comments)
                    // detailUrl.shares = processStringToNumber(detailUrl.shares)

                    detailUrl.publishedDate = await processTime(detailUrl.publishedDate)
                    detailUrl.publishedDate = moment(detailUrl.publishedDate).format()
                    console.log(detailUrl.publishedDate)

                    let interactions = detailUrl.likes+detailUrl.comments+detailUrl.shares
                    let url = await page.evaluate((domTiktok)=>{
                        return document.querySelector(domTiktok.elementUrl).getAttribute('href')
                    },domTiktok)
                    const idVideo = url.slice(url.indexOf(/video/)+7,url.indexOf(/video/)+26)
                   
                    // await page.evaluate((domTiktok)=>{
                    //     document.querySelector(domTiktok.elementClickSiteId).click()
                    // },domTiktok)
                    // await page.waitForSelector(domTiktok.elementSiteName)
                    // await page.waitForSelector(domTiktok.elementSiteId)
                    // let siteId = await page.evaluate((domTiktok)=>{
                    //     return document.querySelector(domTiktok.elementSiteId).textContent.trim()
                    // },domTiktok)
                    // siteId = reverse(siteId).slice(0,19)
                    // siteId = reverse(siteId)
                    // let siteName = await page.evaluate((domTiktok)=>{
                    //     return document.querySelector(domTiktok.elementSiteName).textContent.trim()
                    // },domTiktok)
                    const detailUrlInsert = {
                    
                        ...job.data,
                        ...detailUrl,
                    }
                    console.log(parseInt(moment(detailUrl.publishedDate).format('x')))
                    console.log(dateTimeStamp)
                    if(parseInt(moment(detailUrl.publishedDate).format('x'))>=dateTimeStamp){
                        console.log('concac')
                    const insertDetailUrl1 =  new schemadetailurl(detailUrlInsert)
                    await insertDetailUrl1.save()
                    }
                }
            } catch (error) {
                console.log(error)
                try {
                    const contentError = await page.evaluate((domDetailUrl)=>{
                        return document.querySelector(domDetailUrl.domCheckFormLinkFalse.english.elementUrlError)?.textContent
                    },domDetailUrl)
                    if(contentError!="Video currently unavailable"){
                        queueDetailUrlGetCopy.add(job.data)
                    }
                  
                } catch (error) {
                    console.log(error)
                }
               
            }   
            try {
                await page.close()
            } catch(error) {  
                console.log(error)
            } 
            done();   
        })
}
tiktokProfile()  
const processStringToNumber = (String)=>{
switch(true){
    case String.indexOf('M')!=-1:
        return Number(String.slice(0,String.indexOf('M')))*1000000
    case String.indexOf('K')!=-1:
        return Number(String.slice(0,String.indexOf('M')))*1000
    case String.indexOf('B')!=-1:
        return Number(String.slice(0,String.indexOf('B')))*1000000000
    case String.indexOf('M')==-1 && String.indexOf('K')==-1 && String.indexOf('B')==-1:
        return Number(String)
    default:   
        break; 
}
}
const processTime = async (time)=>{
    const daymillisecond = moment().format('x');
    switch(true){
        case time.indexOf('m')!=-1 || time.indexOf('phút')!=-1:
            return parseInt(daymillisecond)-parseInt(time.slice(0,time.indexOf('m')))*60000;
            break;
        case time.indexOf('h')!=-1 || time.indexOf('giờ')!=-1:
            return parseInt(daymillisecond)-parseInt(time.slice(0,time.indexOf('h')))*60000*60;
            break;
        case time.indexOf('d')!=-1 || time.indexOf('ngày')!=-1:
            return parseInt(daymillisecond)-parseInt(time.slice(0,time.indexOf('m')))*60000*60*24;
            break;
        case time.indexOf('w')!=-1 || time.indexOf('tuần')!=-1:
            return parseInt(daymillisecond)-parseInt(time.slice(0,time.indexOf('m')))*60000*60*24*7;
            break;
        case time.length == 4 || time.length==5||time.length==3:
            const currentYear = (new Date()).getFullYear()+'-'
            const day = currentYear.concat(time)
            return parseInt(moment(day ).format('x'));
            break;
        case time.length == 8 ||time.length == 9 || time.length==10:
            return parseInt(moment(time).format('x'));
            break;
    }
} 
function reverse (s) {
    return s.split('').reverse().join('');
}


