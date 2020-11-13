const randomGif = (gifs) => {
    return gifs[Math.floor(Math.random() * gifs.length)];
}

module.exports = {
    randomGif,
}