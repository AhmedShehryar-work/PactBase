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

        try{

            const [blockedCheck] = await Q`
                SELECT EXISTS(
                    SELECT 1
                    FROM users
                    WHERE username = ${from}
                    AND blocked_by && ${to}::text[]
                ) AS is_blocked
            `;

            if (blockedCheck.is_blocked) {
                return res.status(400).json({
                    success: false,
                    message: "User blocked by one or more recipients",
                    error_status: "blocked"
                });
            }

        } catch (error){
            console.log("Error in blocked_by check in query in makePact: ", error);
            res.status(500).json({ success: false , message: "Error in query for makePactError in blocked_by check in query in makePact: "});
        }

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

export const fulfillPact = async (req, res) => {
  const { pactId } = req.body;
  const username = req.user.username;

  try {
    // Fetch pact
    const [pact] = await Q`SELECT * FROM pacts WHERE id = ${pactId}`;
    if (!pact) return res.status(404).json({ message: "Pact not found" });

    // Only creator can mark as fulfilled
    if (pact.from !== username) 
      return res.status(403).json({ message: "Only the creator can mark this pact as fulfilled" });

    // Update pact status
    await Q`UPDATE pacts SET status = 'fulfilled', updated_at = now() WHERE id = ${pactId}`;

    // Increment fulfilled count for each recipient
    const toUsers = pact.to; // If column type is text[] in Postgres
    if (toUsers && toUsers.length > 0) {
      for (const user of toUsers) {
        await Q`UPDATE users SET pacts_fulfilled = COALESCE(pacts_fulfilled, 0) + 1 WHERE username = ${user}`;
      }
    }

    // Return updated pact
    const [updatedPact] = await Q`SELECT * FROM pacts WHERE id = ${pactId}`;
    res.json({ pact: updatedPact });
  } catch (err) {
    console.error("fulfillPact error:", err);
    res.status(500).json({ message: "Internal server error" });
  }
};



export const getMyPacts = async (req, res) => {
  const username = req.user.username;
  const { type = "made", page = 1, limit = 10, search = "" } = req.query;

  try {
    if (type !== "made" && type !== "received") {
      return res.status(400).json({
        success: false,
        message: "Invalid pact type",
      });
    }

    const offset = (Number(page) - 1) * Number(limit);

    const [user] = await Q`
      SELECT pacts_made, pacts_received
      FROM users
      WHERE username = ${username}
      LIMIT 1
    `;

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    const pactIds =
      type === "received" ? user.pacts_received : user.pacts_made;

    if (!pactIds || pactIds.length === 0) {
      return res.status(200).json({
        success: true,
        message: "No pacts found",
        pacts: [],
        hasMore: false,
      });
    }

    const pacts = await Q`
      SELECT *
      FROM pacts
      WHERE id = ANY(${pactIds}::uuid[])
        AND title ILIKE ${"%" + search + "%"}
      ORDER BY created_at DESC
      LIMIT ${limit}
      OFFSET ${offset}
    `;

    return res.status(200).json({
      success: true,
      message: "Pacts fetched successfully",
      pacts,
      hasMore: pacts.length === Number(limit),
    });
  } catch (error) {
    console.log("Error in getMyPacts controller: ", error);
    res.status(500).json({
      success: false,
      message: "Internal Server Error",
    });
  }
};
