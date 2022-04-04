/**
 *     JSON DB DataBase MIT Licence © 2022
 *     ************************************
 *     Created by Friday Candour @uiedbooker
 *
 *     email > fridaymaxtour@gmail.com
 *
 *     github > www.github.com/FridayCandour
 *
 *      telegram > @uiedbooker
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
import crypto from "crypto";
const _dirname = dirname(fileURLToPath(import.meta.url));

/**
 * a custom made uuid For JSONDB
 * ******************************
 */

function uuid(num) {
  crypto.getRandomValues = (arr) => crypto.randomBytes(arr.length);
  const btoa = (text) => {
    return Buffer.from(text, "binary").toString("base64");
  };
  function generateUID(length) {
    length = Math.round(length) || 10;
    return btoa(
      Array.from(crypto.getRandomValues(new Uint8Array(length)))
        .map((b) => String.fromCharCode(b))
        .join("")
    )
      .replace(/[+/]/g, "")
      .substring(0, length);
  }

  function dec2hex(dec) {
    return dec.toString(16).padStart(2, "0");
  }
  function generateId(len) {
    len = Math.round(len);
    return Array.from(
      crypto.getRandomValues(new Uint8Array(len || 10)),
      dec2hex
    ).join("");
  }

  return generateUID(num / 2) + generateId(num / 2);
}

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

/**
 * Encryption logic for JsonDB
 * ------------------------------
 *
 * Details of how it works cannot be disposed yet
 *
 * Data can't be decripted without the required generated encription keys;
 *
 * No data of the decription keys is stored by the db, but the db knows when the secure keys are correct
 *
 *
 * You can Support the project to get even greater features and stability glaciers!
 */

const secure = function (keys) {
  function getCharsSet(keys) {
    // all chars supported at the moment
    const char75 = {
      0: null,
      1: null,
      2: null,
      3: null,
      4: null,
      5: null,
      6: null,
      7: null,
      8: null,
      9: null,
      "@": null,
      ".": null,
      '"': null,
      "%": null,
      "#": null,
      "?": null,
      ",": null,
      "*": null,
      "-": null,
      _: null,
      $: null,
      " ": null,
      a: null,
      b: null,
      c: null,
      d: null,
      e: null,
      f: null,
      g: null,
      h: null,
      i: null,
      j: null,
      k: null,
      l: null,
      m: null,
      n: null,
      o: null,
      p: null,
      q: null,
      r: null,
      s: null,
      t: null,
      u: null,
      v: null,
      w: null,
      x: null,
      y: null,
      z: null,
      A: null,
      B: null,
      C: null,
      D: null,
      E: null,
      F: null,
      G: null,
      H: null,
      I: null,
      J: null,
      K: null,
      L: null,
      M: null,
      N: null,
      O: null,
      P: null,
      Q: null,
      R: null,
      S: null,
      T: null,
      U: null,
      V: null,
      W: null,
      X: null,
      Y: null,
      Z: null,
    };

    const ordinates = [];
    const keysString = keys.split("-");
    const realKeys = [];
    const fff = [];
    const ggg = [];
    const uuid = (text) => Buffer.from(text, "binary").toString("base64");

    // getting the keys from the keysString
    for (let i = 0; i < keysString.length; i++) {
      realKeys.push(keysString[i] * 1);
    }
    // getting co-ordinates from each keys
    for (let i = 0; i < realKeys.length; i++) {
      let lop = realKeys[i] - 50;
      for (let k = lop; k < realKeys[i]; k++) {
        ordinates.push(k);
      }
    }
    // generating ugly identifiers
    for (let i = 0; i < ordinates.length; i++) {
      fff.push(uuid("" + ordinates[i]));
    }
    // packing into consecutive 10 alternatives
    for (let i = 0; i < fff.length; i += 10) {
      ggg.push(fff.slice(i, i + 10));
    }
    // setting up ugly table
    let o = 0;
    for (const key in char75) {
      char75[key] = ggg[o];
      o++;
    }
    return char75;
  }

  function encrypt(data) {
    const _et = getCharsSet(keys);
    const clamp = (min, max, value) => Math.min(max, Math.max(min, value));
    const ff = {};
    for (const k in data) {
      if (k === "index" || k === "relations") {
        continue;
      }
      let arr = [...(data[k] + "")];
      data[k] = [];
      for (const [char, chars] of Object.entries(_et)) {
        let i;
        i = arr.indexOf(char);

        while (i > -1) {
          // this is the evil part
          // it's not easy to attack such program
          data[k][i] = chars[clamp(0, 8, Math.round(Math.random() * 8))];
          arr[i] = null;
          i = arr.indexOf(char);
        }
      }
      ff[k] = data[k].join("-");
    }
    if (data.index) {
      ff.index = data["index"];
    }
    if (data.relations) {
      ff.index = data["relations"];
    }
    // console.log(ff);
    return ff;
  }

  function check(ffff) {
    try {
      const _et = getCharsSet(keys);
      let arr = ffff.split("-");

      let data = [];
      for (let i = 0; i < arr.length; i++) {
        for (const [char, chars] of Object.entries(_et)) {
          let p = chars.indexOf(arr[i]);
          while (p > -1) {
            data[i] = char;
            chars[p] = null;
            p = chars.indexOf(arr[i]);
          }
        }
      }
      console.log(data.join(""));
      if (data.join("").includes("Can")) {
        return true;
      }
    } catch (error) {}
    return false;
  }

  function decrypt(data) {
    const _et = getCharsSet(keys);
    const ff = {};
    if (Array.isArray(data)) {
      for (let z = 0; z < data.length; z++) {
        for (const k in data[z]) {
          if (k === "index") {
            continue;
          }
          let arr = data[z][k].split("-");
          data[z][k] = [];
          for (const [char, chars] of Object.entries(_et)) {
            for (let i = 0; i < arr.length; i++) {
              let p = chars.indexOf(arr[i]);
              while (p > -1) {
                data[z][k][i] = char;
                chars[p] = null;
                p = chars.indexOf(arr[i]);
              }
            }
          }
          ff[k] = data[z][k].join("");
        }
        if (data[z].index) {
          ff.index = data[z]["index"];
        }
        // console.log(ff);
        return ff;
      }
    } else {
      for (const k in data) {
        if (k === "index") {
          continue;
        }
        let arr = data[k].split("-");
        data[k] = [];
        for (const [char, chars] of Object.entries(_et)) {
          for (let i = 0; i < arr.length; i++) {
            let p = chars.indexOf(arr[i]);
            while (p > -1) {
              data[k][i] = char;
              chars[p] = null;
              p = chars.indexOf(arr[i]);
            }
          }
        }
        ff[k] = data[k].join("");
      }
      if (data.index) {
        ff.index = data["index"];
      }
      // console.log(ff);
      return ff;
    }
  }
  return { encrypt, decrypt, check };
};

