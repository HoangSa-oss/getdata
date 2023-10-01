import delay from 'delay';
import puppeteer from 'puppeteer-extra';
import schemaLinkPost from '../models/schemaurlpost.js';
import schematiktoksource from '../models/schematiktoksource.js';
import domLinkPost from '../dom/linkpost.json' assert {type: "json"}
import schemalinkerror from '../models/schemalinkerror.js';
import Queue from "bull";
import StealthPlugin from 'puppeteer-extra-plugin-stealth';
import  {executablePath} from 'puppeteer'
puppeteer.use(StealthPlugin());
import fs from 'fs/promises'
import moment from 'moment/moment.js';
const queueLinkPost = new Queue('queueLinkPost','redis://127.0.0.1:6379')
const  tiktokVideo= async ()=>{
    const date = '2023-09-27'
    const dateTimeStamp = moment(date).format('X')
    console.log(dateTimeStamp)
    const getEnd = 8;
    const timewait = 500
    const browser = await puppeteer.launch({
        headless: false ,
        // userDataDir: 'C:/Users/Sa/AppData/Local/Google/Chrome/User Data/Profile 11',

        // userDataDir: '/Users/hoangsa/Library/Application Support/Google/Chrome/Profile 3',
        executablePath:executablePath()

    });
    queueLinkPost.process(1,async (job,done)=>{
        const page = await browser.newPage();
        page.setViewport({width: 1440, height: 900});

        try {
            var domTiktok = domLinkPost.english

            await page.goto(job.data.authorUrl, {waitUntil: 'networkidle0' })
            await page.waitForSelector('#SIGI_STATE')
            await page.waitForSelector(domTiktok.elementVideoLastChild,{timeout:10000})
            let  a = await page.evaluate(()=>{
                return document.querySelector('#SIGI_STATE').textContent
            })
            let b = Object.values(JSON.parse(a).ItemModule)
            await fs.writeFile('concac.json',JSON.stringify(b))
            let c = b.map((item)=>{
                return {
                    date: item.createTime,
                    urlPost: `https://www.tiktok.com/@${item.author}/video/${item.id}`,
                }
            })
            var concac = 0
            c.map(async(item)=>{
                if(item.date>dateTimeStamp){
                    let insertData = await schemaLinkPost({...job.data,...item})
                    insertData.save()
                }else{
                    concac = 1
                }
            })
            var breakConditon = false
            page.on('response',async(response)=>{
                if(response.url().includes('https://www.tiktok.com/api/post/item_list')){
                    try {
                        let text = await response?.text()
                        let text1 = JSON.parse(text)
                        console.log(text1.itemList?.length)
                        let abc = text1.itemList?.map((item)=>{
                            return {
                                date: item.createTime,
                                urlPost: `https://www.tiktok.com/@${item.author.uniqueId}/video/${item.id}`,
                            }
                        })
                        console.log(abc)
                        abc?.map(async(x)=>{
                            try {
                               if(x.date>dateTimeStamp){
                                const insertDetailUrl =  new schemaLinkPost({...job.data,...x})
                                    insertDetailUrl.save()
                               }else{
                                    breakConditon = true
                               }    
                            } catch (error) {

                            }

                        }) 
                    } catch (error) {
                        console.log(error)
                    }              
                }
            } )
            if(concac!=1){
                for(let i=0;i<100000;i++){
                    await delay(2000)

                    const totalVideo = await page.evaluate((domTiktok)=>{
                        return document.querySelectorAll(domTiktok.elementVideo).length 
                    },domTiktok)
                    await page.evaluate( () => {
                        scrollBy(0, document.body.scrollHeight*100000)
                    });  
                    for(let i=0;i<timewait;i++){
                        await delay(100)
                        const conditinBreak = await page.evaluate((domTiktok)=>{
                            return document.querySelectorAll(domTiktok.elementVideo).length 
                        },domTiktok)
                        if(totalVideo!=conditinBreak){
                            break;
                        }
                        if(i==timewait-1){
                            var conditionBreakScroll = true
                        }
                    }
                    if(conditionBreakScroll==true || breakConditon==true){
                        break;
                    }
                }    
            }
        } catch (error) {
            console.log(error)
            const contentError = await page.evaluate((domLinkPost)=>{
                return document.querySelector(domLinkPost.english.elementUrlError)?.textContent
            },domLinkPost)
            const contentError2 = await page.evaluate((domLinkPost)=>{
                return document.querySelector(domLinkPost.english.elementUrlError2)?.textContent
            },domLinkPost)
            console.log(contentError!="This account is private")
            if((contentError!="Không có nội dung" && contentError!="Couldn't find this account" && contentError!="No content" && contentError!="This account is private")){
                if((contentError2!="Không có nội dung" && contentError2!="Couldn't find this account" && contentError2!="No content" && contentError2!="This account is private")){
                    queueLinkPost.add(job.data)
                }
            }else{
                let insertLinkError = new schemalinkerror({...job.data,description:contentError})
                await insertLinkError.save();
            }
          
        }
        await page.close()
        done()   
    }) 
}
tiktokVideo()

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