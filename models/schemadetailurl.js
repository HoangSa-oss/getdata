import mongoose from 'mongoose';
import mongo_info from './connectmongo.js';
const {Schema,model} = mongoose;


mongoose.connect(mongo_info.name_colection);
const profileSchema = new Schema({
    type:String,
    id :String,
    siteName:String,
    siteId:String,
    publishedDate:String,
    url:String,
    author:String,
    urlVideo:String,
    authorUrl:String,
    authorId:String,
    title:String,
    content:String,
    likes:Number,
    shares:Number,
    comments:Number,
    interactions:Number,
    
}, { versionKey: false })
export default model('detailurl',profileSchema);
