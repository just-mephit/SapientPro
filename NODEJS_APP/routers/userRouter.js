const {Router} = require("express");
const {check, validationResult} = require("express-validator");
const ErrorHandler = require("./Handlers/ErrorHandler");
const GenerateId = require("./Handlers/GenerateId");
const fsJSON = require("./Handlers/fsJSON");
const router = Router();


router.post(
    "/create",
    [
        check('firstName')
            .isLength({min: 3})
            .withMessage('firstName must be at least 3 chars long')
            .matches(/\w+/i)
            .withMessage('firstName must contain only words')
            .trim()
            .escape(),
        check('lastName')
            .isLength({min: 3})
            .withMessage('lastName must be at least 3 chars long')
            .matches(/\w+/i)
            .withMessage('lastName must contain only words')
            .trim()
            .escape(),
        check('birthday')
            .isDate()
            .withMessage('birthday must be format YYYY-MM-DD')
    ],
    async (req, res) => {
        try {
            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                return res.status(422).json({message: errors.array()[0].msg});
            }

            const {firstName, lastName, birthday} = req.body;

            const userData = await fsJSON.read('user');

            let id = GenerateId(Object.keys(userData));

            userData[id] = {id, firstName, lastName, birthday};

            await fsJSON.write('user', userData);

            return res.status(201).json({message: "Successful", user: userData[id]});
        } catch (e) { ErrorHandler(e, res) }
    }
);


router.get("/read", async (req, res) => {
    try {
        const userData = await fsJSON.read('user');

        return res.status(200).json({userData: Object.values(userData)});
    } catch (e) { ErrorHandler(e, res) }
});

router.get(
    "/read/:id",
    check('id').matches(/\d+/).withMessage('id must contain only numbers'),
    async (req, res) => {
        try {
            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                return res.status(422).json({message: errors.array()[0].msg});
            }

            const {id} = req.params;

            const userData = await fsJSON.read('user');

            if (!userData[id]) {
                return res.status(400).json({message: "Wrong id"});
            }

            return res.status(200).json(userData?.[id]);
        } catch (e) { ErrorHandler(e, res) }
    }
);

router.delete("/delete", async (req, res) => {
    try {
        await fsJSON.write('user', {});
        await fsJSON.write('address', {});

        return res.status(200).json({message: 'Successful'});
    } catch (e) { ErrorHandler(e, res) }
});

router.delete(
    "/delete/:id",
    check('id').matches(/\d+/).withMessage('id must contain only numbers'),
    async (req, res) => {
        try {
            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                return res.status(422).json({message: errors.array()[0].msg});
            }

            const userData = await fsJSON.read('user');

            const {id} = req.params;

            if (!userData[id]) {
                return res.status(400).json({message: "Wrong id"});
            }

            const addressData = await fsJSON.read('address');

            const notPopulatedAddress = {};

            Object.keys(addressData).map(addressId => {
                if (String(addressData[addressId].userId) !== id) {
                    notPopulatedAddress[addressId] = addressData[addressId];
                }
            });

            delete userData[id];

            await fsJSON.write('user', userData);
            await fsJSON.write('address', notPopulatedAddress);

            return res.status(200).json({message: 'Successful'});
        } catch (e) { ErrorHandler(e, res) }
    }
);

router.post("/update/:id",
    [
        check('id')
            .matches(/\d+/)
            .withMessage('id must contain only numbers'),
        check('firstName')
            .optional()
            .isLength({min: 3})
            .withMessage('firstName must be at least 3 chars long')
            .matches(/\w+/i)
            .withMessage('firstName must contain only words')
            .trim()
            .escape(),
        check('lastName')
            .optional()
            .isLength({min: 3})
            .withMessage('lastName must be at least 3 chars long')
            .matches(/\w+/i)
            .withMessage('lastName must contain only words')
            .trim()
            .escape(),
        check('birthday')
            .optional()
            .isDate()
            .withMessage('birthday must be format YYYY-MM-DD')
    ],
    async (req, res) => {
        try {
            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                return res.status(422).json({message: errors.array()[0].msg});
            }

            const {id} = req.params;
            const user = req.body;

            const userData = await fsJSON.read('user');

            if (!userData[id]) {
                return res.status(400).json({message: "Wrong id"});
            }

            userData[id] = {
                id: Number(id),
                firstName: user.firstName || userData[id].firstName,
                lastName: user.lastName || userData[id].lastName,
                birthday: user.birthday || userData[id].birthday,
            };

            await fsJSON.write('user', userData);

            return res.status(200).json({message: "Successful"});
        } catch (e) { ErrorHandler(e, res) }
    }
);

module.exports = router;
