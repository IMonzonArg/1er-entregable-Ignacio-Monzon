import { Strategy as JwtStrategy, ExtractJwt }  from "passport-jwt";
import { userModel } from '../../../models/user.js'

const cookieExtractor = req => {
    const token = req.cookies ? req.cookies.jwtCookie : {}
    console.log(token)
    return token
}

const jwtOptions = {
    jwtFromRequest: ExtractJwt.fromExtractors([cookieExtractor]),
    //jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
    //jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
    secretOrKey: "coderhouse"
}

export const strategyJWT = new JwtStrategy(jwtOptions, async (payload, done) =>{
    try {
        const user = await userModel.findById(payload.user._id)
        if(!user) {
        return done(null,false)
        }
        return done(null, user)
    } catch (e) {
        done(e,null)
    }
})

