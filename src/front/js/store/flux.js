
const getState = ({ getStore, getActions, setStore }) => {
	return {
		store: {
			message: null,
			demo: [
				{
					title: "FIRST",
					background: "white",
					initial: "white",
				},
				{
					title: "SECOND",
					background: "white",
					initial: "white",
				},
			],
			
			token: null,
			errorMessage: null
		},
		actions: {
			// Ejemplo de login centralizado
			login: async (email, password) => {
				try {
					// Petición a  backend
					const response = await fetch(process.env.BACKEND_URL + "/api/login", {
						method: "POST",
						headers: { "Content-Type": "application/json" },
						body: JSON.stringify({ email, password }),
					});
					const data = await response.json();

					if (!response.ok) {
						// Guarda el mensaje de error en el store para consultarlo luego
						setStore({ errorMessage: data.msg || "Error logging in.", token: null });
						return false; // Para que sepas en el componente que falló
					}

					// Si la petición fue exitosa, guarda el token y limpia el errorMessage
					setStore({ token: data.token, errorMessage: null });

					// Opcional: también guardarlo en localStorage, si quieres persistir la sesión
					localStorage.setItem("token", data.token);

					return true; 
				} catch (error) {
					console.error("Error connecting to the server:", error);
					setStore({ errorMessage: "Could not connect to the server.", token: null });
					return false;
				}
			},

			signup: async (username, email, password) => {
                try {
                    const response = await fetch(process.env.BACKEND_URL + "/api/signup", {
                        method: "POST",
                        headers: { "Content-Type": "application/json" },
                        body: JSON.stringify({ username, email, password })
                    });
                    const data = await response.json();

                    if (!response.ok) {
                        return { success: false, msg: data.msg || "Error registering user." };
                    }

                    // Podrías guardar algo en el store si tu backend retorna datos adicionales
                    // setStore({ currentUser: data.user });

                    return { success: true, msg: "Registration successful!" };
                } catch (error) {
                    console.error("Error connecting to the server:", error);
                    return { success: false, msg: "Could not connect to the server." };
                }
            },

			
			logout: () => {
				setStore({ token: null, errorMessage: null });
				localStorage.removeItem("token");
			},

			getDashboardData: async () => {
				try {
					const store = getStore();
					// Obtenemos el token desde el store
					const token = store.token; 
					
					const response = await fetch(process.env.BACKEND_URL + "/api/login", {
						method: "GET",
						headers: {
							Authorization: `Bearer ${token}`,
						},
					});
					if (!response.ok) {
						throw new Error(`HTTP error! status: ${response.status}`);
					}
					const data = await response.json();
					// Guardamos la respuesta en el store
					setStore({ dashboardMessage: data.message });
				} catch (error) {
					console.error("Error fetching dashboard data:", error);
				}
			},

			getSearchData: async () => {
				try {
					const store = getStore();
					const token = store.token;

					const response = await fetch(process.env.BACKEND_URL + "/api/search", {
						method: "GET",
						headers: {
							Authorization: `Bearer ${token}`,
						},
					});
					if (!response.ok) {
						throw new Error(`HTTP error! status: ${response.status}`);
					}
					const data = await response.json();
					setStore({ searchMessage: data.message });
				} catch (error) {
					console.error("Error fetching search data:", error);
				}
			},

			
			exampleFunction: () => {
				getActions().changeColor(0, "green");
			},

			getMessage: async () => {
				try {
					const resp = await fetch(process.env.BACKEND_URL + "/api/hello");
					const data = await resp.json();
					setStore({ message: data.message });
					return data;
				} catch (error) {
					console.log("Error loading message from backend", error);
				}
			},

			changeColor: (index, color) => {
				const store = getStore();
				const demo = store.demo.map((elm, i) => {
					if (i === index) elm.background = color;
					return elm;
				});
				setStore({ demo: demo });
			},
		},
	};
};

export default getState;
