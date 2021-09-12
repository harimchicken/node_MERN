
const { Strategy, ExtractJwt } = require('passport-jwt');
const userModel = require('../models/user')
const GooglePlusTokenStrategy = require('passport-google-plus-token');

const opts = {};
opts.jwtFromRequest = ExtractJwt.fromAuthHeaderAsBearerToken();
opts.secretOrKey = process.env.SECRET_KEY




module.exports = passport => {
    passport.use(
        new Strategy(opts, (jwt_payload, done) => {
            userModel
            .findById(jwt_payload.id)
            .then( user => {
                if (user) {
                    return done(null, user)
                }
                return done(null, false)
            })
            .catch(err => console.log(err))
        })
    )

    passport.use('googleToken', new GooglePlusTokenStrategy({
        clientID: "577312079351-qj4q1thubjflijv8spmiadfhnqs3aved.apps.googleusercontent.com",
        clientSecret: "ykPtF3NwRqpj0JP8bFAulDIS",
        callbackURL: "http://localhost:5000/callback"
    }, async (accessToken, refreshToken, profile, done) => {
        console.log("+++++++++++", profile)

        try {
            const existingUser = await userModel.findOne({"email" : profile.emails[0].value})
            if (existingUser) {
                return done(null, existingUser);
            }

            // 구글 계정이 DB에 없으면 저장
            const newUser = new userModel({
                source: "google",
                name: profile.displayName,
                email: profile.emails[0].value,
                password: profile.id,
                avatar: profile.photos[0].value
            })
            await newUser.save();

            done(null, newUser);

        } catch(error) {
            done(error, false, error.message);
        }
    }))
}