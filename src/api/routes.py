# """
# This module takes care of starting the API Server, Loading the DB and Adding the endpoints
# """
from flask import Flask, request, jsonify, url_for, Blueprint
from api.models import db, User, Documents, Favorites, Task, Leaderboard, Badge, UserBadge, UserUploadBadge, UserFavoriteBadge
from api.utils import generate_sitemap, APIException
from flask_cors import CORS
from flask_jwt_extended import jwt_required, get_jwt_identity, create_access_token
import os
import firebase_admin
from firebase_admin import auth, credentials
from dotenv import load_dotenv
#hola
load_dotenv()

cred = credentials.Certificate({
    "type": os.getenv("FIREBASE_TYPE"),
    "project_id": os.getenv("FIREBASE_PROJECT_ID"),
    "private_key_id": os.getenv("FIREBASE_PRIVATE_KEY_ID"),
    "private_key": os.getenv("FIREBASE_PRIVATE_KEY").replace('\\n', '\n'),
    "client_email": os.getenv("FIREBASE_CLIENT_EMAIL"),
    "client_id": os.getenv("FIREBASE_CLIENT_ID"),
    "auth_uri": os.getenv("FIREBASE_AUTH_URI"),
    "token_uri": os.getenv("FIREBASE_TOKEN_URI"),
    "auth_provider_x509_cert_url": os.getenv("FIREBASE_AUTH_PROVIDER_CERT_URL"),
    "client_x509_cert_url": os.getenv("FIREBASE_CLIENT_CERT_URL")
})

firebase_admin.initialize_app(cred)

api = Blueprint('api', __name__)
CORS(api, resources={r"/*": {"origins": os.getenv("FRONT_URL"), "allow_headers": ["Authorization", "Content-Type"], "supports_credentials": True}})

@api.after_request
def add_cors_headers(response):
    response.headers['Access-Control-Allow-Origin'] = os.getenv("FRONT_URL")
    response.headers['Access-Control-Allow-Headers'] = 'Content-Type,Authorization'
    response.headers['Access-Control-Allow-Methods'] = 'GET,PUT,POST,DELETE'
    response.headers['Access-Control-Allow-Credentials'] = 'true'  # Habilitar credenciales
    return response


@api.route('/google-auth', methods=['POST'])
def google_auth():
    data = request.get_json()
    id_token = data.get('token')

    try:
        decoded_token = auth.verify_id_token(id_token)
        email = decoded_token['email']
        username = decoded_token.get('name', email.split('@')[0])

        user = User.query.filter_by(email=email).first()
        if not user:
            user = User(
                username=username,
                email=email,
                password="google_auth",
                auth_method='google'
            )
            db.session.add(user)
            db.session.commit()
        elif user.auth_method != 'google':
            return jsonify({'msg': 'Este email está registrado con otro método'}), 409

        access_token = create_access_token(identity=str(user.email))
        user_data = {
            "id": user.id,
            "email": user.email,
            "username": user.username
        }
        return jsonify({
            "token": access_token,
            "user": user_data
        }), 200

    except Exception as e:
        print("Error en Google Auth:", e)
        return jsonify({"msg": "Autenticación fallida"}), 401

## CRUD Users:
@api.route('/signup', methods=['POST'])
def handle_create_user():
    
    body = request.get_json()
    
    if body is None:
        return jsonify({'msg': 'Error'}), 400
    if "username" not in body: 
        return jsonify({'msg': 'Error'}), 400
    if "email" not in body: 
        return jsonify({'msg': 'Error'}), 400
    if "password" not in body: 
        return jsonify({'msg': 'Error'}), 400
    
    user = User()
    
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

@api.route('/user/me', methods=['GET'])
@jwt_required()
def get_current_user():
    current_user_email = get_jwt_identity()
    print("Authenticated user email:", current_user_email)

    user = User.query.filter_by(email=current_user_email).first()

    if user is None:
        return jsonify({'msg': 'User not found'}), 404

    return jsonify(user.serialize()), 200

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

    if user.id != int(current_user) and current_user != "admin":
        return jsonify({'msg': 'Permission denied'}), 403

    body = request.get_json()

    if "username" in body:
        user.username = body["username"]
    if "email" in body:
        user.email = body["email"]

    db.session.commit()

    return jsonify(user.serialize()), 200

