"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthValidation = void 0;
const zod_1 = require("zod");
const registerValidationSchema = zod_1.z.object({
    body: zod_1.z.object({
        username: zod_1.z.string().optional(),
        name: zod_1.z.string({
            required_error: 'Name is required',
        }),
        email: zod_1.z
            .string({
            required_error: 'Email is required',
        })
            .email('Invalid email format'),
        password: zod_1.z.string({ required_error: 'Password is required' }),
        mobileNumber: zod_1.z.string().optional(),
        profilePhoto: zod_1.z.string().optional(),
    }),
});
const loginValidationSchema = zod_1.z.object({
    body: zod_1.z.object({
        email: zod_1.z.string({
            required_error: 'Email is required',
        }),
        password: zod_1.z.string({ required_error: 'Password is required' }),
    }),
});
exports.AuthValidation = {
    registerValidationSchema,
    loginValidationSchema,
};
