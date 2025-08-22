import Q from "../config/db.js"
import { v4 as uid } from 'uuid';

export const searchPact = async (req, res) =>{

    const {pactId} = req.query;

    try {

        if (!pactId || pactId.trim() === "") {
        return res.status(400).json({ success: false , message: "PactId is required" });
        }

            const [result] = await Q`
            SELECT *
            FROM pacts
            WHERE id = ${pactId}
            LIMIT 1
            `;

            if (result) {
            return res.status(200).json({
                success: true,
                message: "Pact found!",
                pact: result,
            });
            } else {
            return res.status(404).json({
                success: false,
                message: "Pact not found",
            });
        }
    } catch (error) {
        console.log("Error in searchPact controller: ", error);
        res.status(500).json({ success: false , message: "Internal Server Error" });
    }

}

export const makePact = async (req, res) => {

    try {
        const {title, conditions, to, from} = req.body;

        if (!title?.trim() || !from || !to || !to.length) {
        return res.status(400).json({ success: false , message: "All fields must be filled" });
        }
        
        const pactId = uid();

        try {
            await Q.begin(async (sqlTx) => {

                await sqlTx`
                INSERT INTO pacts (id, title, conditions, "from", "to", requested)
                VALUES (${pactId}, ${title}, ${conditions}, ${from}, ${to}, true)
                `;

                await sqlTx`
                UPDATE users
                SET pacts_made = array_append(pacts_made, ${pactId})
                WHERE username = ${from}
                `;

                await sqlTx`
                UPDATE users
                SET pacts_received = array_append(pacts_received, ${pactId})
                WHERE username = ANY(${to}::text[]);
                `;

            });

            res.status(201).json({ success: true , id: pactId, message: "Pact made."});

        } catch (error) {
            console.log("Error in MakePact query: ", error);
            res.status(500).json({ success: false , message: "Error in query for makePact"});
        }

    } catch (error) {
        console.log("Error in MakePact controller: ", error);
        res.status(500).json({ success: false , message: "Internal Server Error"});
    }

}
