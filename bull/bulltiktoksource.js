import Queue from "bull";
import schemalink from "../models/schemalink.js";


const queueTiktokSource = new Queue('queueTiktokSource','redis://127.0.0.1:6379')

const link = await schemalink.find({}).select('-_id')
link.map(x=>{
    queueTiktokSource.add(x)
})
// await queueTiktokSource.obliterate({ force: true });