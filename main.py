"""
SEMESTERPLANERING - ENKEL VERSION
--------------------------------
Funktioner:
- Lägg till personal
- Ta bort personal
- Visa personal
- Ansök om semester
- Visa semesterlista

Databas:
- SQLite (sparas lokalt i samma mapp)

Kör:
python main.py
"""

import sqlite3
from datetime import datetime

# ==========================================
# 🔹 DATABAS SETUP
# ==========================================

def init_db():
    """Skapar databasen och tabeller om de inte finns"""
    conn = sqlite3.connect("database.db")
    cursor = conn.cursor()

    # Tabell: personal
    cursor.execute("""
    CREATE TABLE IF NOT EXISTS employees (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT NOT NULL
    )
    """)

    # Tabell: semester
    cursor.execute("""
    CREATE TABLE IF NOT EXISTS vacations (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        employee_id INTEGER,
        start_date TEXT,
        end_date TEXT,
        status TEXT,
        FOREIGN KEY(employee_id) REFERENCES employees(id)
    )
    """)

    conn.commit()
    conn.close()


# ==========================================
# 🔹 PERSONALHANTERING
# ==========================================

def add_employee():
    """Lägg till en ny anställd"""
    name = input("Ange namn: ")

    conn = sqlite3.connect("database.db")
    cursor = conn.cursor()

    cursor.execute("INSERT INTO employees (name) VALUES (?)", (name,))
    conn.commit()
    conn.close()

    print("✅ Anställd tillagd!")


def remove_employee():
    """Ta bort anställd"""
    show_employees()
    emp_id = input("Ange ID att ta bort: ")

    conn = sqlite3.connect("database.db")
    cursor = conn.cursor()

    cursor.execute("DELETE FROM employees WHERE id = ?", (emp_id,))
    conn.commit()
    conn.close()

    print("❌ Anställd borttagen!")


def show_employees():
    """Visa alla anställda"""
    conn = sqlite3.connect("database.db")
    cursor = conn.cursor()

    cursor.execute("SELECT * FROM employees")
    employees = cursor.fetchall()

    print("\n--- PERSONAL ---")
    for emp in employees:
        print(f"ID: {emp[0]} | Namn: {emp[1]}")

    conn.close()


# ==========================================
# 🔹 SEMESTERHANTERING
# ==========================================

def add_vacation():
    """Registrera semester"""
    show_employees()
    emp_id = input("Ange anställd ID: ")

    start = input("Startdatum (YYYY-MM-DD): ")
    end = input("Slutdatum (YYYY-MM-DD): ")

    # Enkel validering
    try:
        datetime.strptime(start, "%Y-%m-%d")
        datetime.strptime(end, "%Y-%m-%d")
    except:
        print("❌ Fel datumformat!")
        return

    conn = sqlite3.connect("database.db")
    cursor = conn.cursor()

    cursor.execute("""
    INSERT INTO vacations (employee_id, start_date, end_date, status)
    VALUES (?, ?, ?, ?)
    """, (emp_id, start, end, "PENDING"))

    conn.commit()
    conn.close()

    print("📅 Semester ansökan sparad!")


def show_vacations():
    """Visa alla semester"""
    conn = sqlite3.connect("database.db")
    cursor = conn.cursor()

    cursor.execute("""
    SELECT v.id, e.name, v.start_date, v.end_date, v.status
    FROM vacations v
    JOIN employees e ON v.employee_id = e.id
    """)

    vacations = cursor.fetchall()

    print("\n--- SEMESTER ---")
    for vac in vacations:
        print(f"""
ID: {vac[0]}
Namn: {vac[1]}
Period: {vac[2]} → {vac[3]}
Status: {vac[4]}
------------------------
""")

    conn.close()


# ==========================================
# 🔹 MENY (ENKEL UI)
# ==========================================

def menu():
    """Huvudmeny"""
    while True:
        print("""
==============================
 SEMESTERPLANERING
==============================
1. Lägg till personal
2. Ta bort personal
3. Visa personal
4. Ansök semester
5. Visa semester
0. Avsluta
        """)

        choice = input("Välj: ")

        if choice == "1":
            add_employee()
        elif choice == "2":
            remove_employee()
        elif choice == "3":
            show_employees()
        elif choice == "4":
            add_vacation()
        elif choice == "5":
            show_vacations()
        elif choice == "0":
            print("👋 Hejdå!")
            break
        else:
            print("❌ Ogiltigt val")


# ==========================================
# 🔹 START
# ==========================================

if __name__ == "__main__":
    init_db()
    menu()
