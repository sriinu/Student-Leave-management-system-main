const express=require('express'),
 mongoose=require('mongoose'),
 app=express();
require('dotenv').config();
 
//connect to mongodb
mongoose.connect(process.env.DATABASE,{
    useNewUrlParser:true,
    useUnifiedTopology:true
}).then(()=>{
    //listening to port
    const port=process.env.PORT||5000;
    app.listen(port,()=>{
        console.log(`server running on port ${port}`)
    })
}).catch(err=>{
    console.log("Error:",err.message);
})
mongoose.Promise=global.Promise;

//view engine set
app.set('view engine','ejs');
//serving status
app.use(express.static('public'));
//using bodyparse
app.use(express.urlencoded({extended:true}));

//api route
app.use(require('./routes/api'));
//error handling
app.use((err,req,res,next)=>{
    res.send({error:err.message});
});


