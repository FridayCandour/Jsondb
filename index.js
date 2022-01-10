/**
 *     JSON DB DataBase MIT Licence © 2022
 *     ************************************
 *     Created by Friday Candour @uiedbooker
 *
 *     email > fridaymaxtour@gmail.com
 *
 *     github > www.github.com/FridayCandour
 *
 *   JSONDB  @version 1.0.0
 * .
 *
 * .
 *
 * .
 *  */

export const JSONDBversion = "1.0.0";

import fs from "fs";
import { dirname } from "path";
import { fileURLToPath } from "url";
const _dirname = dirname(fileURLToPath(import.meta.url));

const schema = class {
  constructor(schema_configuration_object, validators) {
    // validations
    if (!schema_configuration_object.columns) {
      throw new Error(
        "JSONDB: can't create an empty table should have some columns"
      );
    }
    validators.validateColumns(schema_configuration_object.columns);
    if (schema_configuration_object.relations) {
      validators.validateRelations(schema_configuration_object.relations);
    }
    // assignment
    this.base_name = "";
    this.name = schema_configuration_object.name;
    this.last_index = -1;
    this.columns = schema_configuration_object.columns;
    this.relations = schema_configuration_object.relations || null;
  }
};

class JSONDBTableWrapper {
  constructor(self) {
    this.self = self;
  }
  async get(name) {
    return new Promise(function (res, rej) {
      fs.readFile(
        _dirname + "/" + name + ".json",
        { encoding: "utf-8" },
        function (err, data) {
          if (err) {
            return rej(
              "JSONDB: error failed to retrieve entities from database because " +
                err
            );
          }
          try {
            res(JSON.parse(data));
          } catch (error) {
            try {
              res(JSON.parse(fs.readFileSync(name + ".json", "utf-8")));
            } catch (error) {}
          }
        }
      );
    });
  }
  async put(name, value) {
    function cb(err) {
      if (err) {
        throw new Error(
          "JSONDB: error failed to update entities into database because " + err
        );
      }
    }
    fs.writeFile(name + ".json", JSON.stringify(value), cb);
  }
  validator(incoming) {
    const outgoing = {};
    for (const prop in this.self.columns) {
      if (
        !this.self.columns.nullable &&
        !Object.hasOwnProperty.call(incoming, prop)
      ) {
        throw new Error(
          "JSONDB: error failed to validate incoming data because " +
            prop +
            " is not valid for " +
            this.self.name
        );
      }
      if (
        !this.self.columns.nullable &&
        typeof incoming[prop] !== this.self.columns[prop].type
      ) {
        throw new Error(
          "JSONDB: error failed to validate incoming data because " +
            prop +
            "'s value " +
            incoming[prop] +
            " has got a wrong data type of " +
            typeof incoming[prop] +
            " for " +
            this.self.name +
            " should be " +
            this.self.columns[prop].type +
            " type instead"
        );
      }
      // cleaning time
      outgoing[prop] = incoming[prop];
    }
    return outgoing;
  }
  /**
 * Save with relations
 * ---------------------
 * @type     .saveWithRelations(target table, schema, schema | schema[]) => Promise(object)
 * @example 
  * // single relation
await PollTable.saveWithRelations(MessageTable, Poll, message);
// arrays of relations
await PollTable.saveWithRelations(MessageTable, Poll, allMessages);
*/
  async saveWithRelations(table, incoming, relations) {
    if (!relations) {
      return;
    }
    const db = await this.get(this.self.base_name);
    //
    if (typeof incoming.index !== "number") {
      incoming = this.validator(incoming);
      if (this.self.relations && !incoming.relations) {
        incoming.relations = {};
      }
      incoming.index = db.Entities[this.self.name].last_index + 1;
      db.Entities[this.self.name].last_index += 1;
      db.tables[this.self.name].push(incoming);
    } else {
      db.tables[this.self.name][incoming.index] = incoming;
    }

    if (relations && Array.isArray(relations)) {
      for (let i = 0; i < relations.length; i++) {
        if (db.Entities[this.self.name].relations[table.self.name]) {
          if (
            db.Entities[this.self.name].relations[table.self.name].type ===
            "many"
          ) {
            db.tables[this.self.name][incoming.index].relations[
              table.self.name
            ] = !db.tables[this.self.name][incoming.index].relations[
              table.self.name
            ]
              ? [relations[i]]
              : [
                  ...db.tables[this.self.name][incoming.index].relations[
                    table.self.name
                  ],
                  relations[i],
                ];
          } else {
            db.tables[this.self.name][incoming.index].relations[
              table.self.name
            ] = relations[i];
          }
        }
      }
    } else {
      if (relations) {
        if (db.Entities[this.self.name].relations[table.self.name]) {
          if (
            db.Entities[this.self.name].relations[table.self.name].type ===
            "many"
          ) {
            db.tables[this.self.name][incoming.index].relations[
              table.self.name
            ] = !db.tables[this.self.name][incoming.index].relations[
              table.self.name
            ]
              ? [relations]
              : [
                  ...db.tables[this.self.name][incoming.index].relations[
                    table.self.name
                  ],
                  relations,
                ];
          } else {
            db.tables[this.self.name][incoming.index].relations[
              table.self.name
            ] = relations;
          }
        }
      }
    }
    await this.put(this.self.base_name, db);
    return db.tables[this.self.name][incoming.index];
  }
  /**
 * Save table into a Jsondb instance
 * -----------------------------
 * @type .save(schema)=> Promise(object) 
 * @example
 await PollTable.save(poll)
*/
  async save(incoming) {
    // db.tables[this.self.name] = db.tables[this.self.name].sort(
    //   (a, b) => a.index - b.index
    // );
    const db = await this.get(this.self.base_name);
    if (typeof incoming.index !== "number") {
      incoming = this.validator(incoming);
      if (this.self.relations && !incoming.relations) {
        incoming.relations = {};
      }
      incoming.index = db.Entities[this.self.name].last_index + 1;
      db.Entities[this.self.name].last_index += 1;
      db.tables[this.self.name].push(incoming);
    } else {
      db.tables[this.self.name][incoming.index] = incoming;
    }
    await this.put(this.self.base_name, db);
    return db.tables[this.self.name][incoming.index];
  }
  /**
 * Save table into a Jsondb instance
 * -----------------------------
 * @type .remove(schema)=> Promise(object) 
 * @example
 await PollTable.remove(poll)
*/
  async remove(entity) {
    const db = await this.get(this.self.base_name);
    // db.tables[this.self.name].splice(entity.index, 1);
    db.tables[this.self.name][entity.index] = null;
    await this.put(this.self.base_name, db);
  }
  /**
 * Save table into a Jsondb instance
 * -----------------------------
 * @type .count(schema)=> Promise(number) 
 * @example
 await PollTable.count(poll)
*/
  async count() {
    const db = await this.get(this.self.base_name);
    return db.tables[this.self.name].length;
  }
  /**
 * Save table into a Jsondb instance
 * -----------------------------
 * @type .getAll()=> Promise(object[]) 
 * @example
 await PollTable.getAll()
*/
  async getAll() {
    const db = await this.get(this.self.base_name);
    return db.tables[this.self.name];
  }
  /**
 * Save table into a Jsondb instance
 * -----------------------------
 * @type .getWhere({prop: value, num})=> Promise(object) 
 * @example
 await PollTable.getWhere(poll)
*/
  async getWhere(props, number) {
    const results = [];
    const db = await this.get(this.self.base_name);
    const all = db.tables[this.self.name];
    for (let i = 0; i < all.length; i++) {
      const element = all[i];
      for (const [k, v] of Object.entries(props)) {
        if (element[k] && element[k] === v) {
          results.push(element);
          if (typeof number === "number" && results.length === number) {
            return results;
          }
        }
      }
    }
    return results;
  }
}

