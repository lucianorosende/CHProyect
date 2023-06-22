import Express, { Request, Response } from "express";
import { asyncHandler } from "../utils";
import { UserService } from "../DAO/services";
import session, { SessionData } from "express-session";

declare module "express-session" {
    export interface SessionData {
        email?: string;
        firstName?: string;
        lastName?: string;
        isAdmin?: boolean;
    }
}

declare module "express" {
    interface Request {
        session?: session.Session & Partial<SessionData>;
    }
}

const Service = new UserService();

export const sessionRouter = Express.Router();

sessionRouter.get("/login", (req: Request, res: Response) => {
    console.log(req.session);
    return res.render("login", {});
});
sessionRouter.get("/logout", (req: Request, res: Response) => {
    (req.session as any).destroy((err: any) => {
        if (err) {
            return console.log(err);
        }
        return res.redirect("/api/sessions/login");
    });
});

sessionRouter.get("/register", (req: Request, res: Response) => {
    return res.render("register", {});
});

sessionRouter.get("/profile", (req: Request, res: Response) => {
    const user = {
        email: (req.session as SessionData).email,
        isAdmin: (req.session as SessionData).isAdmin,
        firstName: (req.session as SessionData).firstName,
        lastName: (req.session as SessionData).lastName,
    };
    return res.render("profile", { user: user });
});

sessionRouter.post(
    "/register",
    asyncHandler(async (req: Request, res: Response) => {
        const CreateUser = await Service.createUser(req.body);
        (req.session as SessionData).email = req.body.Email;
        (req.session as SessionData).isAdmin = false;
        return res.redirect("/api/sessions/login");
    })
);

sessionRouter.post(
    "/login",
    asyncHandler(async (req: Request, res: Response) => {
        const CheckUser = await Service.checkUser(req.body);
        console.log(CheckUser);
        if (CheckUser && CheckUser.password == req.body.password) {
            (req.session as SessionData).email = CheckUser.email;
            (req.session as SessionData).firstName = CheckUser.firstName;
            (req.session as SessionData).lastName = CheckUser.lastName;
            (req.session as SessionData).isAdmin = CheckUser.isAdmin;
            return res.redirect("/views/products");
        }
    })
);
