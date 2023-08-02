import { notAuthenticError } from "../erros/notAuthenticError.js";

export function verifyUser (req) {
    if (!req.session.get('user')) {
        throw new notAuthenticError()
    }
}