"""
This module takes care of starting the API Server, Loading the DB and Adding the endpoints.
"""
from flask import Flask, request, jsonify, Blueprint
from api.models import db, User
from flask_cors import CORS
from flask_jwt_extended import jwt_required, get_jwt_identity, create_access_token


api = Blueprint('api', __name__)

# Allow CORS requests to this API
CORS(api)


@api.route('/signup', methods=['POST'])
def handle_create_user():
    
    body = request.get_json()
    
    if body is None:
        return jsonify({'msg': 'Error'}), 400
    if "id" not in body:
        return jsonify({'msg': 'Error'}), 400
    if "username" not in body: 
        return jsonify({'msg': 'Error'}), 400
    if "email" not in body: 
        return jsonify({'msg': 'Error'}), 400
    if "password" not in body: 
        return jsonify({'msg': 'Error'}), 400
    
    user = User()
    
    user.id = body["id"]
    user.username = body["username"]
    user.email = body["email"]
    user.password = body["password"]
    
    db.session.add(user)
    db.session.commit()
    
    return jsonify({}), 201


@api.route('/auth', methods=['POST'])
def handle_auth():
    body = request.get_json()
    
    if body is None:
        return jsonify({'msg': 'Error'}), 400
    if "id" not in body:
        return jsonify({'msg': 'Error'}), 400
    if "username" not in body: 
        return jsonify({'msg': 'Error'}), 400
    if "email" not in body: 
        return jsonify({'msg': 'Error'}), 400
    if "password" not in body: 
        return jsonify({'msg': 'Error'}), 400
    
    user = User.query.filter_by( 
         id = body["id"], 
         username = body["username"], 
         email = body["email"], 
         password = body["password"]).first()
    
    if user is None: 
        return jsonify({'msg': 'user not found'}), 401
    
    token = create_access_token(identity= user.email)
    
    
    return jsonify({'token': token}), 200


@api.route('/users', methods=['GET'])
def handle_get_users():
    
    all_users = User.query.all()
    all_users = list(map(lambda x: x.serialize(), all_users))

    return jsonify(all_users), 200


@api.route('/user/<int:id>', methods=['GET'])
def handle_get_user(id):
    
    user = User.query.get(id)
    user = user.serialize()

    return jsonify(user), 200


@api.route('/user/<int:id>', methods=['DELETE'])
@jwt_required()  
def handle_delete_user(id):
    
    current_user = get_jwt_identity()
    
    user = User.query.get(id)

    if user is None:
        return jsonify({'msg': 'id does not exist'}), 404
    if user.username != current_user and not current_user == "admin":
        return jsonify({'msg': 'Permission denied'}), 403 
    
    db.session.delete(user)
    db.session.commit()
    
    return jsonify({}), 204

    

@api.route('/user/<int:id>', methods=['PUT'])
@jwt_required() 
def handle_update_user(id):
    
    current_user = get_jwt_identity()
    
    user = User.query.get(id)
    
    if user is None:
        return jsonify({'msg': 'User not found'}), 404
    if user.username != current_user and not current_user == "admin":
        return jsonify({'msg': 'Permission denied'}), 403  # 403 Forbidden

    body = request.get_json()
    
    if "username" in body:
        user.username = body["username"]
    if "email" in body:
        user.email = body["email"]
    
    db.session.commit()
    
    return jsonify(user.serialize()), 200



@api.route('/dashboard', methods=['POST', 'GET'])
@jwt_required()
def handle_dashboard():
    
    current_user = get_jwt_identity() 

    response_body = {
        "message": f"This is the dashboard for user: {current_user}"
    }

    return jsonify(response_body), 200


@api.route('/search', methods=['POST', 'GET'])
@jwt_required() 
def handle_search():
    
    current_user = get_jwt_identity()

    response_body = {
        "message": f"This is the search section for user: {current_user}"
    }

    return jsonify(response_body), 200


# Nueva ruta para login y autenticación
@api.route('/login', methods=['POST'])
def login_user():
    
    # Ruta para autenticar a un usuario con email y password.
    # Genera un token JWT si las credenciales son válidas.
    
    body = request.get_json()
    
    if body is None or "email" not in body or "password" not in body:
        return jsonify({'msg': 'Faltan credenciales'}), 400

    email = request.get_json()['email']
    password = request.get_json()['password']

    # Buscar usuario por email
    user = User.query.filter_by(email=email, password=password).first()

    if user is None or not user.password == password:  # Comprobar que el usuario exista y la contraseña coincida
        return jsonify({'msg': 'Credenciales inválidas'}), 401

    # Generar el token JWT
    token = create_access_token(identity=user.email)

    return jsonify({'msg': 'Inicio de sesión exitoso', 'token': token}), 200
