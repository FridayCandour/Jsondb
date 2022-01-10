import JSONDB, { JSONDBversion } from "./index.js";
// creating a new JSONDB object
const database = new JSONDB();
console.log("JSONDB version " + JSONDBversion);
// iniatialises a new JSONDB database instance and created the database file
database.init({
  name: "JSONDB_example",
  password: "password",
  username: "jsondb_username",
  encrypted: false,
});

// creating schema (tables) in JSONDB
const MessageSchema = database.schema({
  name: "Message",
  columns: {
    message: {
      type: "string",
    },
    time: {
      type: "string",
      nullable: true,
    },
  },
});

const PollSchema = database.schema({
  name: "Poll",
  columns: {
    pollVote: {
      type: "number",
    },
    time: {
      type: "string",
      nullable: true,
    },
  },
  // adding relations definition
  relations: {
    Message: {
      target: MessageSchema,
      type: "many", // many or one
      cascade: true,
    },
  },
});
// writes table schema into your JSONDB instance file
database.assemble([PollSchema, MessageSchema]);

const details = {
  password: "password",
  username: "jsondb_username",
};

// a connection needs details for security
const connection = await database.createJSONDBConnection(details);

// creating and adding stuff into JSONDB tables
const MessageTable = connection.getTable("Message");
let message = {
  time: Date(),
  message: "hello world guys",
};
const save_message = await MessageTable.save(message);
console.log(save_message);

const PollTable = connection.getTable("Poll");
let poll = {
  pollVote: 12,
  time: Date(),
  // this following fake properties will not be added
  // because they are not in the schema even if you put them above those
  // it works  :)
  this_fake_properties_will_not_be_added: "fake",
  hello: "am hungry but i love coding",
  if_i_have_electricity_and_wifi_then: "no problem",
};

await PollTable.save(poll);

const allPoll = await PollTable.getAll();
const allMessage = await MessageTable.getAll();

// saving with relations in JSONDB
// note save before adding as a relation
await PollTable.saveWithRelations(MessageTable, allPoll[0], allMessage[0]);

const get = await PollTable.getWhere({ pollVote: 12 }, 20);
// console.log(get);
