import mongoose from "mongoose";
import app from "./app.js";



(async ()=>{
    try{
        await mongoose.connect("mongodb+srv://iyed:ohmygahh@drama.zzi1idx.mongodb.net/?retryWrites=true&w=majority&appName=drama");
        console.log("fb connected");
        const onListening = ()=> {
            console.log("listening on port 5000")

        }
        app.listen(5000, onListening)
    }catch(error){
        console.error("error: ", error)
    }
})()