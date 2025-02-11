from datetime import datetime
from flask_sqlalchemy import SQLAlchemy
import bcrypt

db = SQLAlchemy()

class User(db.Model):
    __tablename__ = 'users' 

    id = db.Column(db.Integer, primary_key=True)  
    username = db.Column(db.String(50), nullable=False, unique=True) 
    email = db.Column(db.String(100), nullable=False, unique=True)  
    password = db.Column(db.String(250), nullable=False) 
    auth_method = db.Column(db.String(20), default='email')
    avatar = db.Column(db.String(500), nullable=True, default="https://images.squarespace-cdn.com/content/v1/54b7b93ce4b0a3e130d5d232/1519986430884-H1GYNRLHN0VFRF6W5TAN/icon.png?format=750w")
    
    favorites = db.relationship('Favorites', back_populates='user')
    tasks = db.relationship('Task', back_populates='user')

    experience = db.Column(db.Integer, default=0)
    streak = db.Column(db.Integer, default=0)

    badges = db.relationship('UserBadge', back_populates='user', cascade="all, delete-orphan")
    upload_badges = db.relationship('UserUploadBadge', back_populates='user', cascade="all, delete-orphan")
    favorite_badges = db.relationship('UserFavoriteBadge', back_populates='user',cascade="all, delete-orphan")

    def to_dict(self):
        return {
            "id": self.id,
            "username": self.username,
            "email": self.email,
            "experience": self.experience
        }

    def __repr__(self):
        return f'<User {self.username}>'

    def serialize(self):
        return {
            "id": self.id,
            "username": self.username,
            "email": self.email,
            "avatar": self.avatar
        }


class Badge(db.Model):
    __tablename__ = "badges"

    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(100), unique=True, nullable=False)
    description = db.Column(db.String(255), nullable=False)
    icon = db.Column(db.String(255))  # URL del icono de la insignia

    users = db.relationship('UserBadge', back_populates='badge', cascade="all, delete-orphan")
    upload_badges = db.relationship('UploadBadge', back_populates='badge', cascade="all, delete-orphan")
    favorite_badges = db.relationship('FavoriteBadge', back_populates='badge', cascade="all, delete-orphan")

    def to_dict(self):
        return {"id": self.id, "name": self.name, "description": self.description, "icon": self.icon}


class UserBadge(db.Model):
    __tablename__ = "user_badge"

    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('users.id', ondelete="CASCADE"), nullable=False)
    badge_id = db.Column(db.Integer, db.ForeignKey('badges.id', ondelete="CASCADE"), nullable=False)
    earned_at = db.Column(db.DateTime, default=datetime.utcnow)

    user = db.relationship('User', back_populates='badges')
    badge = db.relationship('Badge', back_populates='users')

    user_upload_badges = db.relationship('UserUploadBadge', back_populates='user_badge', cascade="all, delete-orphan")
    user_favorite_badges = db.relationship('UserFavoriteBadge', back_populates='user_badge', cascade="all, delete-orphan")

    def to_dict(self):
        return {
            "user_id": self.user_id,
            "badge_id": self.badge_id,
            "earned_at": self.earned_at.isoformat(),
            "badge": self.badge.to_dict()
        }


class UploadBadge(db.Model):
    __tablename__ = 'upload_badges'

    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(100), unique=True, nullable=False)
    description = db.Column(db.String(255), nullable=False)
    documents_required = db.Column(db.Integer, nullable=False)  # Cantidad de documentos requeridos para el nivel
    xp_reward = db.Column(db.Integer, default=0)  # Experiencia ganada por alcanzar el nivel

    # Relación con Badge (muchos a uno)
    badge_id = db.Column(db.Integer, db.ForeignKey('badges.id', ondelete="CASCADE"))
    badge = db.relationship('Badge', back_populates='upload_badges')

    users = db.relationship('UserUploadBadge', back_populates='upload_badge', cascade="all, delete-orphan")

    def to_dict(self):
        return {
            'id': self.id,
            'name': self.name,
            'description': self.description,
            'documents_required': self.documents_required,
            'xp_reward': self.xp_reward,
            'badge': self.badge.to_dict() if self.badge else None  # Relación con Badge
        }


