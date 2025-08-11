const JwtStretegy = require('passport-jwt').Strategy;
const ExtractJwt = require('passport-jwt').ExtractJwt;
require('dotenv').config();
const cookieExtractor = req => req.cookies?.token || null;

const opts = {
    jwtFromRequest: cookieExtractor,
    secretOrKey: process.env.SECRET_KEY
};


const strategy = new JwtStretegy(opts, (jwt_payload, done) => {
    if (jwt_payload.student_id) {
        return done(null, jwt_payload);
    } else {
        return done(null, false);
    }
});


module.exports = (passport) => {
    passport.use(strategy);
}

