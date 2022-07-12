const mongoose = require("mongoose");

const productSchema = new mongoose.Schema({
    name:{
        type:String,
        required:[true,"please enter product name"]
    },
    discription:{
        type:String,
        required:[true,"please enter product discription"]
    },
    price:{
        type:Number,
        required:[true,"please enter product price"]
    },
    rating:{
        type:String,
        default:0
    },
    image:[{
        public_id:{
            type:String,
            required:true
        },
        url:{
            type:String,
            required:true
        }
    }
    ],
    category:{
        type:String,
        required:[true,"please enter category"]
    },
    stock:{
        type:String,
    },
    numofReview:{
        type:String,
        default:0
    },
    review:[
        {
            name:{
                type:String,
                required:true
            },
            rating:{
                type:String,
                required:true
            },
            comment:{
                type:String,
                require:true
            }
        }
    ],
    createdAt:{
        type:Date,
        default:Date.now
    },
    user:{
        type:mongoose.Schema.ObjectId,
        ref:"User",
        require:true

    }
    
})

module.exports = mongoose.model("Product",productSchema);