import { app } from "../server";
import {
    productRouter,
    cartRouter,
    viewsRouter,
    sessionRouter,
} from "../routes";

export const routes = (): void => {
    app.use("/api/products", productRouter);
    app.use("/api/carts", cartRouter);
    app.use("/views", viewsRouter);
    app.use("/api/sessions", sessionRouter);
};
