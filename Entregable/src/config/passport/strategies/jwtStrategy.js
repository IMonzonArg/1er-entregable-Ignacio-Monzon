import { Strategy as JwtStrategy, ExtractJwt }  from "passport-jwt";
import { userModel } from '../../../models/user.js'

const jwtOptions = {
    jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
    secretOrKey: "coderhouse"
}

export const strategyJWT = new JwtStrategy(jwtOptions, async (payload, done) =>{
    const user = await userModel.findById(payload._id)
    if(!user) {
        return done(null,false)
    }
})

