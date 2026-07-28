'''
from lib.task import Task

class TaskRepository():
    def __init__(self, connection):
        self._connection = connection

    def all(self):
        rows = self._connection.execute("SELECT * FROM tasks;")
        return [Task(row["task"], row["task_status"], row["id"]) for row in rows]
    
    def create(self, task):
        self._connection.execute("INSERT INTO tasks (user_id, task, task_status) VALUES (%s, %s, %s)", 
                                [task.user_id, task.task, task.task_status])
        return None
        
    def remove(self, id):
        self._connection.execute("DELETE FROM tasks WHERE id = %s", [id])
        return None
'''