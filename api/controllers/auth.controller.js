import bcrypt from "bcrypt";
import prisma from "../lib/prisma.js";
export const register = async (req, res) => {
  const { username, email, password } = req.body;
  try {
    const hashedPassword = await bcrypt.hash(password, 10);
    console.log(hashedPassword);

    const newUser = await prisma.user.create({
      data: {
        username,
        email,
        password: hashedPassword,
      },
    });
    console.log(newUser);
    res.status(201).json({ message: "User created successfully" });
  } catch (error) {
      console.log(error);
      res.status(500).json({ message: "Failed to create user" });
  }
};

export const login =async (req, res) => {
    const { username, password } = req.body;
    try {
        const user = await prisma.user.findUnique({ where: { username } })
        if (!user) {
             return res.status(401).json({message:"Invalid credentials"});
        }
        const isPasswordValid = await bcrypt.compare(password, user.password)
        if (!isPasswordValid) {
            return res.status(401).json({ message: "Invalid credentials" });
        }
        const age = 1000 * 60 * 60 * 24 * 7;
        res.cookie("test2", "myValue2", {
            httpOnly: true,
            maxAge: age

           
       }).status(200).json({ message: 'login successful'})
        //res.setHeader("Set-Cookie","test="+"myValue").json({message:"success"})
    }
    catch {
        console.log(err);
        res.status(500).json({ message: "Failed to login user" });
    }
};

export const logout = (req, res) => {};
