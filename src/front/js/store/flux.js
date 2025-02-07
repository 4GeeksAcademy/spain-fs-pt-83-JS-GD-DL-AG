import { signInWithPopup, GoogleAuthProvider } from "firebase/auth";
import { auth } from "../Firebase/Firebase";

const getState = ({ getStore, getActions, setStore }) => {
    return {
        store: {
            message: null,
            demo: [
                { title: "FIRST", background: "white", initial: "white" },
                { title: "SECOND", background: "white", initial: "white" },
            ],
            token: null,
            errorMessage: null,
            user: null,
            favorites: [] // 🔹 Aseguramos que siempre sea un array vacío al inicio
        },
        actions: {
            googleLogin: async () => {
                try {
                    const provider = new GoogleAuthProvider();
                    const result = await signInWithPopup(auth, provider);
                    const user = result.user;
                    const idToken = await user.getIdToken();
                    const response = await fetch(
                        `${process.env.BACKEND_URL}/api/google-auth`,
                        {
                            method: "POST",
                            headers: { "Content-Type": "application/json" },
                            body: JSON.stringify({ token: idToken }),
                        }
                    );

                    const data = await response.json();

					if (!response.ok) {
						setStore({
							errorMessage: data.msg || "Error al iniciar sesión con Google",
							token: null,
						});
						return { success: false, msg: data.msg || "Error al iniciar sesión con Google" };
					}

					
					localStorage.setItem("token", data.token);
					localStorage.setItem("user", JSON.stringify(data.user));
					setStore({ token: data.token, user: data.user, errorMessage: null, });

                    return { success: true, user: data.user };
                } catch (error) {
                    console.error("Error al iniciar sesión con Google:", error);
                    setStore({ errorMessage: "Error al iniciar sesión con Google", token: null });
                    return { success: false, msg: "Error al iniciar sesión con Google" };
                }
            },

            login: async (email, password) => {
                try {
                    const response = await fetch(`${process.env.BACKEND_URL}/api/login`, {
                        method: "POST",
                        headers: { "Content-Type": "application/json" },
                        body: JSON.stringify({ email, password }),
                    });

                    const data = await response.json();
                    console.log("Login response:", data);

                    if (!response.ok) {
                        setStore({ errorMessage: data.msg || "Error logging in.", token: null });
                        return false;
                    }

                    setStore({ token: data.token, errorMessage: null });
                    localStorage.setItem("token", data.token);
                    localStorage.setItem("user", JSON.stringify(data.user));

                    return true;
                } catch (error) {
                    console.error("Error connecting to the server:", error);
                    setStore({ errorMessage: "Could not connect to the server.", token: null });
                    return false;
                }
            },

            signup: async (username, email, password) => {
                try {
                    const response = await fetch(`${process.env.BACKEND_URL}/api/signup`, {
                        method: "POST",
                        headers: { "Content-Type": "application/json" },
                        body: JSON.stringify({ username, email, password }),
                    });
                    const data = await response.json();

                    if (!response.ok) {
                        return { success: false, msg: data.msg || "Error registering user." };
                    }

                    return { success: true, msg: "Registration successful!" };
                } catch (error) {
                    console.error("Error connecting to the server:", error);
                    return { success: false, msg: "Could not connect to the server." };
                }
            },

            logout: () => {
                setStore({ token: null, errorMessage: null, favorites: [] }); // 🔹 Limpiar favoritos al cerrar sesión
                localStorage.removeItem("token");
                localStorage.removeItem("favorites");
            },

            // ✅ Obtener lista de favoritos del backend
            getFavorites: async () => {
                try {
                    const store = getStore();
                    const token = store.token || localStorage.getItem("token");

                    if (!token) {
                        console.warn("⚠️ No token found, cannot fetch favorites.");
                        return;
                    }

                    const response = await fetch(`${process.env.BACKEND_URL}/api/favorites`, {
                        method: "GET",
                        headers: {
                            Authorization: `Bearer ${token}`,
                            "Content-Type": "application/json",
                        },
                    });

                    const data = await response.json();

                    if (!response.ok) {
                        throw new Error(`Error fetching favorites: ${data.msg || "Unknown error"}`);
                    }

                    console.log("✔️ Respuesta API favoritos:", data);
                    setStore({ favorites: Array.isArray(data) ? data : [] });
                    localStorage.setItem("favorites", JSON.stringify(Array.isArray(data) ? data : []));

                } catch (error) {
                    console.error("🔥 Error cargando favoritos:", error);
                    setStore({ errorMessage: "Could not fetch favorites.", favorites: [] });
                }
            },
        },
    };
};

export default getState;