const JSONDBConnection = class {
  constructor(Entities) {
    this.Entities = Entities;
  }

  /**
   * Get a table from JSONDB
   *------------------------
   * @example
   *
   * 
const details = {
  password: "password",
  username: "jsondb_username",
};
// getting connection instance into JSONDB
const connection = await database.createJSONDBConnection(details);
// getting a table 
const MessageTable = connection.getTable("Message");
   * */
  getTable(table_name) {
    for (const [tableName, table] of Object.entries(this.Entities)) {
      if (table_name === tableName) {
        return new JSONDBTableWrapper(table);
      }
    }
  }
};

/**
 *     JSON DB DataBase MIT Licence © 2022
 *     ************************************
 *     Created by Friday Candour @uiedbooker
 *
 *     email > fridaymaxtour@gmail.com
 *
 *     github > www.github.com/FridayCandour
 *
 *   JSONDB  @version 1.0.0
 *
 *
 * Create a new JSONDB object
 *------------------------
 *  @class
 *
 * const database = new JSONDB()
 *
 * Creates a new JSONDB object
 *
 * .
 *
 * .
 * */

class JSONDB {
  constructor() {
    this.DB_NAME = "";
    this.username = "";
    this.password = "";
    // this should be generated values for data encryption
    this.secrets = [];
    this.encrypted = false;
    this.initialised = false;
    this.time_created = Date();
    this.version = JSONDBversion;
    this.last_access_time = "";
    this.Entities = {};
    this.tables = {};
    //
  }
  async getDB(name) {
    return new Promise(function (res, rej) {
      fs.readFile(
        _dirname + "/" + name + ".json",
        { encoding: "utf-8" },
        function (err, data) {
          if (err) {
            return rej(err);
          }
          try {
            res(JSON.parse(data));
          } catch (error) {
            try {
              res(JSON.parse(fs.readFileSync(name + ".json", "utf-8")));
            } catch (error) {}
          }
        }
      );
    });
  }
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
 * 
 * 
 * @example
 * 
 * const MessageSchema = database.schema({
  name: "Message",
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
});
 * 
 * const PollSchema = new JSONDB.schema({
  name: "Poll",
  columns: {
    value: {
      type: "varchar",
    },
  },
  relations: {
    Message: {
      target: Message,
      type: "many-to-one",
    },
  },
});
 */

