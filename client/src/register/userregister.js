const express = require('express');
const router = express.Router();
const con = require('../DL/databaseCon');
const bcrypt = require('bcryptjs');

router.post('/',async(req,res) => {
    const {fullname,password,role,email,mobile,device,gpu_status} = req.body;
    const hashedpassword = await bcrypt.hash(password,10);
    const query = 'INSERT INTO users (Fullname,Password,Role,Email,Mobile,Device,GPU_Status) VALUES (?,?,?,?,?,?,?)';
    con.query(query,[fullname,hashedpassword,role,email,mobile,device,gpu_status],(err,results) => {
        if (err) 
        {
            return res.status(500).json({error : err.sqlMessage});    
        }
        else
        {
            return res.status(201).json("User Registered Successfully");
        }
    });
});

module.exports = router;