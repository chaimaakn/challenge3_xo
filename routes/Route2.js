const express = require("express");
const router = express.Router();
const userModel = require("../database/modles/users.js");
const jwt = require("../util/jwt.js");
const hashUtile = require("../util/hash.js");
const { addNotification } = require("../util/notifications.js");
const authMiddleware = require("../middleware/authM.js");


router.post("/register", async function(req, res) {
    const email = req.body.email;
    const password = req.body.password;
    const name = req.body.name;
    if (!email || !password || !name) {
        res.json("Invalid body !! email or name or password not entered");
        return;
    }
    const user = await userModel.findOne({ email: email });
    if(user !== null){
        res.json({ success: false, message: "this user already exist!! please change your email" }); 
        return;

    }
    try {
        const hashedPassword = await hashUtile.hashPassword(password);
        const newUser= await userModel.create({ name, password: hashedPassword, email });
       
            const notificationAdded = await addNotification(newUser._id, `Bienvenue ${name} ! Nous sommes ravis de vous accueillir.`);
            res.json({ success: true, message: "User created successfully", notificationAdded: notificationAdded });
       
        }
     catch (error) {
        console.log(error);
        res.json({ success: false, message: "An error has been detected" });
    }
});

router.post("/login", async function(req, res) {
    const email = req.body.email;
    const password = req.body.password;

    const user = await userModel.findOne({ email: email });
    if (!user) {
        res.json("user not found");
        return;
    }

    const isValid = await hashUtile.comparePassword(user.password, password);
    if (!isValid) {
        res.json("password incorrect");
        return;
    }
    const token = jwt.genertatoken(user._id);
    res.json({ success: true, token });
});
router.get("/notifications", authMiddleware, async function(req, res) {
    try {
        if (!req.user || !req.user._id) {
            return res.status(401).json({ success: false, message: "User not authenticated" });
        }
        const user = await userModel.findById(req.user._id);
        if (!user) {
            return res.status(404).json({ success: false, message: "User not found" });
        }
        res.json({ success: true, notifications: user.notifications });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: "An error occurred while fetching notifications" });
    }
});

module.exports = router;
