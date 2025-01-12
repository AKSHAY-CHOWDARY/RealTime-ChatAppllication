const exp = require('express')
const userApp = exp.Router()
const expressAsyncHandler = require('express-async-handler')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')


let usersCollection ;

userApp.use((req,res,next)=>{
    usersCollection = req.app.get('usersCollection');
    next();
})


//SIGN UP 
userApp.post('/register',expressAsyncHandler(async(req,res)=>{

    const user = req.body;
    console.log("req arrived");

    console.log(user);
    let dbres = await usersCollection.findOne({email:user.email});
   
    if(dbres==null){
        //HASH PASSWORD
        try{
            let hashedpass = await bcrypt.hash(user.password,7);
            user.password = hashedpass;
            await usersCollection.insertOne(user);
            res.send({message:"user registered",payload:{username:user.username,email:user.email}});
        }catch(err){
            console.log("error at SIGNUP ROUTE IN BACKEND",err);
            res.status(500).send({ message: "Error during registration", error: err.message });
        }
    }else{
        res.send({message:"user with same email already existed!"});
    }
}));

//LOGIN
userApp.post('/login',expressAsyncHandler(async(req,res)=>{
    // check if user in db
    const user = req.body;
    let dbres = await usersCollection.findOne({email:user.email});
    console.log(dbres);
    if(dbres==null){
        return res.send({message:"Invalid credentials"});
    }
    //compare passwords
    let status = await bcrypt.compare(user.password,dbres.password);
    if(status){
        let token = jwt.sign({email:user.email},'abcdefghi');
        //sessionStorage.setItem('token',token,{expiresIn:'1d'});
        delete dbres.password;
        return res.send({message:"Login success",payload:dbres,token:token});
    }
    return res.send({message:"Invalid credentials"});
}))


// TO FETCH ALL USERS TO DISPLAY
userApp.post('/users',expressAsyncHandler(async(req,res)=>{
    let myemail = req.body.email;
    let users = await usersCollection.find({email:{$ne:myemail}}).toArray(); // all users except myself
    return res.send({message:"all users",payload:users});
}))

module.exports = userApp;