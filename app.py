'''
from flask import Flask, render_template, request, redirect, session, flash
from lib.database_connection import DatabaseConnection
from lib.user import User
from lib.user_repository import UserRepository
from lib.task import Task
from lib.task_repository import TaskRepository

app = Flask(__name__)
app.secret_key = "a_very_secret_key"

@app.route("/", methods = ['GET'])
def home():
    connection = DatabaseConnection()
    connection.connect()
    return render_template("index.html")

@app.route("/register", methods = ['GET'])
def register():
    return render_template("register.html")

@app.route("/register", methods = ['POST'])
def register():
    connection = DatabaseConnection()
    connection.connect()
    user_details = request.form
    new_user = User(name=user_details["name"], password_hash=user_details["password"])
    try:
        UserRepository.create(new_user)
        flash("Sign up successful!", "success")
        return redirect('/login')
    except ValueError as e:
        flash(str(e), "error")
        return redirect("/register")
    return None

@app.route("/login", methods = ['GET'])
def login():
    return render_template("login.html")

if __name__ == "__main__":
    app.run(port=5001, debug=True)
'''