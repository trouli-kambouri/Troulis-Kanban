'''
from lib.user import User

class UserRepository():
    def __init__(self, connection):
        self._connection = connection

    def all(self):
        rows = self._connection.execute('SELECT * FROM users')
        users = []
        for row in rows:
            item = User(row["name"], row ["password_hash"], row["id"])
            users.append(item)
        return users
    
    def create(self, user):
        rows = self._connection.execute("SELECT name FROM users;")
        name_list = [row["name"] for row in rows]
        if user.name in name_list:
            raise ValueError(
                "Your name is already logged! Please log in " + user.name + " :). Or, choose a new name for a new account."
            )
        self._connection.execute
        (
            "INSERT INTO users (name, password_hash) "
            "VALUES (%s, %s)", [user.name, user.password_hash]
        )
        return None
    
    def find_by_name(self, name):        
        result = self._connection.execute('SELECT * FROM users WHERE name = %s', [name])

        if not result:
            return None
        
        user = result[0]

        return User(user["name"], user["password_hash"], user["id"])
    
    def find_by_user_id(self, user_id):
        result = self._connection.execute(
            'SELECT * FROM users WHERE id = %s', [user_id])
        if not result:
            return None
        user = result[0]
        return User(user["name"], user["password_hash"], user["id"])
        '''