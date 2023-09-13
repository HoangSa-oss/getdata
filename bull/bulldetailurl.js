import schemaurlpost from "../models/schemaurlpost.js";
import Queue from 'bull';


const queueDetailUrlGetCopy = new Queue('queueDetailUrlGetCopy','redis://127.0.0.1:6379')

const linkpost = await schemaurlpost.find({}).select('-_id')
console.log(linkpost)
linkpost.map(async(x)=>{
    queueDetailUrlGetCopy.add(x)
})
// queueDetailUrlGetCopy.process((job,done)=>{
//     console.log(job.data)
//     done()
// })
// queueDetailUrlGetCopy.add({urlVideo: "https://www.tiktok.com/@pnjofficialvn/video/7172015359300603138"})

// await queueDetailUrlGetCopy.obliterate({ force: true });