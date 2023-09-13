import puppeteer from 'puppeteer';
import domComment from '../dom/comment.json' assert { type: 'json' }
import moment from 'moment';
import Queue from 'bull';
import schemacomment from '../models/schemacomment.js';
const queueComment = new Queue('queueComment','redis://127.0.0.1:6379')
import cookie from "./cookies.json" assert { type: 'json' }
import delay from 'delay';


const  tiktokProfile = async()=>{
    const browser = await puppeteer.launch({
        headless: false,
        // userDataDir: '/Users/hoangsa/Library/Application Support/Google/Chrome/Profile 3',
        args: [
            '--enable-features=NetworkService',
            '--no-sandbox',
            '--disable-setuid-sandbox',
            '--disable-dev-shm-usage',
            '--disable-web-security',
            '--disable-features=IsolateOrigins,site-per-process',
            '--shm-size=3gb', // this solves the issue
          ],
          ignoreHTTPSErrors: true,
    });

    queueComment.process(1,async (job,done)=>{
        const totalCommentCrawl =10000;
        var timeWait = totalCommentCrawl;
        var condtionLoopMutation = false
        var conditionMutation = 0
        const customBrowser = await getBrowser(browser)
        const page = await customBrowser.newPage();
        // await page.setCookie(...cookie)
        await page.exposeFunction("processTime", processTime);
        await page.exposeFunction("processStringToNumber", processStringToNumber);
        await page.exposeFunction("processTimeStamp", processTimeStamp)
        page.setViewport({width: 1300, height: 1080});
        try {
            await page.goto(job.data.urlVideo)
            const checkForm = await page.$(domComment.checkFormUrl.elementCheckFromUrl)

            if(checkForm==null){
                const vieOrEng = await page.evaluate((domComment)=>{
                    return document.querySelector(domComment.checkLanguage.elementLanguage).textContent
                },domComment)
                if(vieOrEng == 'For You'){
                    var domTiktok = domComment.domCheckFormLinkFalse.english
                } else{
                    domTiktok = domComment.domCheckFormLinkFalse.vietnamese
                }
                await page.waitForSelector(domTiktok.elemenClick)
                await page.click(domTiktok.elemenClick)
                await page.waitForSelector(domTiktok.elementContainer)
                await page.waitForSelector(domTiktok.elementLastChildScroll)
                let totalComment = await page.evaluate(async (domTiktok)=>{
                    return await processStringToNumber(document.querySelector(domTiktok.elementTotalComment).textContent)
                },domTiktok)
                if(totalComment<totalCommentCrawl){
                    timeWait =totalComment
                }
                await mutationFalse(domTiktok,page)
                page.on('console', async (msg) => {
                    if (msg._text == 'scroll') {
                        conditionMutation=conditionMutation+1
                        if(conditionMutation%2==0){
                            condtionLoopMutation =true
                            await page.evaluate(()=>{
                                console.clear()
                            })
                        }
                    }
                    }) 
                for(let i=0;i<=100000;i++){
                    for(let i=0;i<timeWait;i++){
                        await delay(100)
                        if(condtionLoopMutation == true){
                            condtionLoopMutation = false
                            break;
                        }
                        if(i==timeWait/10||i==timeWait/100 || i==timeWait/1000  || i==timeWait/10000 || i==timeWait/100000|| i==timeWait/1000000){
                                await page.evaluate( (domTiktok) => {
                                    document.querySelector(domTiktok.elementLastChildScroll).scrollIntoView()
                                },domTiktok);  
                                await page.evaluate( () => {
                                    scrollBy(0,-200)
                                }); 
                                await page.evaluate( () => {
                                    scrollBy(0,200)
                                }); 
                                // await page.evaluate( () => {
                                //     scrollBy(0, -document.body.scrollHeight/4)
                                // }); 
                        }
                        if(i==timeWait-1){
                            var conditionBreakScroll = true
                        }
                    }
                }
                const commentAll = await page.evaluate(async (domTiktok,totalCommentCrawl)=>{
                    return await Promise.all(
                        Array.from(document.querySelectorAll(domTiktok.elementComment)).slice(0,totalCommentCrawl).map(async(x)=>
                            {
                                idPost: 
                                idComment:

                            return({
                                type:"snsComment",
                                name:x.querySelector(domTiktok.elementNameUserComment)?.textContent.trim(),
                                urlName:'https://www.tiktok.com'.concat(x.querySelector(domTiktok.elementUrlName).getAttribute('href')),
                                content:x.querySelector(domTiktok.elementCommentContent)?.textContent.trim(),
                                date:await processTime(x.querySelector(domTiktok.elementDateComment)?.textContent),
                                likes:await processStringToNumber(x.querySelector(domTiktok.elementLikeComment)?.textContent),

                            })
                        }
                        )
                    )
                },domTiktok,totalCommentCrawl)
                for(let i=0;i<commentAll.length;i++){
                    const insertComment = new schemacomment({...job.data,...commentAll[i],inserted:false})
                    await insertComment.save()
                }    
            }else{
                const vieOrEng = await page.evaluate((domComment)=>{
                    return document.querySelector(domComment.checkLanguage.elementLanguage).textContent
                },domComment)
                if(vieOrEng == 'For You'){
                    var domTiktok = domComment.domCheckFromLinkTrue.english
                } else{
                    domTiktok = domComment.domCheckFromLinkTrue.vietnamese
                }
                await page.waitForSelector(domTiktok.elementLastChildComment)
                await mutationTrue(domTiktok,page)
                page.on("console", async (msg) => {
                    if (msg._text == 'scroll') {
                        conditionMutation=conditionMutation+1
                        if(conditionMutation%2==0){
                            condtionLoopMutation =true
                            // await page.evaluate(()=>{
                            //     console.clear()
                            // })
                        }
                    }
                    }) 

                for(let i=0;i<=100000;i++){
                    for(let i=0;i<timeWait;i++){
                        await delay(10)
                        if(condtionLoopMutation == true){
                            condtionLoopMutation = false
                            break;
                        }
                        if(i==timeWait/5||i==timeWait/10 || i==timeWait/15  || i==timeWait/20|| i==timeWait/25|| i==timeWait/30){
                            await page.evaluate( (domTiktok) => {
                                document.querySelector(domTiktok.elementLastChildScroll).scrollIntoView()
                            },domTiktok);  
                            await page.evaluate( () => {
                                scrollBy(0,-200)
                            }); 
                            await page.evaluate( () => {
                                scrollBy(0,200)
                            }); 
                                // await page.evaluate( () => {
                                //     scrollBy(0, -document.body.scrollHeight/4)
                                // }); 
                        }
                        if(i==timeWait-1){
                            var conditionBreakScroll = true
                        }
                    }
                    let totalComments = await page.evaluate((domTiktok)=>{
                        return document.querySelectorAll(domTiktok.elementComment).length 
                    },domTiktok)
                   if(totalComments<3000){
                        try {
                            await clickMoreReplies(domTiktok,page)
                        } catch (error) {
                            console.log(error)
                        }
                        try {
                            await clickViewMore(domTiktok,page)
                        } catch (error) {
                            console.log(error)
                        }
                    }
                    if(conditionBreakScroll==true || totalComments>=totalCommentCrawl){
                        break;
                    }
                    // await page.evaluate( () => {
                    //     scrollBy(0, document.body.scrollHeight*1000000)
                    // });      
            }
            let title = await page.evaluate((domTiktok)=>{
                return document.querySelector(domTiktok.elementTitle).textContent
            },domTiktok)
            let url = await page.evaluate((domTiktok)=>{
                return document.querySelector(domTiktok.elementUrl).getAttribute('href')
            },domTiktok)
            let parentDate = await page.evaluate((domTikok)=>{
                return document.querySelector(domTikok.elementDate).textContent
            },domTiktok)
            parentDate = await processTime(parentDate)
            parentDate = await processTimeStamp(parentDate)
                const commentAll = await page.evaluate(async (domTiktok,totalCommentCrawl,url,moment)=>{
                    return await Promise.all(
                        Array.from(document.querySelectorAll(domTiktok.elementComment)).slice(0,totalCommentCrawl).map(async(x)=>
                            {
                                let idPost=url.slice(url.indexOf(/video/)+7,url.indexOf(/video/)+26)
                                let idComment=document.querySelector(domTiktok.elementIdComment).getAttribute('id')
                                let likes= await processStringToNumber(x.querySelector(domTiktok.elementLikeComment).textContent)
                                let share= 0
                                let comments= 0
                                let publishDate = await processTime(x.querySelector(domTiktok.elementDateComment).textContent)

                            return({
                                id:idPost+"_"+idComment,
                                content:x.querySelector(domTiktok.elementCommentContent).textContent.trim(),
                                publishDate: await processTimeStamp(publishDate),
                                url:url+"#"+idComment,
                                author:x.querySelector(domTiktok.elementNameUserComment).textContent.trim(),
                                authorId:x.querySelector(domTiktok.elementUrlName).getAttribute('href').slice(2,10000),
                                likes:likes,
                                share:share,
                                comments:comments,
                                interactions:likes+share+comments
                            })
                        }
                        )
                    )
                },domTiktok,totalCommentCrawl,url,moment)

                await page.evaluate((domTiktok)=>{
                    document.querySelector(domTiktok.elementClickSiteId).click()
                },domTiktok)
                await page.waitForSelector(domTiktok.elementSiteName)
                await page.waitForSelector(domTiktok.elementSiteId)
                let siteId = await page.evaluate((domTiktok)=>{
                    return document.querySelector(domTiktok.elementSiteId).textContent.trim()
                },domTiktok)
                siteId = reverse(siteId).slice(0,19)
                siteId = reverse(siteId)
                let siteName = await page.evaluate((domTiktok)=>{
                    return document.querySelector(domTiktok.elementSiteName).textContent.trim()
                },domTiktok)
                for(let i=0;i<commentAll.length;i++){
                    const insertComment = new schemacomment({
                        type:"snsComment",
                        siteName:siteName,
                        siteId:siteId,
                        parentDate:parentDate,
                        parentId:siteId+"_"+url.slice(url.indexOf(/video/)+7,url.indexOf(/video/)+26),
                        title:title,
                        ...commentAll[i],inserted:false})
                    await insertComment.save()
                } 
            }
        } catch (error) {
            try {
                const contentError = await page.evaluate((domTiktok)=>{
                    return document.querySelector(domTiktok.elementUrlError)?.textContent
                },domTiktok)
                let totalComments = await page.evaluate((domTiktok)=>{
                    return document.querySelector(domTiktok.elementTotalComment).textContent
                },domTiktok)
                if(contentError!="Video currently unavailable"&totalComments!=0){
                    queueComment.add(job.data)
                }   
            } catch (error) {
                queueComment.add(job.data)
            }
            console.log(error)
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
const processStringToNumber = async(String)=>{
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
const processTimeStamp = async (time)=>{
    return moment(time).format();
} 
const clickMoreReplies = async(domTiktok,page)=>{
    await page.evaluate(async (domTiktok) => {

        async function wait(ms) {
            return new Promise(r => setTimeout(r, ms)).then(() => "Yay");
        }
        return (async () => {
            const array =  document.querySelectorAll(domTiktok.elementMoreReplies)
            for await (let x of array) {
                let fatherx = x.parentNode.parentNode
                await x.click(); 
                for(let i=0;i<60;i++){

                    let conditionBreak1 = fatherx.querySelector(domTiktok.elementLoading)
                    if(conditionBreak1==null){
                        break;
                    }
                    await wait(1000)
                }    
            }

        })();


    },domTiktok);
}
const clickViewMore = async(domTiktok,page)=>{   
    await page.evaluate(async (domTiktok) => {
        async function wait(ms) {
            return new Promise(r => setTimeout(r, ms)).then(() => "Yay");
        }
        return (async () => {  
            const array = document.querySelectorAll(domTiktok.elementFatherViewMore)
            for await (let x of array) {
                var conditinBreakViewMore = true
                let fatherx = x.parentNode
                while(conditinBreakViewMore){
                    if(x.querySelector(domTiktok.elementViewMore)!=null){
                        await x.querySelector(domTiktok.elementViewMore).click(); 
                        for(let i=0;i<60;i++){
                            let conditionBreak = x.querySelector(domTiktok.elementViewMore)
                            let conditionBreak1 = fatherx.querySelector(domTiktok.elementLoading)
                            if(conditionBreak1==null){
                                break;
                            }
                            if(conditionBreak==null&&conditionBreak1==null){
                                conditinBreakViewMore=false;
                                break;
                            }
                            await wait(500)
                        }  
                    }else{
                        conditinBreakViewMore = false
                    }
                }
            }
        })();
    },domTiktok);
}
const mutationTrue = async(domTiktok,page)=>{
    await page.evaluate(async(domTiktok)=>{
        var mutationObserver = new MutationObserver(function(mutations) {
            if(mutations[mutations.length-1].previousSibling?.parentNode==document.querySelector(domTiktok.elementMutation)){console.log('scroll')}
            });
            mutationObserver.observe(document.querySelector(domTiktok.elementMutation), {
                attributes: true,
                characterData: true,
                childList: true,
                subtree: true,
                attributeOldValue: true,
                characterDataOldValue: true
            })
    },domTiktok)
}
const mutationFalse = async(domTiktok,page)=>{
    await page.evaluate(async(domTiktok)=>{
        var mutationObserver = new MutationObserver(function(mutations) {
            if(mutations[mutations.length-1].previousSibling?.parentNode==document.querySelector(domTiktok.elementMutation)){console.log('scroll')}
            });
            mutationObserver.observe(document.querySelector(domTiktok.elementMutation), {
                attributes: true,
                characterData: true,
                childList: true,
                subtree: true,
                attributeOldValue: true,
                characterDataOldValue: true
            })
    },domTiktok)
}
function getBrowser(browser) {
    return new Promise(function (resolve, reject) {
        if (browser !== undefined && browser.isConnected()) {
            resolve(browser);
        }
        else {
            puppeteer
                .connect({
                browserWSEndpoint: "ws://chrome_browser:3000/"
            })
                .then(function (opened_browser) {
                browser = opened_browser;
                resolve(opened_browser);
                console.log("Browser is open");
            })
                .catch(function (err) {
                console.log("ERROR lunching browser: ", err);
                reject(err);
            });
        }
    });
}
function reverse (s) {
    return s.split('').reverse().join('');
}

