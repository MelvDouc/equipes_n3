import { Router } from "express";
export default class Controller {
}
Controller.Get = httpDecorator("GET");
Controller.Post = httpDecorator("POST");
Controller.Put = httpDecorator("PUT");
Controller.Patch = httpDecorator("PATCH");
Controller.Delete = httpDecorator("DELETE");
Controller.Middleware = (target, propName, descriptor) => {
    target.router ?? (target.router = Router());
    target.router.use(descriptor.value.bind(target));
};
function httpDecorator(method) {
    return (path) => {
        return (target, propName, descriptor) => {
            target.router ?? (target.router = Router());
            const handler = descriptor.value.bind(target);
            switch (method) {
                case "GET":
                    target.router.get(path, handler);
                    break;
                case "POST":
                    target.router.post(path, handler);
                    break;
                case "PUT":
                    target.router.put(path, handler);
                    break;
                case "PATCH":
                    target.router.patch(path, handler);
                    break;
                case "DELETE":
                    target.router.delete(path, handler);
                    break;
            }
        };
    };
}
