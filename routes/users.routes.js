const { Router } = require('express');
const User = require('../models/User');
const { validationResult, check } = require('express-validator');
const bCript = require('bcrypt')



const router = Router();
router.get('/',
    (req, res) => {
        User.find({}, (error, docs) => {
            res.json({ users: docs })
            if (error) {
                res.status(400).json({ message: 'Не удалось загрузить пользователей' })
            }
        })



    })
router.delete(`/`,
    (req, res) => {
        const { id } = req.body;
        User.deleteOne({ _id: id }, function (err) {
            if (err) {
                res.status(400).json({ message: "Не удалось удалить пользователя" })
            } else {
                res.status(201).json({ message: 'Пользователь удален' })
            }
        })
    })

router.put(`/change/:id`,
    [
        check('email', 'Некорректный email').isEmail(),
        check('username', 'Минимальная длина имени 3 символа').isLength({ min: 3 }),
        check('password', 'Минимальная длина пароля 6 символов')
            .isLength({ min: 6 })
    ],
    async (req, res) => {
        const errors = validationResult(req)
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array(), message: 'Некорректный данные при регистрации' });
        }

        try {
            const { email, username, password, activeId } = req.body;
            const candidate = await User.find({ email });
            if (candidate.length !== 1) {
                return res.status(400).json({ message: 'Такой пользователь уже существует' })
            }
            const hashedPassword = await bCript.hash(password, 12)

            await User.findByIdAndUpdate({ _id: activeId }, { username, email, password: hashedPassword }, {
                useFindAndModify: false
            })


            res.status(201).json({ message: 'Пользователь изменен' })
        } catch (e) {
            res.status(500).json({ message: 'Что-то пошло не так, попробуйте снова' })
        }


    })
module.exports = router