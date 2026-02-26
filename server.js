require("dotenv").config();
const express = require("express");
const cors = require("cors");
const { AccessToken } = require("livekit-server-sdk");

const app = express();
app.use(cors());
app.use(express.json());

app.post("/generate-token", async (req, res) => {
  try {
    const { room, identity } = req.body;

    if (!room || !identity) {
      return res.status(400).json({ error: "Missing room or identity" });
    }

    const at = new AccessToken(
      process.env.LIVEKIT_API_KEY,
      process.env.LIVEKIT_API_SECRET,
      { identity }
    );

    at.addGrant({
      roomJoin: true,
      room,
    });

    const token = at.toJwt();
    res.json({ token });

  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Token generation failed" });
  }
});

app.get("/", (req, res) => {
  res.send("TutorOS Backend Running");
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
