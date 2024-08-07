import SQLite from 'react-native-sqlite-storage';

const database_name = "HarcamaApp.db";
const database_version = "1.0";
const database_displayname = "Harcama Database";
const database_size = 200000;

let db;

export const initDB = async (): Promise<void> => {
  return new Promise<void>((resolve, reject) => {
    db = SQLite.openDatabase(
      database_name,
      database_version,
      database_displayname,
      database_size,
      async () => {
        console.log("Database opened");
        try {
          await createTables();
          await clearAllData();  // Tüm verileri sil
          insertTestData();  // Test verilerini eklemek için çağrı
          resolve();
        } catch (error) {
          reject(error);
        }
      },
      (err) => {
        console.error("Error opening database: ", err);
        reject(err);
      }
    );
  });
};

export const createTables = async (): Promise<void> => {
  return new Promise<void>((resolve, reject) => {
    db.transaction(tx => {
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
export const clearAllData = async (): Promise<void> => {
  return new Promise<void>((resolve, reject) => {
    db.transaction(tx => {
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
  type: string,
  account_type: string,
  title: string,
  amount: number,
  currency: string,
  repeat_frequency: string,
  date: string,
  note: string,
  category: string
) => {
  db.transaction(tx => {
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

export const getExpenses = (callback: (expenses: any[]) => void) => {
  db.transaction(tx => {
    tx.executeSql(
      'SELECT * FROM Expenses',
      [],
      (tx, results) => {
        const rows = results.rows;
        let expenses: any[] = [];
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

export const updateExpense = (
  id: number,
  type: string,
  account_type: string,
  title: string,
  amount: number,
  currency: string,
  repeat_frequency: string,
  date: string,
  note: string,
  category: string
) => {
  db.transaction(tx => {
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
    ["Gelir", "Banka", "Freelance İş", 3000, "EUR", "Bir kez", "2024-08-05", "Freelance yazılım işi", "Gelir"],
    ["Gider", "Banka", "Su Faturası", 100, "TRY", "Aylık", "2024-08-06", "Ağustos su faturası", "Fatura"],
    ["Gider", "Banka", "İnternet Faturası", 120, "TRY", "Aylık", "2024-08-07", "Ağustos internet faturası", "Fatura"],
    ["Gider", "Banka", "Telefon Faturası", 80, "USD", "Aylık", "2024-08-08", "Ağustos telefon faturası", "Fatura"],
    ["Gider", "Banka", "Sinema", 50, "TRY", "Bir kez", "2024-08-09", "Sinema bileti", "Eğlence"],
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
