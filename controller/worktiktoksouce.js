import moment from 'moment';
import puppeteer from 'puppeteer';
import schemaTiktokSource from '../models/schematiktoksource.js';
import domTiktokSource from '../dom/tiktoksouce.json' assert {type: "json"}
import Queue from "bull";


const queueTiktokSource = new Queue('queueTiktokSource','redis://127.0.0.1:6379')
const  tiktokVideo= async ()=>{
    const browser = await puppeteer.launch({
        headless: false ,
        userDataDir: '/Users/hoangsa/Library/Application Support/Google/Chrome/Profile 3',
    });
    queueTiktokSource.process(1,async (job,done)=>{
        const page = await browser.newPage();
        page.setViewport({width: 1920, height: 1080});
        try {
            await page.goto(job.data.url)
            const vieOrEng = await page.evaluate((domTiktokSource)=>{
                return document.querySelector(domTiktokSource.checkLanguage.elementLanguage).textContent
            },domTiktokSource)
            if(vieOrEng == 'For You'){
                var domTiktok = domTiktokSource.english
            } else{
                domTiktok = domTiktokSource.vietnamese
            }
            if(page.url().indexOf('?')==-1){
                var authorUrl = page.url()
            }else{
                authorUrl = page.url().slice(0,page.url().indexOf('?'))
            }
            const objLink={
            authorUrl:authorUrl
            }
            const tiktokProfile = await page.evaluate(async (domTiktok)=>{
                var linkDescription = document.querySelector(domTiktok.elementDescriptionLink)?.textContent;
                if(linkDescription == undefined){
                    linkDescription=""
                }
                return (
                    {
                        authorId:document.querySelector(domTiktok.elementId).textContent.trim(),
                        authorName:document.querySelector(domTiktok.elementName).textContent.trim(),
                        following:document.querySelector(domTiktok.elementFollowing).textContent,
                        followers:document.querySelector(domTiktok.elementFollowers).textContent,
                        likes:document.querySelector(domTiktok.elementLikes).textContent,
                        description:(document.querySelector(domTiktok.elementDescription).textContent.replace(/\r?\n/g, " ")+" "+linkDescription).trim()
                    }   
                    )
            },domTiktok)
            const String = tiktokProfile.likes
            console.log( Number(String.slice(0,String.indexOf('B')))*1000000000)
            tiktokProfile.following = processStringToNumber(tiktokProfile.following)
            tiktokProfile.followers = processStringToNumber(tiktokProfile.followers)
            tiktokProfile.likes = processStringToNumber(tiktokProfile.likes)
            let insertTiktokSource = new schemaTiktokSource({...objLink,...tiktokProfile})
            await insertTiktokSource.save()
        } catch (error) {
            const contentError = await page.evaluate((domTiktok)=>{
                return document.querySelector(domTiktok.elementUrlError)?.textContent
            },domTiktok)
            if(contentError!="Couldn't find this account"){
                queueTiktokSource.add(job.data)
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