class UserUploadBadge(db.Model):
    __tablename__ = 'user_upload_badges'

    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('users.id', ondelete="CASCADE"), nullable=False)
    upload_badge_id = db.Column(db.Integer, db.ForeignKey('upload_badges.id', ondelete="CASCADE"), nullable=False)
    user_badge_id = db.Column(db.Integer, db.ForeignKey('user_badge.id', ondelete="CASCADE"))  # Relación con UserBadge
    earned_at = db.Column(db.DateTime, default=datetime.utcnow)
    documents_uploaded = db.Column(db.Integer, default=0)  # Para llevar cuenta de cuántos documentos ha subido

    user = db.relationship('User', back_populates='upload_badges')
    upload_badge = db.relationship('UploadBadge', back_populates='users')
    user_badge = db.relationship('UserBadge', back_populates='user_upload_badges')  # Relación con UserBadge

    def assign_badge(self):
        if self.documents_uploaded >= 20:
            badge = UploadBadge.query.filter_by(name="Archivista").first()
            if not badge:
                badge = UploadBadge(name="Archivista", documents_required=20)
                db.session.add(badge)
        elif self.documents_uploaded >= 10:
            badge = UploadBadge.query.filter_by(name="Bibliotecario").first()
            if not badge:
                badge = UploadBadge(name="Bibliotecario", documents_required=10)
                db.session.add(badge)
        elif self.documents_uploaded >= 5:
            badge = UploadBadge.query.filter_by(name="Contribuidor").first()
            if not badge:
                badge = UploadBadge(name="Contribuidor", documents_required=5)
                db.session.add(badge)
        else:
            badge = None

        if badge:
            self.upload_badge = badge
            db.session.commit()

    def to_dict(self):
        return {
            "user_id": self.user_id,
            "upload_badge_id": self.upload_badge_id,
            "user_badge_id": self.user_badge_id,
            "earned_at": self.earned_at.isoformat(),
            "badge": self.upload_badge.to_dict(),
            "user_badge": self.user_badge.to_dict() if self.user_badge else None  # Relación con UserBadge
        }


class FavoriteBadge(db.Model):
    __tablename__ = 'favorite_badges'

    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(100), unique=True, nullable=False)
    description = db.Column(db.String(255), nullable=False)
    favorites_required = db.Column(db.Integer, nullable=False)  
    xp_reward = db.Column(db.Integer, default=0)  

    # Relación con Badge (muchos a uno)
    badge_id = db.Column(db.Integer, db.ForeignKey('badges.id', ondelete="CASCADE"))
    badge = db.relationship('Badge', back_populates='favorite_badges')

    users = db.relationship('UserFavoriteBadge', back_populates='favorite_badge', cascade="all, delete-orphan")

    def to_dict(self):
        return {
            'id': self.id,
            'name': self.name,
            'description': self.description,
            'favorites_required': self.favorites_required,
            'xp_reward': self.xp_reward,
            'badge': self.badge.to_dict() if self.badge else None  # Relación con Badge
        }


class UserFavoriteBadge(db.Model):
    __tablename__ = 'user_favorite_badges'

    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('users.id', ondelete="CASCADE"), nullable=False)
    favorite_badge_id = db.Column(db.Integer, db.ForeignKey('favorite_badges.id', ondelete="CASCADE"), nullable=False)
    user_badge_id = db.Column(db.Integer, db.ForeignKey('user_badge.id', ondelete="CASCADE"))  # Relación con UserBadge
    earned_at = db.Column(db.DateTime, default=datetime.utcnow)
    favorites_count = db.Column(db.Integer, default=0)  # Para llevar cuenta de cuántos favoritos ha hecho el usuario

    user = db.relationship('User', back_populates='favorite_badges')
    favorite_badge = db.relationship('FavoriteBadge', back_populates='users')
    user_badge = db.relationship('UserBadge', back_populates='user_favorite_badges')  # Relación con UserBadge

    def assign_badge(self):
        if self.favorites_count >= 20:
            badge = FavoriteBadge.query.filter_by(name="Coleccionista").first()
            if not badge:
                badge = FavoriteBadge(name="Coleccionista", favorites_required=20)
                db.session.add(badge)
        elif self.favorites_count >= 10:
            badge = FavoriteBadge.query.filter_by(name="Entusiasta").first()
            if not badge:
                badge = FavoriteBadge(name="Entusiasta", favorites_required=10)
                db.session.add(badge)
        elif self.favorites_count >= 5:
            badge = FavoriteBadge.query.filter_by(name="Amigo").first()
            if not badge:
                badge = FavoriteBadge(name="Amigo", favorites_required=5)
                db.session.add(badge)
        else:
            badge = None

        if badge:
            self.favorite_badge = badge
            db.session.commit()

    def to_dict(self):
        return {
            "user_id": self.user_id,
            "favorite_badge_id": self.favorite_badge_id,
            "user_badge_id": self.user_badge_id,
            "earned_at": self.earned_at.isoformat(),
            "badge": self.favorite_badge.to_dict(),
            "user_badge": self.user_badge.to_dict() if self.user_badge else None  # Relación con UserBadge
        }

