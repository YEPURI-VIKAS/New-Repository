"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.signJwt = signJwt;
exports.verifyJwt = verifyJwt;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
function signJwt(payload, opts) {
    const options = { expiresIn: opts.expiresIn };
    return jsonwebtoken_1.default.sign(payload, opts.secret, options);
}
function verifyJwt(token, opts) {
    return jsonwebtoken_1.default.verify(token, opts.secret);
}
//# sourceMappingURL=jwt.js.map