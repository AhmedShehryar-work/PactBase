import Q from "../../config/db.js"

export const getUser = async (req, res) => {

    try{

            const [user] = await Q`
                UPDATE pending_users
                SET locked = true
                WHERE username = (
                    SELECT username
                    FROM pending_users
                    WHERE locked = false
                    ORDER BY created_at ASC
                    FOR UPDATE SKIP LOCKED
                    LIMIT 1
                )
                RETURNING *;
            `;

            if (!user) {
                return res.status(200).json({ success: false , message: "No users pending" });
            }


        res.status(200).json({ success: true , user });

    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false , message: 'Internal server error - Failed to activate user' });
    }

}

export const activate = async (req, res) => {

    const {username} = req.body;

    try{

        await Q.begin(async (sqlTx) => {

            const [activatedUser] = await sqlTx`
                UPDATE users
                SET status = 'active'
                WHERE username = ${username}
                RETURNING username
            `;

            await sqlTx`
                DELETE FROM pending_users
                WHERE username = ${username}
            `;

            if (!activatedUser) {
                return res.status(404).json({ success: false , message: "User not found" });
            }

        });

        res.status(200).json({ success: true , message: "User Activated"});

    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false , message: 'Internal server error - Failed to activate user' });
    }

}

export const reject = async (req, res) => {

    const {username} = req.body;

    try{

        await Q.begin(async (sqlTx) => {

            const [rejectedUser] = await sqlTx`
            UPDATE users
            SET status = 'rejected'
            WHERE username = ${username}
            RETURNING username
            `;

            if (!rejectedUser) {
            return res.status(404).json({ success: false , message: "User not found" });
            }

            await sqlTx`
                DELETE FROM pending_users
                WHERE username = ${username}
            `;

        });

        res.status(200).json({ success: true , message: "User Rejected"});

    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false , message: 'Internal server error - Failed to reject user' });
    }

}


export const disable = async (req, res) => {

    const {username} = req.body;

    try{

        const [disabledUser] = await Q`
        UPDATE users
        SET status = 'disabled'
        WHERE username = ${username}
        RETURNING username
        `;

        if (!disabledUser) {
            return res.status(404).json({ success: false , message: "User not found" });
        }

        res.status(200).json({ success: true , message: "User Disabled"});

    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false , message: 'Internal server error - Failed to disable user' });
    }

}