@api.route('/dashboard', methods=['GET'])
@jwt_required()
def handle_dashboard():
    
    current_user_email = get_jwt_identity() 
    
    user = User.query.filter_by(email=current_user_email).first()
    if user is None:
        return jsonify({'msg': 'user not exist'}), 404 

    response_body = {
        "message": f"This is the dashboard for user: {current_user_email}"
    }

    return jsonify(response_body), 200


@api.route('/search', methods=['GET'])
@jwt_required() 
def handle_search():
    
    current_user_email = get_jwt_identity()
    
    user = User.query.filter_by(email=current_user_email).first()
    if user is None:
        return jsonify({'msg': 'user not exist'}), 404

    response_body = {
        "message": f"This is the search section for user: {current_user_email}"
    }

    return jsonify(response_body), 200


@api.route('/login', methods=['POST'])
def login_user():
    body = request.get_json()

    if not body or "email" not in body or "password" not in body:
        return jsonify({'msg': 'Faltan credenciales'}), 400

    email = body["email"]
    password = body["password"]

    user = User.query.filter_by(email=email).first()

    if user and user.auth_method == 'google':
        return jsonify({'msg': 'Usa Google para iniciar sesión'}), 400

    if not user or user.password != password:
        return jsonify({'msg': 'Credenciales inválidas'}), 401
    # Convertir user.id a string antes de generar el token
    token = create_access_token(identity=str(user.email))
    user_data = {
        "id": user.id,
        "email": user.email,
        "username": user.username
    }

    return jsonify({
        "msg": "Inicio de sesión exitoso",
        "token": token,
        "user": user_data
    }), 200
## CRUD Documents:
@api.route('/documents', methods=['POST'])
def upload_document():
    data = request.get_json()

    if not data.get("title") or not data.get("src_url"):
        return jsonify({"error": "El título y la URL del archivo son obligatorios"}), 400

    image_url = data.get("image_url") if data.get("image_url") else "https://e00-elmundo.uecdn.es/assets/multimedia/imagenes/2021/12/22/16401922123443.jpg"

    new_document = Documents(
        title=data["title"],
        description=data.get("description", ""),
        type=data["type"],
        subject=data["subject"],
        src_url=data["src_url"],
        image_url=image_url,
        uploaded_by=data.get("uploaded_by", "Unknown")
    )

    db.session.add(new_document)
    db.session.commit()

    return jsonify({"message": "Documento guardado correctamente", "document": new_document.serialize()}), 201


@api.route('/documents', methods=['GET'])
def get_documents():
    documents = Documents.query.all()
    return jsonify([doc.serialize() for doc in documents]), 200


@api.route('/document/<int:id>', methods=['GET'])
def handle_get_document(id):
    
    document = Documents.query.get(id)
    
    if document is None:
        return jsonify({'msg': 'Document not found'}), 404

    return jsonify(document.serialize()), 200


@api.route('/document/<int:id>', methods=['PUT'])
def handle_update_document(id):
    
    document = Documents.query.get(id)

    if document is None:
        return jsonify({'msg': 'Document not found'}), 404

    body = request.get_json()

    if "title" in body:
        document.title = body["title"]
    if "description" in body:
        document.description = body["description"]
    if "type" in body:
        document.type = body["type"]
    if "subject" in body:
        document.subject = body["subject"]
    if "src_url" in body:
        document.src_url = body["src_url"]

    db.session.commit()

    return jsonify(document.serialize()), 200


@api.route('/document/<int:id>', methods=['DELETE'])
def handle_delete_document(id):
    
    document = Documents.query.get(id)

    if document is None:
        return jsonify({'msg': 'Document not found'}), 404

    db.session.delete(document)
    db.session.commit()

    return jsonify({}), 204


