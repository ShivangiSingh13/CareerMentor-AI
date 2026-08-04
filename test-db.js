const mongoose = require("mongoose");

require("dotenv").config({ path: "server/.env" });

(async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("✅ Connected successfully");
    process.exit(0);
  } catch (err) {
    console.error("❌ Full error:");
    console.error(err);
    process.exit(1);
  }
})();
