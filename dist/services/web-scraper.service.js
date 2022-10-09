import { JSDOM as JsDom } from "jsdom";
import fetch from "node-fetch";
const fetchRating = async (fideId) => {
    try {
        const response = await fetch(`https://ratings.fide.com/profile/${fideId}`);
        const html = await response.text();
        const rating = new JsDom(html)
            .window
            .document
            .body
            .querySelector(".profile-top-rating-data.profile-top-rating-data_gray > span")
            ?.nextSibling
            ?.textContent;
        return parseInt(rating);
    }
    catch (error) {
        return 0;
    }
};
export default {
    fetchRating
};