## CRUD Favorites
@api.route('/favorites', methods=['POST'])
@jwt_required()
def create_favorite():
    try:
        current_user_id = get_jwt_identity()
        print(f"🔍 User identity received: {current_user_id}")  # <-- Depuración

        # Asegurar que es un número
        user = User.query.filter_by(email=current_user_id).first()
        if not user:
            return jsonify({"msg": "Usuario no encontrado"}), 404
        
        body = request.get_json()
        
        if not body or "documents_id" not in body:
            return jsonify({'msg': 'Faltan datos'}), 400

        document = Documents.query.get(body["documents_id"])
        if not document:
            return jsonify({'msg': 'Documento no encontrado'}), 404

        new_favorite = Favorites(user_id=user.id, documents_id=body["documents_id"])  # <-- Usar user.id como número
        
        db.session.add(new_favorite)
        db.session.commit()

        return jsonify({'msg': 'Favorito agregado correctamente', 'favorite': new_favorite.id}), 201

    except Exception as e:
        print(f"❌ Error interno: {e}")  # <-- Imprime el error en la consola del servidor
        return jsonify({"error": "Error interno", "message": str(e)}), 500
    
@api.route('/favorites', methods=['GET'])
@jwt_required()
def get_favorites():
    try:
        current_user_id = get_jwt_identity()
        print(f"🔍 User identity received: {current_user_id}")  # <-- Depuración

        # Asegurar que `current_user_id` es un número obteniendo el ID real del usuario
        user = User.query.filter_by(email=current_user_id).first()
        if not user:
            return jsonify({"msg": "Usuario no encontrado"}), 404

        favorites = Favorites.query.filter_by(user_id=user.id).all()  # <-- Usar `user.id`

        if not favorites:
            return jsonify({"message": "No hay favoritos"}), 200

        result = [{
            "id": fav.id,
            "document_id": fav.documents.id,
            "document_title": fav.documents.title,
            "document_type": fav.documents.type
        } for fav in favorites]

        return jsonify(result), 200

    except Exception as e:
        print(f"❌ Error interno: {e}")  # <-- Depuración
        return jsonify({"error": "Error interno", "message": str(e)}), 500

@api.route('/favorites/<int:id>', methods=['DELETE'])
@jwt_required()
def delete_favorite(id):
    try:
        current_user_id = get_jwt_identity()
        print(f"🔍 User identity received: {current_user_id}")  # <-- Depuración

        # Obtener ID real del usuario
        user = User.query.filter_by(email=current_user_id).first()
        if not user:
            return jsonify({"msg": "Usuario no encontrado"}), 404

        favorite = Favorites.query.filter_by(id=id, user_id=user.id).first()  # <-- Usar `user.id`

        if not favorite:
            return jsonify({'msg': 'Favorito no encontrado'}), 404

        db.session.delete(favorite)
        db.session.commit()

        return jsonify({'msg': 'Favorito eliminado correctamente'}), 200

    except Exception as e:
        print(f"❌ Error interno: {e}")  # <-- Depuración
        return jsonify({"error": "Error interno", "message": str(e)}), 500

## CRUD tasks for calendar
@api.route('/tasks', methods=['POST'])
@jwt_required()
def handle_create_task():
    try:
        print("✅ Recibida solicitud en /tasks")
        
        body = request.get_json()
        if not body:
            print("❌ Error: No se recibió JSON en la petición")
            return jsonify({'msg': 'Error: No se recibió JSON'}), 400

        required_fields = ["name", "due_date"]
        for field in required_fields:
            if field not in body:
                print(f"❌ Error: Falta el campo {field}")
                return jsonify({'msg': f'{field} is required'}), 400

        current_user_email = get_jwt_identity()
        print(f"🔍 Usuario autenticado: {current_user_email}")

        user = User.query.filter_by(email=current_user_email).first()
        if user is None:
            print("❌ Error: Usuario no encontrado")
            return jsonify({'msg': f'User not found: {current_user_email}'}), 404

        print("✅ Usuario encontrado, creando tarea...")

        task = Task(
            name=body["name"],
            description=body.get("description", ""),  # Si no hay descripción, usa ""
            due_date=body["due_date"],
            user_id=user.id
        )

        db.session.add(task)
        db.session.commit()
        print("✅ Tarea creada con éxito:", task.id)

        return jsonify(task.serialize()), 201  # Asegurar que se devuelve la respuesta

    except Exception as e:
        print(f"🔥 Error interno: {str(e)}")
        return jsonify({"msg": "Internal server error", "error": str(e)}), 500

