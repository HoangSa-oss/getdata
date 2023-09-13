import puppeteer from 'puppeteer';
import domComment from '../dom/comment.json' assert { type: 'json' }
import delay from 'delay';
import fs from 'fs/promises'
const  tiktokProfile = async()=>{
    const browser = await puppeteer.launch({
        headless: false,
        // userDataDir: 'C:/Users/Admin/AppData/Local/Google/Chrome/User Data/Profile 8',
    });
    const page = await browser.newPage();
  
    await page.setViewport({width: 1440, height: 1024});
    await page.goto("https://www.tiktok.com/@theanh28entertainment/video/7109792580140911874?is_copy_url=1&is_from_webapp=v1")
    const vieOrEng = await page.evaluate((domComment)=>{
        return document.querySelector(domComment.checkLanguage.elementLanguage).textContent
    },domComment)
    if(vieOrEng == 'For You'){
        var domTiktok = domComment.domCheckFromLinkTrue.english
    } else{
        domTiktok = domComment.domCheckFromLinkTrue.vietnamese
    }
  
    await page.waitForSelector(domTiktok.elementComment)
    await page.evaluate( (domTiktok) => {
       scrollBy(0, document.body.scrollHeight*1000)
    },domTiktok);  
    await page.evaluate( (domTiktok) => {
       scrollBy(0, -document.body.scrollHeight*1000)
    },domTiktok);  
    await page.evaluate( (domTiktok) => {
       scrollBy(0, document.body.scrollHeight*1000)
    },domTiktok);  
    await page.evaluate( (domTiktok) => {
      scrollBy(0, -document.body.scrollHeight*1000)
    },domTiktok);  
    await page.evaluate( (domTiktok) => {
        scrollBy(0, document.body.scrollHeight*1000)
    },domTiktok);  
    await delay(10000)
    const cookies = await page.cookies()
    console.log(cookies)
    await fs.writeFile('controller/cookies.json',JSON.stringify(cookies))  
    await browser.close()
    
}
tiktokProfile()  


