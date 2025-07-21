"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const auth_route_1 = require("../modules/Auth/auth.route");
const user_route_1 = require("../modules/User/user.route");
const profile_route_1 = require("../modules/Profile/profile.route");
const carousel_route_1 = require("../modules/carousel/carousel.route");
const instructor_routes_1 = require("../modules/instructor/instructor.routes");
const module_routes_1 = require("../modules/module/module.routes");
const course_routes_1 = require("../modules/course/course.routes");
const router = express_1.default.Router();
const moduleRoutes = [
    {
        path: '/auth',
        route: auth_route_1.AuthRoutes,
    },
    {
        path: '/users',
        route: user_route_1.UserRoutes,
    },
    {
        path: '/profile',
        route: profile_route_1.ProfileRoutes,
    },
    {
        path: '/feature-image',
        route: carousel_route_1.CarouselRoutes,
    },
    {
        path: '/instructors',
        route: instructor_routes_1.InstructorRoutes,
    },
    {
        path: '/modules',
        route: module_routes_1.ModuleRoutes,
    },
    {
        path: '/courses',
        route: course_routes_1.CourseRoutes,
    },
];
moduleRoutes.forEach((route) => router.use(route.path, route.route));
exports.default = router;