@api.route('/tasks', methods=['GET'])
@jwt_required()
def handle_get_tasks():
    
    current_user_email = get_jwt_identity()
    
    user = User.query.filter_by(email=current_user_email).first()
    
    if user is None:
        return jsonify({'msg': 'User not found'}), 404

    tasks = Task.query.filter_by(user_id=user.id).all()
    
    result = [task.serialize() for task in tasks]

    return jsonify(result), 200

@api.route('/tasks/order', methods=['PUT'])
@jwt_required()
def update_task_order():
    data = request.get_json()

    for task_data in data:
        task = Task.query.get(task_data["id"])
        if task:
            task.order = task_data["order"]

    db.session.commit()
    return jsonify({"msg": "Task order updated"}), 200

@api.route('/tasks/<int:task_id>', methods=['PUT'])
@jwt_required()
def update_task(task_id):
    body = request.get_json()
    new_status = body.get("status")

    if not new_status:
        return jsonify({"msg": "Missing status"}), 400

    task = Task.query.get(task_id)

    if not task:
        return jsonify({"msg": "Task not found"}), 404

    task.status = new_status
    db.session.commit()

    return jsonify({"msg": f"Task {task_id} updated", "status": task.status}), 200


@api.route('/tasks/<int:id>', methods=['GET'])
@jwt_required()
def handle_get_task(id):
    
    current_user_email = get_jwt_identity()
    
    user = User.query.filter_by(email=current_user_email).first()
    
    if user is None:
        return jsonify({'msg': 'User not found'}), 404

    task = Task.query.filter_by(id=id, user_id=user.id).first()
    
    if task is None:
        return jsonify({'msg': 'Task not found'}), 404

    return jsonify(task.serialize()), 200


@api.route('/tasks/<int:id>', methods=['PUT'])
@jwt_required()
def handle_update_task(id):
    
    current_user_email = get_jwt_identity()
    
    user = User.query.filter_by(email=current_user_email).first()
    
    if user is None:
        return jsonify({'msg': 'User not found'}), 404

    task = Task.query.filter_by(id=id, user_id=user.id).first()
    
    if task is None:
        return jsonify({'msg': 'Task not found'}), 404

    body = request.get_json()

    if "name" in body:
        task.name = body["name"]
    if "description" in body:
        task.description = body["description"]
    if "due_date" in body:
        task.due_date = body["due_date"]
    if "completed" in body:
        task.completed = body["completed"]

    db.session.commit()

    return jsonify(task.serialize()), 200


@api.route('/tasks/<int:id>', methods=['DELETE'])
@jwt_required()
def handle_delete_task(id):
    
    current_user_email = get_jwt_identity()
    
    user = User.query.filter_by(email=current_user_email).first()
    
    if user is None:
        return jsonify({'msg': 'User not found'}), 404

    task = Task.query.filter_by(id=id, user_id=user.id).first()
    
    if task is None:
        return jsonify({'msg': 'Task not found'}), 404

    db.session.delete(task)
    db.session.commit()

    return jsonify({'msg': 'Task deleted successfully'}), 200

