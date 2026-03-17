"""
SEMESTER WEBAPP (FLASK)
-----------------------
Starta med:
python app.py

Öppna:
http://127.0.0.1:5000
"""

from flask import Flask, render_template, request, redirect
import sqlite3

app = Flask(__name__)

# ==========================================
# 🔹 DATABASE
# ==========================================

def get_db():
    return sqlite3.connect("database.db")


def init_db():
    conn = get_db()
    cursor = conn.cursor()

    cursor.execute("""
    CREATE TABLE IF NOT EXISTS employees (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT
    )
    """)

    cursor.execute("""
    CREATE TABLE IF NOT EXISTS vacations (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        employee_id INTEGER,
        start_date TEXT,
        end_date TEXT
    )
    """)

    conn.commit()
    conn.close()


# ==========================================
# 🔹 ROUTES
# ==========================================

@app.route("/")
def index():
    conn = get_db()
    cursor = conn.cursor()

    cursor.execute("SELECT * FROM employees")
    employees = cursor.fetchall()

    cursor.execute("""
    SELECT v.id, e.name, v.start_date, v.end_date
    FROM vacations v
    JOIN employees e ON v.employee_id = e.id
    """)
    vacations = cursor.fetchall()

    conn.close()

    return render_template("index.html", employees=employees, vacations=vacations)


# ==========================================
# ➕ LÄGG TILL PERSONAL
# ==========================================

@app.route("/add_employee", methods=["GET", "POST"])
def add_employee():
    if request.method == "POST":
        name = request.form["name"]

        conn = get_db()
        cursor = conn.cursor()
        cursor.execute("INSERT INTO employees (name) VALUES (?)", (name,))
        conn.commit()
        conn.close()

        return redirect("/")

    return render_template("add_employee.html")


# ==========================================
# 📅 LÄGG TILL SEMESTER
# ==========================================

@app.route("/add_vacation", methods=["GET", "POST"])
def add_vacation():
    conn = get_db()
    cursor = conn.cursor()
    cursor.execute("SELECT * FROM employees")
    employees = cursor.fetchall()

    if request.method == "POST":
        emp_id = request.form["employee_id"]
        start = request.form["start_date"]
        end = request.form["end_date"]

        cursor.execute("""
        INSERT INTO vacations (employee_id, start_date, end_date)
        VALUES (?, ?, ?)
        """, (emp_id, start, end))

        conn.commit()
        conn.close()

        return redirect("/")

    return render_template("add_vacation.html", employees=employees)


# ==========================================
# 🚀 START
# ==========================================

if __name__ == "__main__":
    init_db()
    app.run(debug=True)
