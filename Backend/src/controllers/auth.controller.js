import Q from "../config/db.js"


export const signup = async (req, res) => {

    try {

        res = await Q`INSERT INTO test (username, pass)
        VALUES (${'abc'}, ${'def'})
        RETURNING *`;
        console.log(res);
        
    } catch (error) {
        console.log("ERROR: ", error);
        res.status(500).json({ error: "Internal Server Error" });
    }

}