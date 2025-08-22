import Q from "../config/db.js"
import bcrypt from "bcryptjs";
import { generateToken } from "../lib/utils.js";
import { v4 as uid } from 'uuid';


export const signup = async (req, res) => {

    try {

        const {fullName, username, email, password, cnicNo} = req.body;

        const normalizedUsername = username.toLowerCase();
        const normalizedEmail = email.toLowerCase();

        if (!fullName || !username || !email || !password || !cnicNo) {
        return res.status(400).json({ success: false , message: "One or more feilds empty."});
        }

        const [result] = await Q`
            SELECT (
                EXISTS (SELECT 1 FROM users WHERE cnic = ${cnicNo})
                OR
                EXISTS (SELECT 1 FROM pending_users WHERE cnic_no = ${cnicNo})
            ) AS cnic_exists
        `;

        if (result?.cnic_exists) {
        return res.status(400).json({ success: false ,  message: "Cnic already exists", error_status: "duplicate_cnic" });
        }

        const [existingUsername] = await Q`
            SELECT username
            FROM users
            WHERE username = ${normalizedUsername}
            LIMIT 1
        `;

        if (existingUsername) {
        return res.status(400).json({ success: false , message: "Username already exists", error_status: "duplicate_username" });
        }

        // Check email
        const [existingEmail] = await Q`
            SELECT username
            FROM users
            WHERE email = ${normalizedEmail}
            LIMIT 1
        `;

        if (existingEmail) {
        return res.status(400).json({ success: false , message: "Email already exists", error_status: "duplicate_email" });
        }

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        try {
            await Q.begin(async (sqlTx) => {

                await sqlTx`
                INSERT INTO users (full_name, username, email, password, cnic)
                VALUES (${fullName}, ${normalizedUsername}, ${normalizedEmail}, ${hashedPassword}, ${cnicNo})
                `;

                await sqlTx`
                INSERT INTO pending_users (username, cnic_no)
                VALUES (${normalizedUsername}, ${cnicNo})
                `;

            });

            res.status(201).json({ success: true , message: "User registered and pending verification"});

        } catch (error) {
            console.error("Transaction error:", error);
            res.status(500).json({ success: false , message: "Internal Server Error" });
        }
        
    } catch (error) {
        console.log("ERROR: ", error);
        res.status(500).json({ success: false , message: "Internal Server Error" });
    }

}

export const login = async (req, res) =>{

    try{
        const {username, password} = req.body;

        if (!username || !password) {
            return res.status(400).json({ success: false , message: "One or more feild empty" });
        }

        const normalizedUsername = username.toLowerCase();

        const [user] = await Q`
            SELECT username, full_name, email, password, profile_image,
            blocked_users, blocked_by, rating, pacts_fulfilled,
            created_at, status
            FROM users
            WHERE username = ${normalizedUsername}
            LIMIT 1
        `;

        if (!user) {
        return res.status(400).json({ success: false , message: "Invalid credentials" });
        }


        const isPasswordCorrect = await bcrypt.compare(password, user.password);

        if (!isPasswordCorrect) {
        return res.status(400).json({ success: false , message: "Invalid credentials" });
        }

        delete user.password; // a little overkill on the security maybe

        switch (user.status) {
            case "active":
                // proceed with login
                generateToken(user.username, res);
                return res.status(200).json({
                username: user.username,
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
                return res.status(403).json({ success: false , message: "Account is disabled. Contact support.", error_status: "disabled" });

            case "pending":
                return res.status(403).json({ success: false , message: "Account pending approval.", error_status: "pending" });

            default:
                return res.status(400).json({ success: false , message: "Invalid account status" });
        }

    } catch (error) {
        console.log("ERROR: ", error);
        res.status(500).json({ success: false , message: "Internal Server Error" });
    }

}

export const check = async (req, res) =>{

    try {
        res.status(200).json(req.user);
    } catch (error) {
        console.log("Error in checkAuth controller", error.message);
        res.status(500).json({ success: false , message: "Internal Server Error" });
    }

}

export const logout = (req, res) => {
  try {

    const token = req.cookies.jwt;
        
    if(!token){
        return res.status(401).json({ success: false , message:"Who the hell are you to be logging out?! Like dying without ever being born"})
    }

    res.cookie("jwt", "", {
      httpOnly: true,
      secure: process.env.NODE_ENV !== "development",
      sameSite: "strict",
      maxAge: 0
    });
    res.status(200).json({ success: true , message: "Logged out successfully" });
  } catch (error) {
    console.log("Error in logout controller", error.message);
    res.status(500).json({ success: false , message: "Internal Server Error" });
  }
};