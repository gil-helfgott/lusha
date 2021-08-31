import express, {Request} from "express";
import Joi from "joi";
import {validateBody} from "./lib/middlewares/validate";
import {json} from "body-parser";
import {insertToQueue} from "./lib/dal/queue";
const port = 5000;
export const app = express();

app.use(json());

app.post('/parse',
    validateBody(Joi.object().keys({
        url: Joi.string().uri().required()
    }).required()),
    (req: Request<{}, {}, {url: string}>, res) => {
    insertToQueue(req.body.url);
    res.sendStatus(200);
});

app.listen(port, () => {
    console.log(`Listening on http://localhost:${port}`);
});

