import JSONDB, { JSONDBversion } from "./index.js";
// creating a new JSONDB object
const database = new JSONDB();
// iniatialises a new JSONDB database instance and created the database file
database.init({
  name: "Student_exam_record_data_base",
  password: "password",
  username: "jsondb_username",
  encrypted: false,
});

const ExamRecordSchema = database.schema({
  name: "ExamRecord",
  columns: {
    totalScores: {
      type: "number",
    },
    examDate: {
      type: "string",
      nullable: true,
    },
    totalSubjects: {
      type: "number",
    },
  },
});

// creating schema (tables) in JSONDB
const StudentSchema = database.schema({
  name: "Student",
  columns: {
    Student_name: {
      type: "string",
    },
    age: {
      type: "number",
    },
    class: {
      type: "string",
    },
    handicap: {
      type: "boolean",
      nullable: true,
    },
    classNumber: {
      type: "number",
      // unique: true,
    },
  },
  // adding relations definition
  relations: {
    ExamRecord: {
      target: ExamRecordSchema,
      type: "many",
    },
  },
});

// writes table schema into your JSONDB instance file
database.assemble([ExamRecordSchema, StudentSchema]);

const details = {
  password: "password",
  username: "jsondb_username",
  keys: "1488-1373-1292-1182-1085-996-885-796-690-598-494-395-296-196-99",
};
// a connection needs details for security
const connection = await database.createJSONDBConnection(details);
// // creating and adding stuff into JSONDB tables
const StudentTable = connection.getTable("Student");
let Student = {
  Student_name: "friday candour",
  age: 121, // years old
  class: "Senior javascript typescript developer full stack and mobile",
  handicap: false,
  classNumber: 1, // this unique remember
};

const save_Student = await StudentTable.save(Student);
console.log(save_Student);

const ExamRecordTable = connection.getTable("ExamRecord");
const ExamRecord = {
  totalScores: 1000,
  examDate: Date(), //humm this is nullable yeah
  totalSubjects: 1000,

  // this following fake properties will not be added
  // because they are not in the schema even if you put them above those
  // it works  :)
  this_fake_properties_will_not_be_added: "fake",
  hello: "am hungry but i love coding",
  if_i_have_electricity_and_wifi_then: "no problem",
};

const Exam_record = await ExamRecordTable.save(ExamRecord);

const ExamRecord2 = {
  totalScores: 10,
  // examDate: Date(), //humm this is nullable yeah
  totalSubjects: 1000,
};

const Exam_record2 = await ExamRecordTable.save(ExamRecord2);

const allExamRecord = await ExamRecordTable.getAll();
const allStudent = await StudentTable.getAll();
console.log(allExamRecord, allStudent);
// saving with relations in JSONDB
// note save before adding as a relation
console.log(save_Student, 99);
await StudentTable.saveWithRelations(
  ExamRecordTable,
  save_Student,
  Exam_record
);
await StudentTable.saveWithRelations(
  ExamRecordTable,
  save_Student,
  Exam_record2
);

const get = await ExamRecordTable.getWhereAny({ totalScores: 10 }, 1);
console.log(get);
