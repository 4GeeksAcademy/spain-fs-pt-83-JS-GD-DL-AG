"""
This module takes care of starting the API Server, Loading the DB and Adding the endpoints
"""

import os
from flask import Flask, request, jsonify, url_for, send_from_directory
from flask_migrate import Migrate
from flask_swagger import swagger
from api.utils import APIException, generate_sitemap
from api.models import db, User, Badge, Leaderboard, UserBadge  # Importar modelos
from api.routes import api
from api.admin import setup_admin
from api.commands import setup_commands
from flask_jwt_extended import JWTManager

ENV = "development" if os.getenv("FLASK_DEBUG") == "1" else "production"
static_file_dir = os.path.join(
    os.path.dirname(os.path.realpath(__file__)), "../public/"
)
app = Flask(__name__)

app.url_map.strict_slashes = False
app.config["JWT_SECRET_KEY"] = "scret_key"
jwt = JWTManager(app)

# Database configuration
db_url = os.getenv("DATABASE_URL")
if db_url is not None:
    app.config["SQLALCHEMY_DATABASE_URI"] = db_url.replace(
        "postgres://", "postgresql://"
    )
else:
    app.config["SQLALCHEMY_DATABASE_URI"] = "sqlite:////tmp/test.db"
    app.config["SQLALCHEMY_TRACK_MODIFICATIONS"] = False

MIGRATE = Migrate(app, db, compare_type=True)
db.init_app(app)
with app.app_context():
    db.create_all()
    tables = db.engine.table_names()
    print(f"📌 Tablas en la base de datos: {tables}")


# -------------------- 📌 Función para inicializar datos --------------------
<<<<<<< HEAD
# def init_db_data():
#  with app.app_context():
#          db.create_all()

#          # 🚀 Evitar duplicación de insignias
#          if Badge.query.count() == 0:
#              print("📌 Insertando insignias desde cero...")
#              badges = [
#                  Badge(name="Primer Recurso", description="Sube tu primer recurso", icon="https://example.com/icon1.png"),
#                  Badge(name="Colaborador Activo", description="Contribuye con 10 recursos", icon="https://example.com/icon2.png"),
#                  Badge(name="Maestro", description="Tus recursos han sido descargados 50 veces", icon="https://example.com/icon3.png"),
#              ]
#              db.session.add_all(badges)
#              db.session.commit()
#              print("✅ Insignias insertadas correctamente.")
#          else:
#              print("📌 Las insignias ya existen, no se vuelven a insertar.")

#          # 🚀 Evitar duplicación en el ranking
#          if Leaderboard.query.count() == 0:
#              user = User.query.first()
#              if user:
#                  leaderboard_entry = Leaderboard(user_id=user.id, points=500)
#                  db.session.add(leaderboard_entry)
#                  db.session.commit()
#                  print("✅ Usuario añadido al ranking.")
#          else:
#              print("📌 El ranking ya tiene datos, no se vuelve a insertar.")

#          # 🚀 Asignar una insignia al usuario si no tiene ninguna
#          if UserBadge.query.count() == 0:
#              user = User.query.first()
#              badge = Badge.query.first()
            
#              if user and badge:
#                  user_badge = UserBadge(user_id=user.id, badge_id=badge.id)
#                  db.session.add(user_badge)
#                  db.session.commit()
#                  print(f"✅ Insignia '{badge.name}' asignada automáticamente a {user.username}")
#          else:
#              print("📌 El usuario ya tiene insignias asignadas.")
#      # Verificar y mostrar los datos en la base de datos
# users = User.query.all()
# badges = Badge.query.all()
# leaderboard = Leaderboard.query.all()

# print("📌 Usuarios en la base de datos:")
# for user in users:
#          print(user.to_dict())

# print("📌 Insignias en la base de datos:")
# for badge in badges:
#          print(badge.to_dict())

# print("📌 Ranking en la base de datos:")
# for entry in leaderboard:
#          print(entry.to_dict())
#  # Ejecutar la inicialización de la base de datos
# with app.app_context():
#      init_db_data()
=======
def init_db_data():
    with app.app_context():
        db.create_all()

        # 🚀 Evitar duplicación de insignias
        if Badge.query.count() == 0:
            print("📌 Insertando insignias desde cero...")
            badges = [
                Badge(
                    name="Primer Recurso",
                    description="Sube tu primer recurso",
                    icon="https://example.com/icon1.png",
                ),
                Badge(
                    name="Colaborador Activo",
                    description="Contribuye con 10 recursos",
                    icon="https://example.com/icon2.png",
                ),
                Badge(
                    name="Maestro",
                    description="Tus recursos han sido descargados 50 veces",
                    icon="https://example.com/icon3.png",
                ),
            ]
            db.session.add_all(badges)
            db.session.commit()
            print("✅ Insignias insertadas correctamente.")
        else:
            print("📌 Las insignias ya existen, no se vuelven a insertar.")

        # 🚀 Evitar duplicación en el ranking
        if Leaderboard.query.count() == 0:
            user = User.query.first()
            if user:
                leaderboard_entry = Leaderboard(user_id=user.id, points=500)
                db.session.add(leaderboard_entry)
                db.session.commit()
                print("✅ Usuario añadido al ranking.")
        else:
            print("📌 El ranking ya tiene datos, no se vuelve a insertar.")

        # 🚀 Asignar una insignia al usuario si no tiene ninguna
        if UserBadge.query.count() == 0:
            user = User.query.first()
            badge = Badge.query.first()

            if user and badge:
                user_badge = UserBadge(user_id=user.id, badge_id=badge.id)
                db.session.add(user_badge)
                db.session.commit()
                print(
                    f"✅ Insignia '{badge.name}' asignada automáticamente a {user.username}"
                )
        else:
            print("📌 El usuario ya tiene insignias asignadas.")

        # Verificar y mostrar los datos en la base de datos
        users = User.query.all()
        badges = Badge.query.all()
        leaderboard = Leaderboard.query.all()

        print("📌 Usuarios en la base de datos:")
        for user in users:
            print(user.to_dict())

        print("📌 Insignias en la base de datos:")
        for badge in badges:
            print(badge.to_dict())

        print("📌 Ranking en la base de datos:")
        for entry in leaderboard:
            print(entry.to_dict())


# Ejecutar la inicialización de la base de datos
with app.app_context():
    init_db_data()

>>>>>>> main

# -------------------- 📌 Configuración de la API --------------------

# Add the admin panel
setup_admin(app)
setup_commands(app)

# Add all endpoints from the API with a "api" prefix
app.register_blueprint(api, url_prefix="/api")


# Handle/serialize errors like a JSON object
@app.errorhandler(APIException)
def handle_invalid_usage(error):
    return jsonify(error.to_dict()), error.status_code


# Generate sitemap with all your endpoints
@app.route("/")
def sitemap():
    if ENV == "development":
        return generate_sitemap(app)
    return send_from_directory(static_file_dir, "index.html")


# Global error handlers
@app.errorhandler(404)
def not_found(error):
    return jsonify({"error": "Not Found"}), 404


@app.errorhandler(500)
def server_error(error):
    return jsonify({"error": "Internal Server Error"}), 500


# Run the application
if __name__ == "__main__":
    PORT = int(os.environ.get("PORT", 3001))
    app.run(host="0.0.0.0", port=PORT, debug=True)
