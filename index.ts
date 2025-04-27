import express, { Request, Response } from "express";
const app = express();
import expressAsyncHandler from "express-async-handler";

import dotenv from "dotenv"
dotenv.config()
const port = process.env.PORT || 5000;

import bodyParser from "body-parser";
import { tokenTransfer } from "./src/tokenTransfer";
import { FetchUser } from "./src/fetchUser";



app.use(bodyParser.json());

app.post("/swap", async (req: Request, res: Response) => {
    const { telegramId } = req.body

    const user = await FetchUser(telegramId);

    console.log({user})

    if (user == null || user.length == 0 || user?.withdrawal_wallet == "") {
        res.status(404).json({ error: true, msg: "There is no wallet" })
    }

    const point = user?.total_points;
    if (point > user?.total_points) res.status(400).json({ error: true, msg: "Wrong point" });

    const amount = point * 100 // Will be changed
    const tokenMint = ""

    try {
        await tokenTransfer(user?.withdrawal_wallet, tokenMint, amount);
        res.status(200).json({ success: true })
    } catch (error) {
        console.log(error)
        res.status(500).json({ error: true, msg: "Swap error" })
    }
});

const start = async () => {
    try {
        // only connect to server if successfully-connected to DB
        app.listen(port, () =>
            console.log(`Server is listening on http://localhost:${port}`)
        );
    } catch (error) {
        console.log(error);
    }
};
start();

