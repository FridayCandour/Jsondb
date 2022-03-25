import fs from "fs";
// JSON DB
/**
 * this project requires
 * abilty to create a json file
 * read and write the json file by
 * parsing, adding or deleting entries
 * ordered in form of tables and columns
 *
 * */

const JSONDB = {};
JSONDB.str = function (s) {
  return JSON.stringify(s);
};

JSONDB.par = function (p) {
  return JSON.parse(p);
};
JSONDB.DB_NAME = null;
JSONDB.createDB = function (name, config) {
  let data = {
    name: name,
    version: "1.0.0",
    password: config.password || "password",
    username: config.username || "",
    time_created: Date(),
    last_access_time: null,
    tables: {},
  };
  JSONDB.DB_NAME = name;
  function cb(err) {
    if (err) {
      throw new Error("JSONDB: err failed to create database because " + err);
    }
  }
  fs.writeFile(name + ".json", JSON.stringify(data), cb);
};

// JSONDB.createDB("fridayDB", {});

JSONDB.db = null;
JSONDB.getDB = (name) => {
  if (!JSONDB.db) {
    JSONDB.db = JSON.parse(fs.readFileSync(JSONDB.DB_NAME + ".json", "utf-8"));
    return JSONDB.db;
  } else {
    return JSONDB.db;
  }
};

// console.log(JSONDB.getDB("fridayDB"));

// relations: {
//   Message: {
//     target: "Message",
//     type: "many-to-one",
//   },
// }

// FIXME: not done here
JSONDB.validateRelations = function (relations) {
  const types = ["many-to-one", "many-to-many", "one-to-many", "one-to-one"];
  for (const [relation, value] of Object.entries(relations)) {
    if (!typeof relation.target === "object") {
      //
    }
    if (!types.includes(value.type)) {
      //
      throw new Error(
        "JSONDB: wrong relationship type given " +
          value.type +
          "  should be any of many-to-one ,many-to-many ,one-to-many , one-to-one"
      );
    }
    if (value.cascade && typeof value.cascade !== "bolean") {
      //
      throw new Error(
        "JSONDB: wrong cascade value given " +
          value.cascade +
          "  should be true or false"
      );
    }
  }
};
// done here
JSONDB.validateColumns = function (columns) {
  const keys = ["type", "nullable", "unique"];
  const types = ["number", "string", "bolean", "blob"];
  for (const [column, value] of Object.entries(columns)) {
    if (column) {
      if (!types.includes(value.type)) {
        //
        throw new Error(
          "JSONDB: wrong data type given " +
            value.type +
            "  only number, string, bolean and blob are accepted"
        );
      }
      if (value.unique && typeof value.unique !== "boolean") {
        throw new Error(
          "JSONDB: wrong unique value given " +
            value.unique +
            "  should be true or false"
        );
        //
      }
      if (value.nullable && typeof value.nullable !== "boolean") {
        //
        throw new Error(
          "JSONDB: wrong nullable value given " +
            value.nullable +
            "  should be true or false"
        );
      }
    }
  }
  return true;
};

/**
 * Schema constructor for Jsondb
 * -----------------------------
 *
 * name @type string
 *
 * columns @type object  {
 *
 * type >  @type any of  number > string > bolean > blob and must be specified
 *
 * nullable @type bolean true > false default false
 *
 * unique  @type bolean   true > false default false
 *
 * }
 *
 * relations @type object {
 *
 * target: entity schema @type object,
 *
 *  attachment_name: @type string,
 *
 * type : @type string should be any of "many-to-one" , "many-to-many" , "one-to-many" , "one-to-one"
 *
 *  }
 *
 * last_index > auto
 * 
 * 
 * exp:
 * 
 * const PollSchema = new JSONDB.schema({
 * 
  name: "Poll",
  *
  columns: {
  *
    value: {
    *
      type: "varchar",
      *
    },
    *
  },
  *
  relations: {
  *
    Message: {
    *
      target: "Message",
      *
      type: "many-to-one",
      *
    },
    *
  },
  *
});
 */

JSONDB.schema = class {
  // FIXME:  add validators
  constructor(schema_configuration_object) {
    // validations
    JSONDB.validateColumns(schema_configuration_object.columns);
    JSONDB.validateRelations(schema_configuration_object.relations);
    // assignment
    this.name = schema_configuration_object.name;
    this.last_index = 0;
    this.columns = schema_configuration_object.columns;
    this.relations = schema_configuration_object.relations;
  }
};

const PollSchema = new JSONDB.schema({
  name: "Poll",
  columns: {
    vote: {
      type: "number",
    },
    time: {
      type: "string",
      nullable: true,
    },
    value: {
      type: "string",
    },
  },
  relations: {
    Message: {
      target: "Message",
      type: "many-to-one",
    },
  },
});

JSONDB.assemble = function (allEntites) {
  if (!Array.isArray(allEntites)) {
    throw new Error("JSONDB: invalid entity list, can't be assembled");
  }
  //
};
console.log(PollSchema);

export default JSONDB;
