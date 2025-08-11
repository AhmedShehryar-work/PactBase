import Q from "../config/db.js"

export const getUser = async (req, res) => {

    const {user_id} = req.body;

    try{

        await Q.begin(async (sqlTx) => {

            const [user] = await Q`
            SELECT *
            FROM users
            WHERE id = ${user_id}
            `;

            if (!user) {
                return res.status(404).json({ error: "User not found" });
            }

            res.status(200).json({ success: true, user });

        });

    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal server error - Failed to activate user' });
    }

}

export const activate = async (req, res) => {

    const {user_id} = req.body;

    try{

        await Q.begin(async (sqlTx) => {

            const [activatedUser] = await sqlTx`
                UPDATE users
                SET status = 'active'
                WHERE id = ${user_id}
                RETURNING *
            `;

            if (!activatedUser) {
                return res.status(404).json({ error: "User not found" });
            }

        });

        res.status(200).json({ success: true});

    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal server error - Failed to activate user' });
    }

}

export const disable = async (req, res) => {

    const {user_id} = req.body;

    try{

        const [disabledUser] = await Q`
        UPDATE users
        SET status = 'disabled'
        WHERE id = ${user_id}
        RETURNING *
        `;

        if (!disabledUser) {
            return res.status(404).json({ error: "User not found" });
        }

        res.status(200).json({ success: true});

    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal server error - Failed to disable user' });
    }

}