// Mongoose Model -> a tool that helps us to talk to the database. with it we can easily do things like add, read, update, and delete tasks. it's like helpful asistent that understands how to commnunicate with the database. 
// Schema -> Schema basically defines what each task should look like.LIke a blueprint or a set of instructions that guides how each task is created, what information it should have, and how that information is organized. It's like a rules for how our tasks are stored in the DB.

import mongoose from "mongoose";
import { nanoid } from "nanoid";

const TodoSchema = new mongoose.Schema({
    name:{
        type:String, //emphasizes that it can only be text (a String).
        required: true, //specifies that we have to provide this when creating a task
        trime:true // specifies that any extra spaces at the beginning or at the end of the task's name will be removed before saving it in the
    }, 
    detail:{
        type:String,
        required: true,
        trim:true
    },
    status:{ //This shows if the task is done or not
        type: String,
        required:true,
        enum: ['completed', 'pending'], // property specifies that it can only be 'completed' or 'pending'
        default: 'pending', 
        trim: true
    },
    code:{ // short and unique ID for the task
        type: String,
        required: true,
        default: 'code',
        trim:true
    }

},{timestamps:true})// is a configuration option that automatically adds timestamp fields like createdAt and updatedAT to the tasks when they are created or modified.

TodoSchema.pre('save',function(next){//helps us defining a pre-save hook/function which runs every time before a task gets saved in the database.
    this.code = nanoid(10)
    /**
     * `nanoid(10)` to create a unique, 10 character long ID for the task and put this generated id in the code field of the task (we can actually access any property/field of the task using the this keyword).
     */
    next() 
    // basically tells the computer that we are done and it can finally save the document now. With this, we generate a unique ID for every single task created using the nanoid package.
}) 

const Todos = mongoose.model('Todos',TodoSchema) // Todos model using this TodoSchema blueprint and export it.
export default Todos