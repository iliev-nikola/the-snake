const utils = (function () {
  const getById = (id) => {
    return document.getElementById(id);
  };

  const randomize = (n) => {
    return Math.floor(Math.random() * n);
  };

  const getBestScore = () => {
    return JSON.parse(localStorage.getItem('snake')).bestScore;
  };

  const setBestScore = (score) => {
    localStorage.setItem('snake', JSON.stringify({ bestScore: score }));
  };

  const getTouches = (event) => {
    return event.touches || event.originalEvent.touches;
  };
  
  return {
    getById,
    randomize,
    getBestScore,
    setBestScore,
    getTouches
  }
})();