const calculateScore = (score, count, reqBodyScore) => {
    if (score === -1) {
        // if the book hasn't been scored before, equate the overall score to the new score given by the user
        score = reqBodyScore;
        count++;
    } else {
        score = (score * count + reqBodyScore) / (count + 1); // (sum of all the previos scoures + new score) / prev count + 1
        count++;
    }

    return { bookScore: score, bookReaderCount: count };
};

module.exports = { calculateScore };
