const { Router } = require('express');
const { validationResult, check } = require('express-validator');
const bCript = require('bcrypt')

const User = require('../models/User');


const router = Router();
router.post('/register', [
    check('email', 'Некорректный email').isEmail(),
    check('username', 'Минимальная длина имени 3 символа').isLength({ min: 3 }),
    check('password', 'Минимальная длина пароля 6 символов')
        .isLength({ min: 6 })],
    async (req, res) => {
        try {
            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                return res.status(400).json({ errors: errors.array(),message: 'Некорректный данные при регистрации' });
            }

            const { email, username, password } = req.body
            const candidate = await User.findOne({ email });
            if (candidate) {
                return res.status(400).json({ message: 'Такой пользователь уже существует' })
            }
            
            const hashedPassword = await bCript.hash(password, 12)
            const user = new User({ email, password:hashedPassword, username })

            user.save()
            res.status(201).json({ message: 'Пользователь создан' })
        } catch (e) {
            res.status(500).json({ message: 'Что-то пошло не так, попробуйте снова' })
        }


    })
module.exports = router