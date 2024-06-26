const mongoose = require('mongoose')
const bcrypt = require('bcrypt')
const validator = require('validator')
const Schema = mongoose.Schema

const userSchema = new Schema({
    first_name:{
        type: String,
        require:true
    },
    last_name:{
        type: String,
        require:true
    },
    username:{
        type: String,
        require:true
    },
    email:{
        type: String,
        require:true,
        unique:true
    },
    password:{
        type: String,
        require:true
    }
})

//static signup methode
userSchema.statics.signup = async function (first_name,last_name,username,email, password)  {
    //validation
    if(!first_name || !last_name || !username || !email || ! password){
        throw Error('All feilds must be filled')
    }
    if(!validator.isEmail(email)){
        throw Error('Email is not valid')
    }
    if(!validator.isStrongPassword(password)){
        throw Error('Password not strong enough')
    }
    const exists = await this.findOne({ email })
    if(exists){
        throw Error('Email already in use')
    }

    const salt = await bcrypt.genSalt(10)
    const hash = await bcrypt.hash(password, salt)

    const user = await this.create({first_name,last_name,username, email, password: hash})

    return user
}
//static login method
userSchema.statics.login = async function (email, password) {
    if(!email || ! password){
        throw Error('All feilds must be filled')
    }
    const user = await this.findOne({ email })
    if(!user){
        throw Error('Incorrect email')
    }
    const match = await bcrypt.compare(password, user.password)
    if(!match){
        throw Error('Incorrect password')
    }
    return user
}

module.exports = mongoose.model('User',userSchema)