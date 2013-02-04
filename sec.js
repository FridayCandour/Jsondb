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
        if (k === "index" || k === "relations" || typeof data[k] !== "string") {
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
            data[k][i] = chars[clamp(0, 9, Math.round(Math.random() * 9))];
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
        ff.relations = data["relations"];
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
        // console.log(data.join("") + " checking keys!");
        if (data.join("").includes("Candour")) {
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
            if (
              k === "index" ||
              k === "relations" ||
              typeof data[k] !== "string"
            ) {
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
  
                if (data[z][k] * 1 !== NaN) {
                  data[z][k] *= 1;
                }
                if (data[z][k] === "false") {
                  data[z][k] = false;
                }
                if (data[z][k] === "true") {
                  data[z][k] = true;
                }
              }
            }
            ff[k] = data[z][k].join("");
          }
          if (data[z].index) {
            ff.index = data[z]["index"];
          }
          if (data[z].relations) {
            ff.relations = data[z]["relations"];
          }
          // console.log(ff);
          return ff;
        }
      } else {
        for (const k in data) {
          if (k === "index" || k === "relations" || typeof data[k] !== "string") {
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
              if (data[k] * 1 !== NaN) {
                data[k] *= 1;
              }
              if (data[k] === "false") {
                data[k] = false;
              }
              if (data[k] === "true") {
                data[k] = true;
              }
            }
          }
          ff[k] = data[k].join("");
        }
        if (data.index) {
          ff.index = data["index"];
        }
        if (data.relations) {
          ff.relations = data["relations"];
        }
        // console.log(ff);
        return ff;
      }
    }
    return { encrypt, decrypt, check };
  };

  

  //


  function createKeys() {
    let keys = [];
    for (let i = 1500; i > 0; i -= 100) {
      let rrr = i - Math.round((Math.random() * i) / 50);
      keys.push(rrr);
    }
    keys = keys.join("-");
    console.log(`
 \x1B[1m   \x1B[33m Welcome to JsonDB version ${JSONDBversion}, Your JSONDB Database is now encrypted!  \x1B[39m  \x1B[22m

    \x1B[32m
    \x1B[1m  Copy your JSONDB encryption keys below and secure it! \x1B[22m
    \x1B[34m
        ...................................................................................
      \x1B[2m          ${keys} \x1B[22m
        ...................................................................................
   

\x1B[3m \x1B[33m NB: Compulsory read \x1B[23m
     \x1B[31m
   - Lose of keys means lose of access to data
   - Incorrect Keys are rejected by the JsonDB Algorithm
   - Nothing Regarding your keys is Stored in the database file
   - Encryption cannot be Reversed without your KEYS
   - The Encryption Algorithm cannot BE BROKEN
   - We bear no Damages Regarding Your use of this DataBase
   - Refer to the Lincence before USE
      
   \x1B[39m
        `);
    return keys;
  }
  if (!config.encrypted) {
    console.warn(`\x1B[34m JSONDB: data will not be encrypted! \x1B[39m`);
  } else {
    this.visuality = secure(createKeys()).encrypt({ key: "Candour" }).key;
  }