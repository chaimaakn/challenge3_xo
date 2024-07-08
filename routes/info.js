const express=require("express");
const router=express.Router();
const authMiddleware=require("../middleware/authM.js");

router.use(authMiddleware);
router.get("/me",function(req,res){
res.json(req.user);  
}
);

module.exports=router;