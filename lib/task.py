'''
class Task():
    def __init__(self, task, task_status, id=None):
        self.task = task
        self.task_status = task_status
        self.id = id

def __repr__(self):

    return(f"Task{self.id}, {self.task}, {self.task_status})")

def __eq__(self, other):
    return self.__dict__ == other.__dict__
    '''