import * as dotenv from "dotenv";
dotenv.config();
import './db/dbConnection';
import app from './app';

const port = process.env.PORT || 8080;

app.listen(port, () => console.log(`App is listening to ${port}`));
