import Q from "../config/db.js"


export const verifyEmail = async (req, res) =>{

}

export const changePassword = async (req, res) =>{
    
    // await Q`
    // UPDATE users
    // SET pacts_received = array_append(pacts_received, ${pactId})
    // WHERE username = ANY(${to}::text[]);
    // `;
}

export const getUser = async (req, res) => {
  try {
    const { username } = req.query;

    if (!username) {
      return res.status(400).json({ success: false, message: "Username missing" });
    }

    const [user] = await Q`
      SELECT username, full_name, profile_image, rating, pacts_fulfilled, created_at
      FROM users
      WHERE username = ${username.toLowerCase()}
      LIMIT 1
    `;

    if (!user) {
      return res.status(404).json({ success: false, message: "User not found" });
    }

    res.status(200).json({ success: true, user });
  } catch (error) {
    console.log("Error in getUser:", error);
    res.status(500).json({ success: false, message: "Internal Server Error" });
  }
}