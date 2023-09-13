import schemaurlpost from "../models/schemaurlpost.js";
import Queue from 'bull';

const queueComment = new Queue('queueComment','redis://127.0.0.1:6379')

// const linkpost = await schemaurlpost.find({}).select('-_id -processInfo')
// const detailpost = await  schemadetailurltrue.find({}).select('-_id')
// detailpost.map(async(x)=>{
   
//     queueComment.add(x)
//     await schemaurlpost.updateOne(x,{processCmt:true})
    
// })
queueComment.add({urlVideo:"https://www.tiktok.com/@the_red_devils_1878/video/7123396663523265818?is_from_webapp=v1&item_id=7123396663523265818"})
// await queueComment.obliterate({ force: true });