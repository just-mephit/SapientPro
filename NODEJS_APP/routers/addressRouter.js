const {Router} = require("express");
const {check, validationResult} = require("express-validator");
const ErrorHandler = require("./Handlers/ErrorHandler");
const GenerateId = require("./Handlers/GenerateId");
const fsJSON = require("./Handlers/fsJSON");
const router = Router();


router.post(
    "/create",
    [
        check('userId')
            .matches(/\d+/)
            .withMessage('userId must contain only numbers')
            .toInt(),
        check('country')
            .isString()
            .isLength({min: 3})
            .withMessage('country must be at least 3 chars long'),
        check('state')
            .isString()
            .isLength({min: 3})
            .withMessage('state must be at least 3 chars long'),
        check('city')
            .isString()
            .isLength({min: 3})
            .withMessage('city must be at least 3 chars long'),
        check('zipCode')
            .isPostalCode('US')
            .withMessage('Wrong zipCode'),
        check('address')
            .isString()
            .isLength({min: 3})
            .withMessage('address must be at least 3 chars long'),
    ],
    async (req, res) => {
        try {

            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                return res.status(422).json({message: errors.array()[0].msg});
            }

            const {userId, country, state, city, zipCode, address} = req.body;

            const addressData = await fsJSON.read('address');

            const userData = await fsJSON.read('user');

            if (!Object.keys(userData).includes(String(userId))) {
                return res.status(400).json({message: "userId is undefined"});
            }

            let id = GenerateId(Object.keys(addressData));

            addressData[id] = {id, userId, country, state, city, zipCode: String(zipCode), address};

            await fsJSON.write('address', addressData);

            return res.status(201).json({message: "Successful", address: addressData[id]});
        } catch (e) { ErrorHandler(e, res) }
    }
);


router.get("/read", async (req, res) => {
    try {
        const addressData = await fsJSON.read('address');

        return res.status(200).json({addressData: Object.values(addressData)});
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

            const addressData = await fsJSON.read('address');

            if (!addressData[id]) {
                return res.status(400).json({message: "Wrong id"});
            }

            return res.status(200).json(addressData?.[id]);
        } catch (e) { ErrorHandler(e, res) }
    }
);

router.delete("/delete", async (req, res) => {
    try {
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

            const addressData = await fsJSON.read('address');

            const {id} = req.params;

            if (!addressData[id]) {
                return res.status(400).json({message: "Wrong id"});
            }

            delete addressData[id];

            await fsJSON.write('address', addressData);

            return res.status(200).json({message: 'Successful'});
        } catch (e) { ErrorHandler(e, res) }
    }
);

router.post(
    "/update/:id",
    [
        check('id')
            .matches(/\d+/)
            .withMessage('id must contain only numbers'),
        check('userId')
            .optional()
            .matches(/\d+/)
            .withMessage('userId must contain only numbers')
            .toInt(),
        check('country')
            .optional()
            .isString()
            .isLength({min: 3})
            .withMessage('country must be at least 3 chars long'),
        check('state')
            .optional()
            .isString()
            .isLength({min: 3})
            .withMessage('state must be at least 3 chars long'),
        check('city')
            .optional()
            .isString()
            .isLength({min: 3})
            .withMessage('city must be at least 3 chars long'),
        check('zipCode')
            .optional()
            .isPostalCode('US')
            .withMessage('Wrong zipCode'),
        check('address')
            .optional()
            .isString()
            .isLength({min: 3})
            .withMessage('address must be at least 3 chars long'),
    ],
    async (req, res) => {
        try {
            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                return res.status(422).json({message: errors.array()[0].msg});
            }

            const {id} = req.params;
            const address = req.body;

            const addressData = await fsJSON.read('address');

            if (!addressData[id]) {
                return res.status(400).json({message: "Wrong id"});
            }

            addressData[id] = {
                id: Number(id),
                userId: address.userId || addressData[id].userId,
                country: address.country || addressData[id].country,
                state: address.state || addressData[id].state,
                city: address.city || addressData[id].city,
                zipCode: String(address.zipCode) || addressData[id].zipCode,
                address: address.address || addressData[id].address,
            };

            await fsJSON.write('address', addressData);

            return res.status(200).json({message: "Successful"});
        } catch (e) { ErrorHandler(e, res) }
    }
);

module.exports = router;
