import Q from "../config/db.js"

export const checkUsername = async (req, res) => {
 try{
        const [username] = req.body;
        const normalizedUsername = username.toLowerCase();

        const [existingUsername] = await Q`
                    SELECT username
                    FROM users
                    WHERE username = ${normalizedUsername}
                    LIMIT 1
                `;

        if (existingUsername) {
            return res.status(400).json({ success: true , message: "Username already exists", error_status: "username_exists" });
        }

    } catch (error) {
        console.log("ERROR: ", error);
        res.status(500).json({ success: false , message: "Internal Server Error" });
    }
}

export const checkEmail = async (req, res) => {
    try{
        const [email] = req.body;
        const normalizedEmail = email.toLowerCase();

        const [existingEmail] = await Q`
            SELECT username
            FROM users
            WHERE email = ${normalizedEmail}
            LIMIT 1
        `;

        if (existingEmail) {
            return res.status(400).json({ success: true , message: "Email already exists", error_status: "email_exists" });
        }
    } catch (error){
        console.log("ERROR: ", error);
        res.status(500).json({ success: false , message: "Internal Server Error" });
    }
}