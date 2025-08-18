import Q from "../config/db.js"
import { v4 as uid } from 'uuid';

export const searchPact = async (req, res) =>{

    const {pactId} = req.query;

    try {

        if (!pactId || pactId.trim() === "") {
        return res.status(400).json({ message: "PactId is required" });
        }

        // --- Dummy check (replace with real DB query later) ---
            if (pactId === "12345") {
            return res.status(200).json({
                success: true,
                message: "Pact found!",
                pact: { id: "12345", name: "Test Pact", status: "Active" },
            });
            } else {
            return res.status(404).json({
                success: false,
                message: "Pact not found",
            });
        }
    } catch (error) {
        console.log("Error in searchPact controller: ", error);
        res.status(500).json({ message: "Internal Server Error" });
    }

}

export const makePact = async (req, res) => {

    try {
        const {title, conditions, to, from} = req.body;

        if (!title?.trim() || !from || !to || !to.length) {
        return res.status(400).json({ message: "All fields must be filled" });
        }
        
        const pactId = uid();

        const result = await Q`
        INSERT INTO pacts (id, title, conditions, "from", "to", requested)
        VALUES (${pactId}, ${title}, ${conditions}, ${from}, ${to}, true)
        `;

        if(!result){
            console.log("Error in MakePact query: ", error);
            res.status(500).json({ message: "Error in query for makePact", success: "false" });
        }
        

        res.status(201).json({ message: "Pact made.", success: "true"});

    } catch (error) {
        console.log("Error in MakePact controller: ", error);
        res.status(500).json({ message: "Internal Server Error", success: "false" });
    }

}
