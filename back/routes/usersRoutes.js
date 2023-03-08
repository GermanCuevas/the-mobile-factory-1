const express = require("express")
const userRouter = express.Router()
const { generateToken } = require("../config/token")
const { Customer } = require("../models/index")
const { validateUser } = require("../middleware/auth")

userRouter.post("/register", (req, res) => {
    const { email } = req.body;
    Customer.findOrCreate({
        where: {
            email: email,
        },
        defaults: {
            ...req.body,
        },
    })
        .then(([user, created]) => {
            if (!created) return res.send(409)
            console.log(user);
            res.status(201).send(user);
        })
        .catch(console.log);
});

userRouter.post("/login", (req, res) => {
    const { email, password } = req.body;
    Customer.findOne({
        where: {
            email: email,
        },
    })
        .then((user) => {
            if (!user) return res.send(404);
            console.log(user);
            let { email, name, lastName, id } = user;
            user.validatePassword(password).then((valid) => {
                if (!valid) {
                    return res.send(401);
                } else {
                    let token = generateToken({ email, name, lastName, id });
                    return res.cookie("token", token).send(user);
                }
            });
        })
        .catch(() => console.log("error"));
});

userRouter.post("/logout", (req, res, next) => {
    res.clearCookie("token").sendStatus(204);
});


/* User.put("/:id", (req, res, next) => {
    const { id } = req.params;
   Customer.findOne({ where: { id } })
      .then((user) => {
        let userToUpdate = user;
        User.update(
          {
           name: req.body.name,
            address: req.body.address,
          },
          {
            where: {
              name: userToUpdate.name,
              address: userToUpdate.content,
            },
          }
        );
      })
      .then((result) => res.status(200).send(req.body));
  }); */

userRouter.put("/:id", (req, res) => {
    Customer.update(req.body, { where: { id }, returning: true }).then(([rowsAffected, user]) => {
        if (!user) {
            res.status(404).send("User not found")
        }
        const userUpdate = user[0]
        res.send(userUpdate);
    }).catch(console.log)
})

userRouter.get("/me", validateUser, (req, res) => {
    res.send(req.user);
});