/**secure(
  "1149-1294-1237-1040-945-916-805-720-668-475-447-326-238-200-95"
).encrypt({ name: "Candour is a king", number: 12344, index: 123 });
secure(
  "1149-1294-1237-1040-945-916-805-720-668-475-447-326-238-200-95"
).decrypt({
  name: "NDAz-OTE3-Njc2-ODcw-Njg2-NjQ0-NzE1-OTA2-NzYy-NjIw-OTA1-OTE4-OTA4-Nzc5-NzYy-Njc0-ODk5",
  number: "MTExMQ==-MTEyNA==-MTEzNg==-MTE0MQ==-MTE0Mw==",
  index: 123,
});
*/

class JSONDBTableWrapper {
  constructor(self, keys) {
    this.put = async (name, value) => {
      function cb(err) {
        if (err) {
          throw new Error(
            "JSONDB: error failed to update entities in database because " + err
          );
        }
      }
      fs.writeFile(name + ".json", JSON.stringify(value), cb);
    };
    this.get = async (name) => {
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
    };
    this.validator = (incoming, tables) => {
      // works for type, nulllable and unique validations.
      const outgoing = {};
      for (const prop in this.self.columns) {
        if (
          this.self.columns[prop].nullable !== true &&
          !Object.hasOwnProperty.call(incoming, prop)
        ) {
          throw new Error(
            "JSONDB: error failed to validate incoming data because " +
              prop +
              " is required for " +
              this.self.name +
              " Schema"
          );
        }

        if (
          !this.self.columns[prop].nullable &&
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

        if (this.self.columns[prop].unique === true) {
          for (let i = 0; i < tables.length; i++) {
            const element = tables[i];
            if (element[prop] === incoming[prop]) {
              throw new Error(
                "JSONDB: error failed to validate incoming data because " +
                  prop +
                  " is unique for " +
                  this.self.name +
                  " Schema can't have more than one instance"
              );
            }
          }
        }

        // cleaning time
        outgoing[prop] = incoming[prop];
      }
      return outgoing;
    };
    this.self = self;
    this.keys = keys;
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
    db.last_access_time = Date();
    if (incoming && !incoming["index"]) {
      throw new Error("JsonDB: save before saving with relations");
    }

    db.tables[this.self.name][incoming.index] = incoming;
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
    db.last_access_time = Date();
    if (db.encrypted) {
      incoming = secure(this.keys).encrypt(incoming);
    }
    if (typeof incoming.index !== "number") {
      incoming = this.validator(incoming, db.tables[this.self.name]);
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
    db.last_access_time = Date();
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
    db.last_access_time = Date();
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
    db.last_access_time = Date();
    let all;
    if (db.encrypted) {
      all = secure(this.keys).decrypt(db.tables[this.self.name]);
    } else {
      all = db.tables[this.self.name];
    }
    return all;
  }
  /**
 * get entities with any of the values specifiled from a Jsondb instance
 * -----------------------------
 * @type .getWhereAny({prop: value}, number | undefind)=> Promise(object) 
 * @example
 await PollTable.getWhereAny({name: "friday", age: 121, class: "senior"}) // gets all
 await PollTable.getWhereAny({email: "fridaymaxtour@gmail.com"}, 2) // gets 2 if they are up to two
*/
  async getWhereAny(props, number) {
    const results = [];
    const db = await this.get(this.self.base_name);
    db.last_access_time = Date();
    if (db.encrypted) {
      const all = secure(this.keys).decrypt(db.tables[this.self.name]);
    } else {
      const all = db.tables[this.self.name];
    }

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

  /**
 * get an entity with the values specifiled from a Jsondb instance
 * -----------------------------
 * @type .getOne({prop: value})=> Promise(object) 
 * @example
  
  await PollTable.getOne({email: "fridaymaxtour@gamail.com"}) // gets one

  */
  async getOne(props) {
    const results = null;
    const db = await this.get(this.self.base_name);
    db.last_access_time = Date();
    if (db.encrypted) {
      const all = secure(this.keys).decrypt(db.tables[this.self.name]);
    } else {
      const all = db.tables[this.self.name];
    }
    for (let i = 0; i < all.length; i++) {
      const element = all[i];
      for (const [k, v] of Object.entries(props)) {
        if (element[k] && element[k] === v) {
          results = element;
          break;
        }
      }
    }
    return results;
  }
}

const JSONDBConnection = class {
  constructor(Entities, keys) {
    this.Entities = Entities;
    this.keys = keys;
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
        return new JSONDBTableWrapper(table, this.keys);
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
 *     telegram > @uiedbooker
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
    this.encrypted = false;
    this.initialised = false;
    this.time_created = Date();
    this.version = JSONDBversion;
    this.last_access_time = "";
    this.visuality = "";
    this.Entities = {};
    this.tables = {};
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
 * type >  @type any of  number > string > boolean > blob and must be specified
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
 * type : @type string should be "many" or "one"
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
    console.log("JSONDB version " + JSONDBversion);
    if (!config.password) {
      throw new Error("JSONDB: error password is empty ");
    }
    if (!config.username) {
      throw new Error("JSONDB: error username is empty ");
    }

    // getting keys

    function createKeys() {
      let keys = [];
      for (let i = 1500; i > 0; i -= 100) {
        let rrr = i - Math.round((Math.random() * i) / 4);
        keys.push(rrr);
      }
      keys = keys.join("-");
      console.log(`
      Copy your JSONDB encription keys below and secure it!
          ...................................................................................
                   ${keys}
          ...................................................................................
          `);
      return keys;
    }
    if (!config.encrypted) {
      console.warn("JSONDB: data will not be encrypted ");
    } else {
      this.visuality = secure(createKeys()).encrypt({ key: "Candour" }).key;
    }

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
    const connection = await this.getDB(this.DB_NAME);
    if (connection.encrypted && !details.keys) {
      throw new Error("JSONDB: No or invalid decription keys");
    }
    // checking if the keys are correct
    if (
      connection.encrypted &&
      !secure(details.keys).check(connection.visuality)
    ) {
      throw new Error("JsonDB: error invalid keys: Access Denied!");
    }
    connection.last_access_time = Date();
    return new JSONDBConnection(connection.Entities, details.keys);
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
    const types = ["number", "string", "boolean", "blob"];
    for (const [column, value] of Object.entries(columns)) {
      if (column) {
        if (!types.includes(value.type)) {
          throw new Error(
            "JSONDB: wrong data type given " +
              value.type +
              "  only number, string, boolean and blob are accepted"
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
