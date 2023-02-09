const User = require('../models/userModel')
const bcrypt = require('bcrypt');

const loadRegister = async (req, res) => {
    try {
        res.render('registration')

    }
    catch (error) {
        console.log(error.message)
    }
}


const securePassword = async (password) => {
    try {
        const passwordHash = await bcrypt.hash(password,10);
        return passwordHash;
    }
    catch (error) {
        console.log(error.message)
    }
}
const insertUser = async (req, res) => {
    try {

        const spassword = await securePassword(req.body.password);
        // console.log("sp"+spassword)
        const user = new User({
            name: req.body.name,
            email: req.body.email,
            mobile: req.body.mno,
            password: spassword,
            is_admin: 0

        });
        // if(user.name == ""){
        //     res.render('registration', { nameMessage: "enter your name" })
        // }

        const userData = await user.save();
        console.log(userData);

        if (userData) {
            res.render('registration', { message: "your registration is succesful" })
        }
        else {
            res.render('registration', {message:"your registration is failed"})
        }

    }
    catch (error) {
        console.log(error.message);
    }
}

// login user 

const loginLoad = async (req, res) => {
    try {
        res.render('login');
    }
    catch (error) {
        console.log(error.message);
    }
};

const verifyLogin = async (req, res) => {
    try {
        const email = req.body.email;
        const password = req.body.password;

        const userData = await User.findOne({ email: email,is_admin:0 });
        console.log("user:"+userData)
        if (userData) {
            const passwordMatch = await bcrypt.compare(password, userData.password)
            // console.log("user p:"+password)
            // console.log("diclear p:"+userData.password)
            // console.log("user:"+passwordMatch)
            if (passwordMatch) {
                // console.log("hai : " + userData._id)
                req.session.user_id = userData._id;
                req.session.user=userData.name;
                req.session.user1 = true

                // console.log(req.session)
                res.redirect('/home')
            }

            else {
                res.render('login', { message: 'email and password are incorrect' })
            }
        }
        else {
            res.render('login', { message: 'email and password are incorrect' })
        }



    }
    catch (error) {
        console.log(error.message);
    }
}

const loadHome = async (req, res) => {
    try {
        if(req.session.user){
            res.render('home',{user : req.session.user})
        }

        // res.render('home')
    }
    catch (error) {
        console.log(error.message)
    }
}

const userLogout = async (req, res) => {
    try {
        req.session.user1 = null;
        res.redirect('/')
    }
    catch (error) {
        console.log(error.message)
    }

}

module.exports = {
    loadRegister,
    insertUser,
    loginLoad,
    verifyLogin,
    loadHome,
    userLogout
}
