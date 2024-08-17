import SQLite from 'react-native-sqlite-storage';

const database_name = 'HarcamaApp.db';
const database_version = '1.0';
const database_displayname = 'Harcama Database';
const database_size = 200000;

let db;

export const initDB = () => {
  return new Promise((resolve, reject) => {
    SQLite.openDatabase(
      database_name,
      database_version,
      database_displayname,
      database_size,
      database => {
        db = database;
        console.log('Database opened');
        clearAllDataFromAccounts();
        createTables()
          .then(() => resolve())
          .catch(error => reject(error));
      },
      err => {
        console.error('Error opening database: ', err);
        reject(err);
      },
    );
  });
};

export const createTables = () => {
  if (!db) {
    throw new Error('Database is not initialized. Please call initDB first.');
  }

  return new Promise((resolve, reject) => {
    db.transaction(tx => {
      // Expenses tablosu oluşturulması
      tx.executeSql(
        `CREATE TABLE IF NOT EXISTS Expenses (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          add_type TEXT,
          account_type TEXT,
          category TEXT,
          amount REAL,
          currency TEXT,
          repeat_frequency TEXT,
          date TEXT,
          situation TEXT,
          note TEXT
        );`,
        [],
        () => {
          console.log('Expenses table created successfully');
        },
        err => {
          console.error('Error creating Expenses table: ', err);
          reject(err);
        },
      );

      // Accounts tablosu oluşturulması
      tx.executeSql(
        `CREATE TABLE IF NOT EXISTS Accounts (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          account_name TEXT NOT NULL,
          currency TEXT NOT NULL,
          balance REAL DEFAULT 0
        );`,
        [],
        () => {
          console.log('Accounts table created successfully');
          // 3 tane hazır hesap ekle
          tx.executeSql(
            `INSERT INTO Accounts (account_name, currency, balance) VALUES 
            ('Maaş Hesabım', 'TRY', 1000),
            ('Dolar Hesabım', 'USD', 200),
            ('Euro Hesabım', 'EUR', 300);`,
            [],
            () => {
              console.log('Default accounts added successfully');
              resolve();
            },
            err => {
              console.error('Error inserting default accounts: ', err);
              reject(err);
            },
          );
        },
        err => {
          console.error('Error creating Accounts table: ', err);
          reject(err);
        },
      );
    });
  });
};


// Tüm verileri silme işlevi (Expenses tablosu)
export const clearAllDataFromExpenses = () => {
  if (!db) {
    throw new Error('Database is not initialized. Please call initDB first.');
  }

  return new Promise((resolve, reject) => {
    db.transaction(tx => {
      tx.executeSql(
        'DELETE FROM Expenses',
        [],
        () => {
          console.log('All data deleted successfully');
          resolve();
        },
        err => {
          console.error('Error deleting all data: ', err);
          reject(err);
        },
      );
    });
  });
};

export const clearAllDataFromAccounts = () => {
  if (!db) {
    throw new Error('Database is not initialized. Please call initDB first.');
  }

  return new Promise((resolve, reject) => {
    db.transaction(tx => {
      tx.executeSql(
        'DELETE FROM Accounts',
        [],
        () => {
          console.log('All data deleted successfully');
          resolve();
        },
        err => {
          console.error('Error deleting all data: ', err);
          reject(err);
        },
      );
    });
  });
};

// Harcama ekleme işlevi
export const insertExpense = (
  add_type,
  account_type,
  category,
  amount,
  currency,
  repeat_frequency,
  date,
  situation,
  note,
) => {
  if (!db) {
    throw new Error('Database is not initialized. Please call initDB first.');
  }

  db.transaction(tx => {
    tx.executeSql(
      'INSERT INTO Expenses (add_type, account_type, category, amount, currency, repeat_frequency, date, situation, note) VALUES (?,?,?,?,?,?,?,?,?)',
      [
        add_type,
        account_type,
        category,
        amount,
        currency,
        repeat_frequency,
        date,
        situation,
        note,
      ],
      (tx, results) => {
        if (results.rowsAffected > 0) {
          console.log('Expense added successfully');
        } else {
          console.log('Failed to add expense');
        }
      },
      err => {
        console.error('Error inserting expense: ', err);
      },
    );
  });
};

// Hesap ekleme işlevi
export const insertAccount = (account_name, currency, balance = 0) => {
  if (!db) {
    throw new Error('Database is not initialized. Please call initDB first.');
  }

  db.transaction(tx => {
    tx.executeSql(
      'INSERT INTO Accounts (account_name, currency, balance) VALUES (?,?,?)',
      [account_name, currency, balance],
      (tx, results) => {
        if (results.rowsAffected > 0) {
          console.log('Account added successfully');
        } else {
          console.log('Failed to add account');
        }
      },
      err => {
        console.error('Error inserting account: ', err);
      },
    );
  });
};

// Harcamaları getirme işlevi
export const getExpenses = callback => {
  if (!db) {
    throw new Error('Database is not initialized. Please call initDB first.');
  }

  db.transaction(tx => {
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
      err => {
        console.error('Error fetching expenses: ', err);
      },
    );
  });
};

// Belirli bir tarihteki verileri getirme işlevi
export const getExpensesByDate = (date, callback) => {
  if (!db) {
    throw new Error('Database is not initialized. Please call initDB first.');
  }

  db.transaction(tx => {
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
      err => {
        console.error('Error fetching expenses by date: ', err);
      },
    );
  });
};

// Hesapları getirme işlevi
export const getAccounts = callback => {
  if (!db) {
    throw new Error('Database is not initialized. Please call initDB first.');
  }

  db.transaction(tx => {
    tx.executeSql(
      'SELECT * FROM Accounts',
      [],
      (tx, results) => {
        const rows = results.rows;
        let accounts = [];
        for (let i = 0; i < rows.length; i++) {
          accounts.push(rows.item(i));
        }
        callback(accounts);
      },
      err => {
        console.error('Error fetching accounts: ', err);
      },
    );
  });
};

// Harcama güncelleme işlevi
export const updateExpense = (
  add_type,
  account_type,
  category,
  amount,
  currency,
  repeat_frequency,
  date,
  situation,
  note,
) => {
  if (!db) {
    throw new Error('Database is not initialized. Please call initDB first.');
  }

  db.transaction(tx => {
    tx.executeSql(
      'UPDATE Expenses SET add_type = ?, account_type = ?, category = ?, amount = ?, currency = ?, repeat_frequency = ?, date = ?, situation = ?, note = ? WHERE id = ?',
      [
        add_type,
        account_type,
        category,
        amount,
        currency,
        repeat_frequency,
        date,
        situation,
        note,
      ],
      (tx, results) => {
        if (results.rowsAffected > 0) {
          console.log('Expense updated successfully');
        } else {
          console.log('Failed to update expense');
        }
      },
      err => {
        console.error('Error updating expense: ', err);
      },
    );
  });
};
