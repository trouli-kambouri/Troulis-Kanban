'''
class User():
    def __init__(self, name, password_hash, id = None):
        self.id = id
        self.name = name
        self.password_hash = password_hash

    def __repr__(self):
        return(f"User({self.id}, {self.name}, {self.password_hash})")
    
    def __eq__(self, other):
        return self.__dict__ == other.__dict__
        '''