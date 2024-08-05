import passport from 'passport';
import local from 'passport-local';
import { Strategy as JwtStrategy, ExtractJwt } from 'passport-jwt';
import GithubStrategy from 'passport-github2';
import { userModel } from "../../models/user.js";
import { createHash, validatePassword } from '../../utils/bcrypt.js';
import dotenv from 'dotenv';

dotenv.config();

const localStrategy = local.Strategy;

const initializePassport = () => {
    // Estrategia de registro local
    passport.use('register', new localStrategy({ passReqToCallback: true, usernameField: 'email' }, async(req, username, password, done) => {
        try {
            const { first_name, last_name, age, email } = req.body;
            const findUser = await userModel.findOne({ email: email });
            if (findUser) {
                return done(null, false);
            } else {
                const user = await userModel.create({
                    first_name: first_name,
                    last_name: last_name,
                    password: createHash(password),
                    age: age,
                    email: email
                });
                return done(null, user);
            }
        } catch (e) {
            return done(e);
        }
    }));

    // Estrategia de login local
    passport.use('login', new localStrategy({ usernameField: 'email' }, async(username, password, done) => {
        try {
            const user = await userModel.findOne({ email: username });
            if (user && validatePassword(password, user.password)) {
                user.last_connection = new Date();
                await user.save();
                return done(null, user);
            } else {
                return done(null, false);
            }
        } catch (e) {
            return done(e);
        }
    }));

    // Estrategia JWT
    const cookieExtractor = req => {
        let token = null;
        if (req && req.cookies) {
            token = req.cookies['jwtCookie'];
        }
        return token;
    };

    const opts = {
        jwtFromRequest: ExtractJwt.fromExtractors([cookieExtractor]),
        secretOrKey: process.env.JWT_SECRET
    };

    passport.use(new JwtStrategy(opts, async (jwt_payload, done) => {
        try {
            const user = await userModel.findById(jwt_payload.id);
            if (user) {
                return done(null, user);
            } else {
                return done(null, false);
            }
        } catch (err) {
            return done(err, false);
        }
    }));

    // Estrategia de Github
    passport.use('github', new GithubStrategy({
        clientID: process.env.GITHUB_CLIENT_ID,
        clientSecret: process.env.GITHUB_CLIENT_SECRET,
        callbackURL: "http://localhost:8080/api/session/githubSession"
    }, async (accessToken, refreshToken, profile, done) => {
        try {
            const user = await userModel.findOne({ email: profile._json.email }).lean();
            if (user) {
                done(null, user);
            } else {
                const userCreated = await userModel.create({
                    first_name: profile._json.name,
                    last_name: ' ',
                    email: profile._json.email,
                    age: 18,
                    password: createHash(profile._json.name)
                });
                return done(null, userCreated);
            }
        } catch (error) {
            return done(error);
        }
    }));

    passport.serializeUser((user, done) => {
        done(null, user._id);
    });

    passport.deserializeUser(async (id, done) => {
        try {
            const user = await userModel.findById(id);
            done(null, user);
        } catch (e) {
            done(e, null);
        }
    });
}

export default initializePassport;
