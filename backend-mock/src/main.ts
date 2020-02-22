import express from "express";
import bodyParser from "body-parser";
import morgan from "morgan";
import cors from "cors";

import { eventDB } from "./events";

var db = new eventDB();

const app: express.Application = express();

var jsonParser = bodyParser.json()

function sleep(ms:number) 
{
  return new Promise((resolve) => {
    setTimeout(resolve, ms);
  });
}   

app.get("/", (req, res) =>
{
  res.status(200).send(db);
});

app.post("/confirmEvents", cors(), jsonParser, (req, res) =>
{
  var obj: any = req.body;

  var ret:number[] = db.confirmEvents(obj.SourceId, obj.ids);

  res.status(200).send(ret);
})

app.get("/newEvents/:srcID/:traceID", cors(), async (req, res) =>
{
  var srcId:string = req.params.srcID;
  var traceId:string = req.params.traceID;

  var timeoutMS = +req.headers['timeout'] * 1000;
  var sleepTimeMS = 500;
  var accMS = 0;

  while (accMS < timeoutMS)
  {
    var ret = db.getEventsFrom(srcId, +traceId);
    if (ret)
      await res.status(200).json(ret);
    await sleep(sleepTimeMS);
    accMS += sleepTimeMS;
  }

  await res.status(204).send();
});

app.post("/newEvent", cors(), jsonParser, (req, res) =>
{
  var e: any = req.body;
  if (db.addUniqueEvent(e))
    res.status(201).send(e);
  else
    res.status(400).send(e);
});

app.post("/reset", (req, res) =>
{
  db = new eventDB();
  res.status(200).send(db);
});

app.use(cors());
app.use(morgan("combined"));
 
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

var server = app.listen(3000, function () {
    console.log("app running on port.", server.address());
});