import mongoose from 'mongoose';
import mongo_info from './connectmongo.js';
const {Schema,model} = mongoose;


mongoose.connect(mongo_info.name_colection);
const profileSchema = new Schema({
        authorUrl:String,
        authorName:String,
        authorId:String,
        following:Number,
        followers:Number,
        likes:Number,
        description:String,
        urlLastPost:String,
        idLastPost:String
       
}, { versionKey: false })
export default model('tiktoksource',profileSchema);
