import Q from "../config/db.js"
import bcrypt from "bcryptjs";
import { generateToken } from "../lib/utils.js";
import { v4 as uid } from 'uuid';


export const signup = async (req, res) => {

    try {

        const {fullName, username, email, password, cnicNo} = req.body;

        const normalizedUsername = username.toLowerCase();
        const normalizedEmail = email.toLowerCase();

        const [existingUsername] = await Q`
            SELECT id
            FROM users
            WHERE username = ${normalizedUsername}
            LIMIT 1
        `;

        if (existingUsername) {
        return res.status(400).json({ message: "Username already exists", status: "duplicate_username" });
        }

        // Check email
        const [existingEmail] = await Q`
            SELECT id
            FROM users
            WHERE email = ${normalizedEmail}
            LIMIT 1
        `;

        if (existingEmail) {
        return res.status(400).json({ message: "Email already exists", status: "duplicate_email" });
        }

        const user_id = uid();

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        try {
            await Q.begin(async (sqlTx) => {

                await sqlTx`
                INSERT INTO users (id, full_name, username, email, password)
                VALUES (${user_id}, ${fullName}, ${normalizedUsername}, ${normalizedEmail}, ${hashedPassword})
                `;

                await sqlTx`
                INSERT INTO pending_users (id, cnic_no)
                VALUES (${user_id}, ${cnicNo})
                `;

            });

            res.status(201).json({ message: "User registered and pending verification", user_id });

        } catch (error) {
            console.error("Transaction error:", error);
            res.status(500).json({ message: "Internal Server Error" });
        }
        
    } catch (error) {
        console.log("ERROR: ", error);
        res.status(500).json({ message: "Internal Server Error" });
    }

}

export const login = async (req, res) =>{

    try{
        const {username, password} = req.body;

        const normalizedUsername = username.toLowerCase();

        if (!password) {
            return res.status(400).json({ message: "Invalid credentials" });
        }

        const [user] = await Q`
            SELECT *
            FROM users
            WHERE username = ${normalizedUsername}
            LIMIT 1
        `;

        if (!user) {
        return res.status(400).json({ message: "Invalid credentials" });
        }


        const isPasswordCorrect = await bcrypt.compare(password, user.password);

        if (!isPasswordCorrect) {
        return res.status(400).json({ message: "Invalid credentials" });
        }

        switch (user.status) {
            case "active":
                // proceed with login
                generateToken(user.id, res);
                return res.status(200).json({
                id: user.id,
                fullName: user.full_name,
                email: user.email,
                profilePic: user.profile_image,
                blockedUsers: user.blocked_users,
                blockedBy: user.blocked_by,
                rating: user.rating,
                pacts_fulfilled: user.pacts_fulfilled,
                created_at: user.created_at
                });

            case "disabled":
                return res.status(403).json({ message: "Account is disabled. Contact support.", status: "disabled" });

            case "pending":
                return res.status(403).json({ message: "Account pending approval.", status: "pending" });

            default:
                return res.status(400).json({ message: "Invalid account status" });
        }

    } catch (error) {
        console.log("ERROR: ", error);
        res.status(500).json({ message: "Internal Server Error" });
    }

}

export const check = async (req, res) =>{

    try {
        res.status(200).json(req.user);
    } catch (error) {
        console.log("Error in checkAuth controller", error.message);
        res.status(500).json({ message: "Internal Server Error" });
    }

}