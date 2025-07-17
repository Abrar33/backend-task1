const mongoose=require("mongoose")
const schema=new mongoose.Schema({
    name:{type:String,},
    email:{type:String,required:true},
    password:{type:String,required:true},
    role:{type:String,
        enum:["admin","seller","buyer","manager"],
        default:"buyer"},
})
module.exports=mongoose.model("User", schema);