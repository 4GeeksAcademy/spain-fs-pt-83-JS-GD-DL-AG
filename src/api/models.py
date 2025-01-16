from flask_sqlalchemy import SQLAlchemy

db = SQLAlchemy()

class User(db.Model):
    __tablename__ = 'users' 

    id = db.Column(db.Integer, primary_key=True)  
    username = db.Column(db.String(50), nullable=False, unique=True) 
    email = db.Column(db.String(100), nullable=False, unique=True)  
    password = db.Column(db.String(250), nullable=False)  
    
    favorites = db.relationship('Favorite', back_populates='user')

    def __repr__(self):
        return f'<User {self.username}>'

    def serialize(self):
        return {
            "id": self.id,
            "username": self.username,
            "email": self.email,
        }


class Document(db.Model): 
    __tablename__ = 'documents'  

    id = db.Column(db.Integer, primary_key=True)  
    title = db.Column(db.String(250), nullable=False)  
    description = db.Column(db.String(200), nullable=True)
    type = db.Column(db.String(100), nullable=False) 
    category = db.Column(db.String(100), nullable=False)
    
    favorites = db.relationship('Favorite', back_populates='document')

    def __repr__(self):
        return f'<Document {self.title}>'


class Favorite(db.Model):  
    __tablename__ = 'favorites'  

    id = db.Column(db.Integer, primary_key=True) 
    user_id = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=False)  
    document_id = db.Column(db.Integer, db.ForeignKey('documents.id'), nullable=False)  

    user = db.relationship('User', back_populates='favorites')
    document = db.relationship('Document', back_populates='favorites')

    def __repr__(self):
        return f'<Favorite user_id={self.user_id} document_id={self.document_id}>'
