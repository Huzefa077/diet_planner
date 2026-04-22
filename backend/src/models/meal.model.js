import mongoose, { Schema } from "mongoose";

const mealSchema = new Schema(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
    startDate: {
      type: Date,
      required: true,
    },
    endDate: {
      type: Date,
      required: true,
    },
    dailyPlans: [
      {
        date: {
          type: Date,
          required: true,
        },
        status: {
          type: String,
          enum: ["In Progress", "Completed"],
          default: "In Progress",
        },
        completedAt: {
          type: Date,
          default: null,
        },
        totalNutrients: {
          calories: {
            type: Number,
            min: 0,
            default: 0,
          },
          protein: {
            type: Number,
            min: 0,
            default: 0,
          },
          carbs: {
            type: Number,
            min: 0,
            default: 0,
          },
          fats: {
            type: Number,
            min: 0,
            default: 0,
          },
        },
        
        meals: [
          {
            mealType: {
              type: String,
              enum: ["Breakfast", "Lunch", "Snack", "Dinner"],
              required: true,
            },
            foods: [
              {
                _id:{
                  type: Schema.Types.ObjectId,
                  ref: "Food",
                  required: true,
                },
                name:{
                  type:String,
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
                      default:0,
                      //required:true,
                  },
                  protein:{
                      type:Number,
                      default:0,
                      //required:true,
                  },
                  carbs:{
                      type:Number,
                      default:0,
                      //required:true,
                  },
                  fats:{
                      type:Number,
                      default:0,
                      //required:true,
                  },
                  isConsumed: { 
                    type: Boolean, 
                    default: false 
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
                /*
                amount: {
                  type: Number,
                  //required: true,
                },
                unit: {
                  type: String,
                  //required: true,
                },
                */
              },
            ],
            totalNutrients: {
              calories: {
                type: Number,
                min: 0,
                default:0,
              },
              protein: {
                type: Number,
                min: 0,
                default:0,
              },
              carbs: {
                type: Number,
                min: 0,
                default:0,
              },
              fats: {
                type: Number,
                min: 0,
                default:0,
              },
            },
            feedback: {
              rating: { type: Number, min: 1, max: 5 },
              comments: { type: String },
            },
          },
        ],
      },
    ],
    status: {
      type: String,
      enum: ["Active", "Completed", "Archived"],
      default: "Active",
    },
    advancedRecommendations: [
      {
        type: {
          type: String,
          enum: ["Seasonal", "Location-based", "Dynamic"],
          required: true,
        },
        data: Schema.Types.Mixed, // Store additional data specific to the recommendation type
      },
    ],
    
    createdAt: {
      type: Date,
      default: Date.now,
    },
  },
  { timestamps: true }
);

export const Meal = mongoose.model("Meal", mealSchema);
