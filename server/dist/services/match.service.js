const dateFormatter = new Intl.DateTimeFormat("fr-FR", {
    weekday: "long",
    day: "2-digit",
    month: "2-digit",
    year: "numeric"
});
export const formatDate = (dateString) => {
    return dateFormatter.format(new Date(dateString));
};
