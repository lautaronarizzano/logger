import mongoose from 'mongoose'

const newPasswordCollection = 'newPassword'

const newPasswordSchema = new mongoose.Schema({
    user_id:String,
    token: String
})



const newPasswordModel = mongoose.model(newPasswordCollection, newPasswordSchema)

export default newPasswordModel