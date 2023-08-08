import { app } from "./app.js";
import "./database/db.js";

// Starting the server
app.listen(app.get("port"), () => {
    console.log(`Server on port ${app.get("port")}`);
});
