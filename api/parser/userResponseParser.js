const { User } = require("../models/User");

exports.userResponseParser = (user) =>{
    return {
        id:user.id,
        email:user.email,
        firstname:user.firstname,
        lastname : user.lastname,
        contact : user.contact
    }
}