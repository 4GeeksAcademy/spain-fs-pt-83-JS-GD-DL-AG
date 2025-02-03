

import { signInWithPopup, GoogleAuthProvider } from "firebase/auth";
import { auth } from "../Firebase/Firebase";

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
			errorMessage: null,
			
			user: null,
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
					setStore({ token: data.token, user: data.user, errorMessage: null });

					return { success: true, user: data.user };
				} catch (error) {
					console.error("Error al iniciar sesión con Google:", error);
					setStore({ errorMessage: "Error al iniciar sesión con Google", token: null });
					return { success: false, msg: "Error al iniciar sesión con Google" };
				}
			},

			
			login: async (email, password) => {
				try {
					const response = await fetch(process.env.BACKEND_URL + "/api/login", {
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

					
					const decodedToken = JSON.parse(atob(data.token.split(".")[1]));
					console.log("Decoded token:", decodedToken);

					setStore({ token: data.token, user: data.user, errorMessage: null });
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
				setStore({ token: null, errorMessage: null });
				localStorage.removeItem("token");
			},

			
			getDashboardData: async () => {
				try {
					const store = getStore();
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
