// checking if the user's score is between 1 and 10 or not
const validateScore = (req, res, next) => {
    if (!(req.body.score > 0 && req.body.score <= 10)) {
        return res.status(404).send({ msg: `Score must be between 1 and 10` });
    }

    next();
};

module.exports = { validateScore };
