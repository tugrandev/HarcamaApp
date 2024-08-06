import SQLite from 'react-native-sqlite-storage';

const database_name = "TestDB.db";
const database_version = "1.0";
const database_displayname = "SQLite Test Database";
const database_size = 200000;

let db;

export const initDB = () => {
  db = SQLite.openDatabase(
    database_name,
    database_version,
    database_displayname,
    database_size,
    () => {
      console.log("Database opened");
    },
    (err) => {
      console.error("Error opening database: ", err);
    }
  );
};

export const createTable = () => {
  db.transaction(tx => {
    tx.executeSql(
      `CREATE TABLE IF NOT EXISTS Users (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT,
        age INTEGER
      );`,
      [],
      () => {
        console.log("Table created successfully");
      },
      (err) => {
        console.error("Error creating table: ", err);
      }
    );
  });
};

export const insertUser = (name, age) => {
  db.transaction(tx => {
    tx.executeSql(
      'INSERT INTO Users (name, age) VALUES (?,?)',
      [name, age],
      (tx, results) => {
        if (results.rowsAffected > 0) {
          console.log("User added successfully");
        } else {
          console.log("Failed to add user");
        }
      },
      (err) => {
        console.error("Error inserting user: ", err);
      }
    );
  });
};

export const getUsers = (callback) => {
  db.transaction(tx => {
    tx.executeSql(
      'SELECT * FROM Users',
      [],
      (tx, results) => {
        const rows = results.rows;
        let users = [];
        for (let i = 0; i < rows.length; i++) {
          users.push(rows.item(i));
        }
        callback(users);
      },
      (err) => {
        console.error("Error fetching users: ", err);
      }
    );
  });
};
