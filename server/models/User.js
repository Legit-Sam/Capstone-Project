const mongoose = require("mongoose")

const profileSchema = new mongoose.Schema({
    name:{
        type: String, required: true
    },
     bio:{
        type: String, required: true
    },
     skills:{
        type: [String],  default:[]
    },
     goals:{
        type: String, required: true
    },
    industry: {
        type: String
    }
})

const userSchema = new mongoose.Schema({
    email: {
        type: String, required: true, unique: true
    }, 
    password: {
        type: String,
        required: true
    },
    role: {
        type: String,
        enum: [
            "ADMIN",
            "MENTOR",
            "MENTEE"
        ],
        default: "MENTEE"
    },

    profile: {type: profileSchema},
    creadtedAt: {
        type: Date, default: Date.now
    },
     updatedAt: {
        type: Date, default: Date.now
    }
});

userSchema.pre("save", function (next) {
    this.updatedAt = Date.now();
    next();
})

module.exports = mongoose.model("User", userSchema)