class Leaderboard(db.Model):
    __tablename__ = "leaderboard"

    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('users.id', ondelete="CASCADE"), nullable=False)
    points = db.Column(db.Integer, default=0)

    user = db.relationship('User', backref='leaderboard')

    def to_dict(self):
        return {"user_id": self.user_id, "username": self.user.username, "points": self.points}
    
class Achievement(db.Model):
    __tablename__ = 'achievements'

    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(150), nullable=False)
    description = db.Column(db.String(250), nullable=False)
    xp_reward = db.Column(db.Integer, default=0)
    badge_id = db.Column(db.Integer, db.ForeignKey('badges.id'), nullable=True)  # Opcional

    badge = db.relationship('Badge', backref='achievement')

    
class Documents(db.Model): 
    __tablename__ = 'documents'  

    id = db.Column(db.Integer, primary_key=True)  
    title = db.Column(db.String(250), nullable=False)  
    description = db.Column(db.String(200), nullable=True)
    type = db.Column(db.String(100), nullable=False) 
    subject = db.Column(db.String(100), nullable=False)
    src_url = db.Column(db.String(500), nullable=True)
    image_url = db.Column(db.String(500), nullable=True, default="https://e00-elmundo.uecdn.es/assets/multimedia/imagenes/2021/12/22/16401922123443.jpg")
    uploaded_by = db.Column(db.String(100), nullable=True, default="Unknown")
    
    favorites = db.relationship('Favorites', back_populates='documents')
    
    def serialize(self):
        return {
            'id': self.id,
            'title': self.title,
            'description': self.description,
            'type': self.type,
            'subject': self.subject,
            'src_url': self.src_url,
            'image_url': self.image_url or "https://e00-elmundo.uecdn.es/assets/multimedia/imagenes/2021/12/22/16401922123443.jpg",
            'uploaded_by': self.uploaded_by or "Unknown"
        }
    
    def __repr__(self):
        return f'<Document {self.title}>'


class Favorites(db.Model):  
    __tablename__ = 'favorites'  

    id = db.Column(db.Integer, primary_key=True) 
    user_id = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=False)  
    documents_id = db.Column(db.Integer, db.ForeignKey('documents.id'), nullable=False)  

    user = db.relationship('User', back_populates='favorites')
    documents = db.relationship('Documents', back_populates='favorites')

    def __repr__(self):
        return f'<Favorites user_id={self.user_id} document_id={self.documents_id}>'

    def serialize(self):
        return {
            "id": self.id,
            "user_id": self.user_id,
            "documents_id": self.documents_id
        }


class Task(db.Model):
    __tablename__ = 'tasks'

    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(100), nullable=False)
    description = db.Column(db.String(255))
    due_date = db.Column(db.DateTime)
    completed = db.Column(db.Boolean, default=False)
    order = db.Column(db.Integer, default=0)
    status = db.Column(db.String(50), default="tasks")

    user_id = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=False)
    user = db.relationship('User', back_populates='tasks') 

    def __repr__(self):
        return f'<Task {self.name}>'

    def serialize(self):
        return {
            'id': self.id,
            'name': self.name,
            'description': self.description,
            'due_date': self.due_date,
            'completed': self.completed,
            'user_id': self.user_id,
            "order": self.order,
            "status": self.status,
        }