@api.route('/achievements', methods=['GET'])
@jwt_required()
def get_achievements():
    try:
        current_user_id = get_jwt_identity()

        # Simulación de días consecutivos (Esto debería ser obtenido de la base de datos)
        user = User.query.get(current_user_id)
        days_logged = user.consecutive_days if user else 0

        # Lista de logros desbloqueados
        unlocked = [ach for ach in [3, 5, 10, 15, 30] if days_logged >= ach]

        return jsonify(unlocked), 200  # 🔹 Devuelve JSON correctamente

    except Exception as e:
        print(f"Error en /achievements: {e}")  # 🔍 Log para ver errores en la terminal
        return jsonify({"error": "Error interno", "message": str(e)}), 500
    
# ------------------- USER PROGRESS -------------------
@api.route("/user/<int:user_id>", methods=["GET"])
def get_user_progress(user_id):
    user = User.query.get(user_id)
    if not user:
        return jsonify({"error": "User not found"}), 404
    return jsonify(user.to_dict())

# ------------------- BADGES -------------------
@api.route("/badges/<int:user_id>", methods=["GET"])
def get_badges(user_id):
    user = User.query.get(user_id)
    if not user:
        print(f"❌ Usuario con ID {user_id} no encontrado en la base de datos.")
        return jsonify({"error": "User not found"}), 404

    user_badges = UserBadge.query.filter(UserBadge.user_id == user.id).all()
    if not user_badges:
        print(f"❌ El usuario con ID {user_id} no tiene insignias asignadas.")
        return jsonify({"error": "User has no badges"}), 404

    badges_data = [{"id": ub.badge.id, "name": ub.badge.name, "icon": ub.badge.icon} for ub in user_badges]
    print(f"✅ Insignias del usuario {user.username}: {badges_data}")
    return jsonify(badges_data)

# ------------------- LEADERBOARD -------------------
@api.route("/leaderboard", methods=["GET"])
def get_leaderboard():
    leaderboard = Leaderboard.query.order_by(Leaderboard.points.desc()).all()

    if not leaderboard:
        print("❌ No hay datos en el ranking.")
        return jsonify({"error": "Leaderboard is empty"}), 404

    leaderboard_data = []
    for entry in leaderboard:
        user = User.query.get(entry.user_id)
        if user:
            leaderboard_data.append({
                "user_id": entry.user_id,
                "username": user.username,
                "points": entry.points
            })
    
    print(f"✅ Datos del leaderboard: {leaderboard_data}")
    return jsonify(leaderboard_data)

# ------------------- ADD EXPERIENCE -------------------
@api.route("/user/<int:user_id>/add_xp", methods=["POST"])
def add_experience(user_id):
    user = User.query.get(user_id)
    if not user:
        return jsonify({"message": "User not found"}), 404

    data = request.get_json()
    xp_to_add = data.get("xp", 0)

    user.experience += xp_to_add
    db.session.commit()
    
    return jsonify({"message": f"Added {xp_to_add} XP", "new_experience": user.experience})

# ------------------- ADD BADGE -------------------
@api.route("/user/<int:user_id>/add_badge/<int:badge_id>", methods=["POST"])
def add_badge(user_id, badge_id):
    user = User.query.get(user_id)
    badge = Badge.query.get(badge_id)

    if not user or not badge:
        return jsonify({"message": "User or Badge not found"}), 404

    existing = UserBadge.query.filter_by(user_id=user_id, badge_id=badge_id).first()
    if existing:
        return jsonify({"message": "Badge already earned"}), 400

    new_badge = UserBadge(user_id=user_id, badge_id=badge_id)
    db.session.add(new_badge)
    db.session.commit()

    return jsonify({"message": f"Badge '{badge.name}' added to user {user.username}"})

