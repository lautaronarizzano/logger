import mongoose from 'mongoose'
import aggregatePaginate from 'mongoose-aggregate-paginate-v2'

const userCollection = 'users'

const userSchema = new mongoose.Schema({
    first_name: {
        type:String,
        required: true
    },
    last_name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    age: {
        type: Number,
    },
    password: {
        type: String,
        required:true
    },
    carts: {
        type: [
            {
                cart: {
                    type: mongoose.Schema.Types.ObjectId,
                    ref:'carts'
                }
            }
        ],
        default: []
    },
    rol: {
        type: String,
        required: true,
        default: 'user'
    }
})

// studentsSchema.plugin(aggregatePaginate)

userSchema.pre('find', function() {
    this.populate('carts.cart')
})

const userModel = mongoose.model(userCollection, userSchema)

export default userModel