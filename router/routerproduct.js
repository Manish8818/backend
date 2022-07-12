const express = require ("express");
const app = require("../app");
const { isAuthenticatedUser, authorizeRoles } = require("../middlware/auth");
const router = express.Router()
const Product = require("../model/productSchema");

//admin route create products
router.post("/product/new",isAuthenticatedUser,authorizeRoles("admin"), async(req,res)=>{

    try {
      req.body.user = req.user.id
        const product = await Product.create(req.body)
        res.status(201).json({product})
    } catch (error) {
        res.send(error)
    }
})

//get all products
router.get("/products", async(req,res)=>{
   try {
    const products = await Product.find()
     res.status(201).json({message:"router is working",products})
   } catch (error) {
    res.send(error)
   }
})

//update the product --admin
router.put("/product/:id", isAuthenticatedUser,authorizeRoles("admin"),async(req,res)=>{
  try {
    let product = await Product.findById(req.params.id)
    if(!product){
      res.status(500).json({success:false,message:"product not found"})
    }
    const products = await Product.findByIdAndUpdate(req.params.id,req.body)
    res.status(201).json({success:"true",message:"product updated",products})
  } catch (error) {
    res.send(error)
  }
})

//delete product --admin route
router.delete("/product/del/:id",isAuthenticatedUser,authorizeRoles("admin"),async(req,res)=>{
  try {
    let product = await Product.findById(req.params.id)
    if(!product){
      res.status(500).json({success:"false",message:"product not found"})
    }
    const products = await Product.findByIdAndDelete(req.params.id,req.body)
    res.status(201).json({success:"ture",message:"product is deleted"})
  } catch (error) {
    res.send(error)
  }
})

//get product detail or get single product

router.get("/products/:id",isAuthenticatedUser,async(req,res)=>{
  try {
    const product = await Product.findById(req.params.id)
    res.status(201).send(product)
    if(!product){
      res.status(500).json({success:"false",message:"product note found"})
    }
  } catch (error) {
    res.send(error)
  }
})

module.exports = router;