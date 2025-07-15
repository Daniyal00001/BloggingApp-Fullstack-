const { validateToken } = require('../Service/Auth');

function checkForAuthenticationCookie(cookieName) {
    return (req, res, next) => {
        const tokenCookieValue = req.cookies[cookieName];
        console.log('🔍 Token Cookie Value:', tokenCookieValue);

        if (!tokenCookieValue) {
            // console.log('⛔ No token found.');
            return next();
        }

        try {
            const userPayload = validateToken(tokenCookieValue);
            req.user = userPayload;
            // console.log('✅ Token valid. req.user set to:', req.user);
        } catch (error) {
            // console.log('❌ Token verification failed:', error.message);
        }

        next();
    };
}

module.exports = { checkForAuthenticationCookie };
