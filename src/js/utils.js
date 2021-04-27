const utils = (function () {
    function getById(id) {
        return document.getElementById(id);
    }

    function randomize(n) {
        return Math.floor(Math.random() * n);
    }

    function getBestScore() {
        return JSON.parse(localStorage.getItem('snake')).bestScore;
    }

    function setBestScore(score) {
        localStorage.setItem('snake', JSON.stringify({ bestScore: score }));
    }
    return {
        getById,
        randomize,
        getBestScore,
        setBestScore
    }
})();