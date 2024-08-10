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
          .then(() => clearAllData())  // Tüm verileri sil
          .then(() => insertTestData())  // Test verilerini eklemek için çağrı
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

const insertTestData = () => {
  const testData = [
    ["Gelir", "Banka", "Maaş", 10000, "USD", "Aylık", "2024-08-01", "Ağustos maaşı", "Gelir"],
    ["Gider", "Banka", "Kira", 2500, "TRY", "Aylık", "2024-08-01", "Ağustos kira", "Kira"],
    ["Gider", "Banka", "Market Alışverişi", 150, "EUR", "Bir kez", "2024-08-02", "Market alışverişi", "Gıda"],
    ["Gider", "Banka", "Elektrik Faturası", 200, "TRY", "Aylık", "2024-08-03", "Ağustos elektrik faturası", "Fatura"],
    ["Gider", "Yatırım", "Borsa Yatırımı", 5000, "TRY", "Bir kez", "2024-08-04", "Borsa yatırımı", "Yatırım"],
    ["Gelir", "Banka", "Freelance İş", 3000, "EUR", "Bir kez", "2024-08-09", "Freelance yazılım işi", "Gelir"],
    ["Gider", "Banka", "Su Faturası", 100, "TRY", "Aylık", "2024-08-10", "Ağustos su faturası", "Fatura"],
    ["Gider", "Banka", "İnternet Faturası", 120, "TRY", "Aylık", "2024-08-12", "Ağustos internet faturası", "Fatura"],
    ["Gider", "Banka", "Telefon Faturası", 80, "USD", "Aylık", "2024-08-13", "Ağustos telefon faturası", "Fatura"],
    ["Gider", "Banka", "Sinema", 50, "TRY", "Bir kez", "2024-08-10", "Sinema bileti", "Eğlence"],
    ["Gelir", "Banka", "Referans Bonu", 2000, "TRY", "Bir kez", "2024-08-05", "Referans bonu", "Gelir"],
    ["Gelir", "Banka", "Bonus", 500, "TRY", "Aylık", "2024-08-06", "Ağustos bonus", "Gelir"],
    ["Gider", "Banka", "Kahve", 10, "TRY", "Bir kez", "2024-08-07", "Kahve", "Gıda"],
    ["Gider", "Banka", "Kitap Satışı", 20, "TRY", "Bir kez", "2024-08-08", "Kitap satışı", "Kütüphane"],
    ["Gelir", "Banka", "Banka İşlemi", 1000, "EUR", "Bir kez", "2024-08-11", "Banka işlemi", "Gelir"],
    ["Gider", "Banka", "Banka İşlemi", 500, "USD", "Aylık", "2024-08-14", "Banka işlemi", "Gider"],
    ["Gelir", "Hediye", "Hediye", 1000, "TRY", "Bir kez", "2024-08-15", "Hediye", "Gelir"],
    ["Gider", "Banka", "Kira", 1000, "EUR", "Aylık", "2024-08-16", "Kira", "Kira"],
    ["Gider", "Banka", "Elektrik Faturası", 500, "USD", "Bir kez", "2024-08-17", "Elektrik faturası", "Fatura"],
    ["Gider", "Banka", "Su Faturası", 150, "TRY", "Aylık", "2024-08-18", "Su faturası", "Fatura"],
    ["Gider", "Banka", "İnternet Faturası", 100, "EUR", "Bir kez", "2024-08-19", "İnternet faturası", "Fatura"],
    ["Gider", "Banka", "Telefon Faturası", 80, "USD", "Aylık", "2024-08-20", "Telefon faturası", "Fatura"],
    ["Gelir", "Banka", "Freelance İş", 2000, "TRY", "Bir kez", "2024-08-21", "Freelance iş", "Gelir"],
    ["Gider", "Banka", "Market Alışverişi", 200, "EUR", "Aylık", "2024-08-22", "Market alışverişi", "Gıda"],
    ["Gider", "Banka", "Elektrik Faturası", 150, "TRY", "Bir kez", "2024-08-23", "Elektrik faturası", "Fatura"],
    ["Gelir", "Banka", "Maaş", 3000, "EUR", "Aylık", "2024-08-24", "Maaş", "Gelir"],
    ["Gider", "Banka", "Kira", 1000, "USD", "Bir kez", "2024-08-25", "Kira", "Kira"],
    ["Gider", "Banka", "Sinema", 100, "TRY", "Aylık", "2024-08-26", "Sinema", "Eğlence"],
  ];

  testData.forEach(expense => {
    insertExpense(
      expense[0],
      expense[1],
      expense[2],
      expense[3],
      expense[4],
      expense[5],
      expense[6],
      expense[7],
      expense[8]
    );
  });
};
