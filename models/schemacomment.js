import mongoose from 'mongoose';
import mongo_info from './connectmongo.js';
const {Schema,model} = mongoose;


mongoose.connect(mongo_info.name_colection);
const profileSchema = new Schema({
    type:String,
    id:String,
    siteName:String,
    siteId:String,
    parentId:String,
    parentDate:String,
    publishDate:String,
    url:String,
    author:String,
    authorId:String,
    title:String,
    content:String,
    likes:Number,
    share:Number,
    comments:Number,
    interactions:Number
}, { versionKey: false })
export default model('comment',profileSchema);
