import SQLite from 'react-native-sqlite-storage';

const database_name = "HarcamaApp.db";
const database_version = "1.0";
const database_displayname = "Harcama Database";
const database_size = 200000;

let db;

export const initDB = () => {
  return new Promise((resolve, reject) => {
    SQLite.openDatabase(
      database_name,
      database_version,
      database_displayname,
      database_size,
      (database) => {
        db = database;
        console.log("Database opened");
        createTables()
          .then(() => resolve())
          .catch((error) => reject(error));
      },
      (err) => {
        console.error("Error opening database: ", err);
        reject(err);
      }
    );
  });
};

export const createTables = () => {
  if (!db) {
    throw new Error("Database is not initialized. Please call initDB first.");
  }

  return new Promise((resolve, reject) => {
    db.transaction((tx) => {
      tx.executeSql(
        `CREATE TABLE IF NOT EXISTS Expenses (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          type TEXT,
          account_type TEXT,
          title TEXT,
          amount REAL,
          currency TEXT,
          repeat_frequency TEXT,
          date TEXT,
          note TEXT,
          category TEXT
        );`,
        [],
        () => {
          console.log("Expenses table created successfully");
          resolve();
        },
        (err) => {
          console.error("Error creating Expenses table: ", err);
          reject(err);
        }
      );
    });
  });
};

// Tüm verileri silme işlevi
export const clearAllData = () => {
  if (!db) {
    throw new Error("Database is not initialized. Please call initDB first.");
  }

  return new Promise((resolve, reject) => {
    db.transaction((tx) => {
      tx.executeSql(
        'DELETE FROM Expenses',
        [],
        () => {
          console.log("All data deleted successfully");
          resolve();
        },
        (err) => {
          console.error("Error deleting all data: ", err);
          reject(err);
        }
      );
    });
  });
};

export const insertExpense = (
  type,
  account_type,
  title,
  amount,
  currency,
  repeat_frequency,
  date,
  note,
  category
) => {
  if (!db) {
    throw new Error("Database is not initialized. Please call initDB first.");
  }

  db.transaction((tx) => {
    tx.executeSql(
      'INSERT INTO Expenses (type, account_type, title, amount, currency, repeat_frequency, date, note, category) VALUES (?,?,?,?,?,?,?,?,?)',
      [type, account_type, title, amount, currency, repeat_frequency, date, note, category],
      (tx, results) => {
        if (results.rowsAffected > 0) {
          console.log("Expense added successfully");
        } else {
          console.log("Failed to add expense");
        }
      },
      (err) => {
        console.error("Error inserting expense: ", err);
      }
    );
  });
};

export const getExpenses = (callback) => {
  if (!db) {
    throw new Error("Database is not initialized. Please call initDB first.");
  }

  db.transaction((tx) => {
    tx.executeSql(
      'SELECT * FROM Expenses',
      [],
      (tx, results) => {
        const rows = results.rows;
        let expenses = [];
        for (let i = 0; i < rows.length; i++) {
          expenses.push(rows.item(i));
        }
        callback(expenses);
      },
      (err) => {
        console.error("Error fetching expenses: ", err);
      }
    );
  });
};

// Belirli bir tarihteki verileri getirme işlevi
export const getExpensesByDate = (date, callback) => {
  if (!db) {
    throw new Error("Database is not initialized. Please call initDB first.");
  }

  db.transaction((tx) => {
    tx.executeSql(
      'SELECT * FROM Expenses WHERE date = ?',
      [date],
      (tx, results) => {
        const rows = results.rows;
        let expenses = [];
        for (let i = 0; i < rows.length; i++) {
          expenses.push(rows.item(i));
        }
        callback(expenses);
      },
      (err) => {
        console.error("Error fetching expenses by date: ", err);
      }
    );
  });
};

export const updateExpense = (
  id,
  type,
  account_type,
  title,
  amount,
  currency,
  repeat_frequency,
  date,
  note,
  category
) => {
  if (!db) {
    throw new Error("Database is not initialized. Please call initDB first.");
  }

  db.transaction((tx) => {
    tx.executeSql(
      'UPDATE Expenses SET type = ?, account_type = ?, title = ?, amount = ?, currency = ?, repeat_frequency = ?, date = ?, note = ?, category = ? WHERE id = ?',
      [type, account_type, title, amount, currency, repeat_frequency, date, note, category, id],
      (tx, results) => {
        if (results.rowsAffected > 0) {
          console.log("Expense updated successfully");
        } else {
          console.log("Failed to update expense");
        }
      },
      (err) => {
        console.error("Error updating expense: ", err);
      }
    );
  });
};