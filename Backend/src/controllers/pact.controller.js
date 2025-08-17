import Q from "../config/db.js"

export const searchPact = async (req, res) =>{

    try {

        const {pactId} = req.body;

        res.status(200).json(req.user);
    } catch (error) {
        console.log("Error in searchPact controller", error.message);
        res.status(500).json({ message: "Internal Server Error" });
    }

}
