"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const app = (0, express_1.default)();
app.use(express_1.default.json());
const PORT = 8080;
app.get("/ping", (_, res) => {
    console.log("yeah");
    res.send("pong");
});
app.listen(PORT, () => {
    console.log(`server runing in PORT ${PORT}`);
});
