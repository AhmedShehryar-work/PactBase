import Q from "../config/db.js"

export const activate = async (req, res) => {

    const {user_id} = req.body;

    try{

        await Q.begin(async (sqlTx) => {

            const updatedUser = await sqlTx`
                UPDATE users
                SET status = 'active'
                WHERE id = ${user_id}
                RETURNING *
            `;

            if (updatedUser.length === 0) {
                throw new Error("User not found");
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

        await Q.begin(async (sqlTx) => {

            await sqlTx`
            UPDATE users
            SET status = ${'disabled'}
            WHERE id = ${user_id}
            `;

        });

        res.status(200).json({ success: true});

    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal server error - Failed to disable user' });
    }

}