export var Roles;
(function (Roles) {
    Roles[Roles["SUPER_ADMIN"] = 0] = "SUPER_ADMIN";
    Roles[Roles["ADMIN"] = 1] = "ADMIN";
    Roles[Roles["JOUEUR"] = 2] = "JOUEUR";
})(Roles || (Roles = {}));
export function getAllowedRoles(role) {
    return Object.keys(Roles).reduce((acc, key) => {
        const index = +key;
        if (!isNaN(index) && index >= role)
            acc.push([index, Roles[index]]);
        return acc;
    }, []);
}
