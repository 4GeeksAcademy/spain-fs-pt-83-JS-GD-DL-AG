"""
This module takes care of starting the API Server, Loading the DB and Adding the endpoints.
"""
from flask import Flask, request, jsonify, Blueprint
from api.models import db, User
from flask_cors import CORS
import os
from datetime import datetime, timezone, timedelta
import jwt

api = Blueprint('api', __name__)

# Allow CORS requests to this API
CORS(api)

# Leer configuraciones desde el archivo .env
SECRET_KEY = os.getenv("JWT_SECRET_KEY", "clave_por_defecto")
TOKEN_EXPIRATION_HOURS = int(os.getenv("TOKEN_EXPIRATION_HOURS", 1))


@api.route('/login', methods=['POST'])
def login():
    """
    Ruta para autenticar al usuario y generar un token JWT.
    - Requiere: email, password.
    - Devuelve: token JWT y datos del usuario.
    """
    body = request.get_json()
    if body is None or "email" not in body or "password" not in body:
        return jsonify({"error": "Por favor, añade email y contraseña"}), 400

    email = body["email"]
    password = body["password"]

    # Buscar usuario por email
    user = User.query.filter_by(email=email).first()
    if user is None or not user.check_password(password):  # Asegúrate de que User tenga el método `check_password`
        return jsonify({"error": "Credenciales inválidas"}), 401

    # Generar el token JWT con un tiempo de expiración configurado
    expiration = datetime.now(timezone.utc) + timedelta(hours=TOKEN_EXPIRATION_HOURS)
    token = jwt.encode({"user_id": user.id, "exp": expiration}, SECRET_KEY, algorithm="HS256")

    return jsonify({"token": token, "user": {"id": user.id, "email": user.email}}), 200


@api.route('/protected', methods=['GET'])
def protected_route():
    """
    Ruta protegida que solo puede ser accedida con un token válido.
    """
    auth_header = request.headers.get('Authorization')
    if not auth_header:
        return jsonify({"error": "Token no proporcionado"}), 401

    token = auth_header.split(" ")[1]  # Asumiendo formato "Bearer <token>"
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=["HS256"])
        return jsonify({"message": f"Acceso autorizado para el usuario {payload['user_id']}"}), 200
    except jwt.ExpiredSignatureError:
        return jsonify({"error": "El token ha expirado"}), 401
    except jwt.InvalidTokenError:
        return jsonify({"error": "Token inválido"}), 401


