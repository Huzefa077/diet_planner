import mongoose, {Schema} from "mongoose"

const foodSchema = new Schema ({
    name:{
        type:String,
        required:true,
        index:true,
    },
    servingSize:{
        amount:{
            type:mongoose.Schema.Types.Mixed,
            default:'g',
           
        },
        unit:{
            type:mongoose.Schema.Types.Mixed,
            enum: ["g", "ml", "cup", "oz", "unknown"],
            default:"unknown",
            
        }
    },
    calories:{
        type:Number,
        //required:true,
    },
    protein:{
        type:Number,
        //required:true,
    },
    carbs:{
        type:Number,
        //required:true,
    },
    fats:{
        type:Number,
        //required:true,
    },
    isVegetarian:{
        type:Boolean,
        default:true,
    },
    isVegan:{
        type:Boolean,
        default:true,
    },
    isGlutenFree:{
        type:Boolean,
        default:true,
    },
    category:{
        type:String,
        //required:true,
        enum:["Fruits A-F","Fruits G-P","Fruits R-Z","Vegetables A-E","Vegetables F-P","Vegetables R-Z","Meat, Poultry","Dairy products","Breads, cereals, fastfood,grains","Fats, Oils, Shortenings","Drinks,Alcohol, Beverages","Other","Fish, Seafood","Soups","Desserts, sweets","Seeds and Nuts","Jams, Jellies"],
        //trim:true,
    },
    averageRating: {
         type: Number,
          default: 0 
    }, // New field
    ratingCount: {
         type: Number,
          default: 0 
    },


},{timestamps:true});

export const Food = mongoose.model("Food",foodSchema,'foods');