import Q from "../config/db.js"
import { v4 as uid } from 'uuid';

export const signup = async (req, res) => {

    try {

        const {fullName, username, email, password, cnicNo} = req.body;

        const user_id = uid();

        try {
            await Q.begin(async (sqlTx) => {

                await sqlTx`
                INSERT INTO users (id, full_name, username, email, password)
                VALUES (${user_id}, ${fullName}, ${username}, ${email}, ${password})
                `;

                await sqlTx`
                INSERT INTO pending_users (id, cnic_no)
                VALUES (${cnicNo}, ${cnicNo})
                `;

            });

            res.status(201).json({ message: "User registered and pending verification", user_id });

        } catch (error) {
            console.error("Transaction error:", error);
            res.status(500).json({ error: "Internal Server Error" });
        }
        
    } catch (error) {
        console.log("ERROR: ", error);
        res.status(500).json({ error: "Internal Server Error" });
    }

}

export const login = async (req, res) =>{

    try{
        const {username, password} = req.body;
        

    } catch (error) {
        console.log("ERROR: ", error);
        res.status(500).json({ error: "Internal Server Error" });
    }

}