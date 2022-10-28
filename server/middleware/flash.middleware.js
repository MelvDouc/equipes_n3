const setFlash = (req, res, next) => {
    ["success", "errors"].forEach(key => {
        const value = req.flash(key);
        key ? (res.locals[key] = value) : (delete res.locals[key]);
    });
    next();
};
export default setFlash;
