const User = require('../models/User');

// for checking if a user with the same id exists or not
const validateUserId = async (req, res, next) => {
    try {
        let user = await User.findOne({ where: { id: req.params.userid } });

        if (!user) {
            return res
                .status(404)
                .send({ msg: `User with the given id doesn't exist` });
        }

        req.user = user;
        next();
    } catch (err) {
        res.status(500).send({ msg: err });
    }
};

module.exports = { validateUserId };