  schema(schema_configuration_object) {
    return new schema(schema_configuration_object, {
      validateColumns: this.validateColumns,
      validateRelations: this.validateRelations,
    });
  }
  /**
   * Create a new JSONDB instance
   *------------------------
   *  @example
   * // creates a JSONDB object
   * const Database = new JSONDB()
   * // database configuration object
   * const config = {
   DB_NAME: "my db",
  password: "password",
  username: "jsondb_username",
 encrypted: false,
    }
 // Creates a new JSONDB instance
   * Database.init(config)  
   * */
  init(config) {
    this.initialised = true;
    this.DB_NAME = config.name;
    this.password = config.password || "";
    this.username = config.username || "";
    this.encrypted = config.encrypted || false;
    this.time_created = Date();
    this.tables = {};
    try {
      const wasThere = fs.readFileSync(config.name + ".json", "utf-8");
      if (wasThere) {
        return;
      }
    } catch (error) {}
    function cb(err) {
      if (err) {
        throw new Error(
          "JSONDB: error failed to create database because " + err
        );
      }
    }
    fs.writeFile(config.name + ".json", JSON.stringify(this), cb);
  }

  /**
 * Create secure connection a Jsondb instance
 * -----------------------------
 * @example
 * 
 * const details = {
  password: "password",
  username: "jsondb_username",
};
const connection = await database.createJSONDBConnection(details);
*/

  async createJSONDBConnection(details) {
    if (!this.initialised) {
      throw new Error("JSONDB: you haven't create a JSONDB instance yet");
    }
    if (
      details.username !== this.username ||
      details.password !== this.password
    ) {
      throw new Error("JSONDB: Access Denied");
    }
    this.last_access_time = Date();
    const connection = await this.getDB(this.DB_NAME);
    return new JSONDBConnection(connection.Entities);
  }
  validateRelations(relations) {
    const types = ["many", "one"];
    for (const [relation, value] of Object.entries(relations)) {
      if (typeof value.target !== "object") {
        throw new Error(
          "JSONDB: wrong relationship target type given " +
            value.target +
            "  should be object only"
        );
      }
      if (!types.includes(value.type)) {
        throw new Error(
          "JSONDB: wrong relationship type given " +
            value.type +
            "  should be many or one"
        );
      }
      if (value.cascade && typeof value.cascade !== "boolean") {
        throw new Error(
          "JSONDB: wrong cascade value given " +
            value.cascade +
            " should be true or false"
        );
      }
    }
  }
  validateColumns(columns) {
    const types = ["number", "string", "bolean", "blob"];
    for (const [column, value] of Object.entries(columns)) {
      if (column) {
        if (!types.includes(value.type)) {
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
        }
        if (value.nullable && typeof value.nullable !== "boolean") {
          throw new Error(
            "JSONDB: wrong nullable value given " +
              value.nullable +
              "  should be true or false"
          );
        }
      }
    }
  }

  /**
 * Assemble Entities into Jsondb
 * -----------------------------
 * @example
 * 
 * const MessageSchema = database.schema({
  name: "Message",
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
});

database.assemble([MessageSchema]);
*
*/

  assemble(allEntities) {
    if (!this.initialised) {
      throw new Error("JSONDB: you haven't create a JSONDB instance yet");
    }
    try {
      const wasThere = fs.readFileSync(this.DB_NAME + ".json", "utf-8");
      if (wasThere) {
        return;
      }
    } catch (error) {}
    if (!Array.isArray(allEntities) || typeof allEntities[0] !== "object") {
      throw new Error("JSONDB: invalid entity array list, can't be assembled");
    }
    for (let i = 0; i < allEntities.length; i++) {
      this.Entities[allEntities[i].name] = allEntities[i];
      this.Entities[allEntities[i].name].base_name = this.DB_NAME;
      this.tables[allEntities[i].name] = [];
    }
    function cb(err) {
      if (err) {
        throw new Error(
          "JSONDB: error failed to assemble entities into database because " +
            err
        );
      }
    }
    fs.writeFile(this.DB_NAME + ".json", JSON.stringify(this), cb);
  }
}

/**
 * @exports
 */
export default JSONDB;
