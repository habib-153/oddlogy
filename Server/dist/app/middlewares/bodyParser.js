"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.parseBody = void 0;
/* eslint-disable no-unused-vars */
const AppError_1 = __importDefault(require("../errors/AppError"));
const catchAsync_1 = require("../utils/catchAsync");
exports.parseBody = (0, catchAsync_1.catchAsync)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        // If body has a 'data' field, parse it
        if (req.body.data) {
            if (typeof req.body.data === 'string') {
                req.body = Object.assign(Object.assign({}, req.body), JSON.parse(req.body.data));
                delete req.body.data;
            }
        }
        // If no 'data' field but body exists, use it as is
        next();
    }
    catch (error) {
        throw new AppError_1.default(400, 'Invalid JSON in data field');
    }
}));
