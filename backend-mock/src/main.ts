import express from "express";
import bodyParser from "body-parser";
import morgan from "morgan";
import { eventDB } from "./events";

var db = new eventDB();

const app: express.Application = express();

var jsonParser = bodyParser.json()

app.get("/", (req, res) =>
{
  res.status(200).send(db);
});

app.get("/newEvents/:srcID/:traceID", (req, res) =>
{
  var srcId:string = req.params.srcID;
  var traceId:string = req.params.traceID;
  
  var ret = db.source[srcId].getEventsFrom(+traceId);
  res.status(200).send(ret);
});

app.post("/newEvent", jsonParser, (req, res) =>
{
  var e: any = req.body;
  db.addUniqueEvent(e);

  res.status(200).send(db);
});

app.post("/reset", (req, res) =>
{
  db = new eventDB();
  res.status(200).send(db);
});

app.use(morgan("combined"));
 
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

var server = app.listen(3000, function () {
    console.log("app running on port.", server.address());
});
