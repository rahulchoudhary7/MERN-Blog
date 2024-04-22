import jwt from 'jsonwebtoken'

import { errorHandler } from './error.js'

export const verifyToken = (req, res, next) => {
    const token = req.cookies.accessToken

    if (!token) {
        return next(errorHandler(401, 'Unauthorized, no access token'))
    }

    jwt.verify(token, process.env.JWT_SECRET, (error, user) => {
        if (error) {
            return next(
                errorHandler(401, 'Unauthorized, access token not valid'),
            )
        }

        req.user = user
        next()
    })
}
