const utils = (function () {
    function getById(id) {
        return document.getElementById(id);
    }

    function randomize(n) {
        return Math.floor(Math.random() * n);
    }

    return {
        getById,
        randomize
    }
})();