# -------------------- GAMIFICACIÖN -------------------------
@api.route("/user/<int:user_id>/complete_action", methods=["POST"])
def complete_action(user_id):
    data = request.get_json()
    action = data.get("action")

    user = User.query.get(user_id)
    if not user:
        return jsonify({"error": "User not found"}), 404

    xp_gained = 0
    badge_unlocked = None

    # 🔥 Asignación de XP basada en la acción
    action_rewards = {
        "upload_file": 50,
        "download_file": 20,
        "add_favorite": 20
    }

    xp_gained = action_rewards.get(action, 0)
    user.experience += xp_gained

    # 🔥 Desbloqueo de insignias
    if action == "upload_file" and not UserBadge.query.filter_by(user_id=user.id, badge_id=1).first():
        badge_unlocked = Badge.query.get(1)  # Primera contribución
        new_badge = UserBadge(user_id=user.id, badge_id=badge_unlocked.id)
        db.session.add(new_badge)

    if action == "download_file" and user.download_count >= 10:
        badge_unlocked = Badge.query.get(2)  # Explorador
        new_badge = UserBadge(user_id=user.id, badge_id=badge_unlocked.id)
        db.session.add(new_badge)
        
    if action == "add_favorite" and not UserBadge.query.filter_by(user_id=user.id, badge_id=3).first(): 
        badge_unlocked = Badge.query.get(3)  
        new_badge = UserBadge(user_id=user.id, badge_id=badge_unlocked.id)
        db.session.add(new_badge)    
        
    # 🔥 Desbloqueo de insignias de UploadBadge (Basado en documentos subidos)
    
    upload_badge = UserUploadBadge.query.filter_by(user_id=user.id).first()  # Tomamos el primer UserUploadBadge del usuario
    
    if upload_badge.documents_uploaded >= 20 and not UserBadge.query.filter_by(user_id=user.id, badge_id=upload_badge.upload_badge.id).first():
        badge_unlocked = upload_badge.upload_badge
        new_badge = UserBadge(user_id=user.id, badge_id=badge_unlocked.id)
        db.session.add(new_badge)
        
    elif upload_badge.documents_uploaded >= 10 and not UserBadge.query.filter_by(user_id=user.id, badge_id=upload_badge.upload_badge.id).first():
        badge_unlocked = upload_badge.upload_badge
        new_badge = UserBadge(user_id=user.id, badge_id=badge_unlocked.id)
        db.session.add(new_badge)
        
    elif upload_badge.documents_uploaded >= 5 and not UserBadge.query.filter_by(user_id=user.id, badge_id=upload_badge.upload_badge.id).first():
        badge_unlocked = upload_badge.upload_badge 
        new_badge = UserBadge(user_id=user.id, badge_id=badge_unlocked.id)
        db.session.add(new_badge)

    # 🔥 Desbloqueo de insignias de FavoriteBadge (Basado en la cantidad de favoritos)
    
    favorite_badge = UserFavoriteBadge.query.filter_by(user_id=user.id).first()  # Tomamos el primer UserFavoriteBadge del usuario
    
    if favorite_badge.favorites_count >= 20 and not UserBadge.query.filter_by(user_id=user.id, badge_id=favorite_badge.favorite_badge.id).first():
        badge_unlocked = favorite_badge.favorite_badge
        new_badge = UserBadge(user_id=user.id, badge_id=badge_unlocked.id)
        db.session.add(new_badge)
        
    elif favorite_badge.favorites_count >= 10 and not UserBadge.query.filter_by(user_id=user.id, badge_id=favorite_badge.favorite_badge.id).first():
        badge_unlocked = favorite_badge.favorite_badge
        new_badge = UserBadge(user_id=user.id, badge_id=badge_unlocked.id)
        db.session.add(new_badge)
        
    elif favorite_badge.favorites_count >= 5 and not UserBadge.query.filter_by(user_id=user.id, badge_id=favorite_badge.favorite_badge.id).first():
        badge_unlocked = favorite_badge.favorite_badge
        new_badge = UserBadge(user_id=user.id, badge_id=badge_unlocked.id)
        db.session.add(new_badge)
        
        
    db.session.commit()

    response = {"xp_gained": xp_gained, "new_experience": user.experience}
    if badge_unlocked:
        response["badge_unlocked"] = badge_unlocked.name

    return jsonify(response), 200


# ------------------- INIT DATABASE -------------------
@api.route("/init_db", methods=["POST"])
def init_db():
    db.create_all()
    return jsonify({"message": "Database initialized"})