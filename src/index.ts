import * as dotenv from "dotenv";
dotenv.config();
import './db/dbConnection';
import httpServer from './app';

const port = process.env.PORT || 8080;

httpServer.listen(port, () => console.log(`App is listening to ${port}`));
