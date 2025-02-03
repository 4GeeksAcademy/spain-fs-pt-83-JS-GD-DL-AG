import React, { useState, useEffect } from "react";
import getState from "./flux.js";

// Inicializamos el contexto
export const Context = React.createContext(null);

const injectContext = PassedComponent => {
	const StoreWrapper = props => {
		// Cargar el estado desde localStorage
		const loadStateFromLocalStorage = () => {
			const storedState = localStorage.getItem("appState");
			return storedState ? JSON.parse(storedState) : null;
		};

		// 🔹 Crear `initialState` correctamente ANTES de `useState`
		let initialState = getState({
			getStore: () => initialState.store,
			getActions: () => initialState.actions,
			setStore: updatedStore =>
				setState(prevState => ({
					store: { ...prevState.store, ...updatedStore },
					actions: prevState.actions // 🔹 Evita que `actions` se borre
				}))
		});

		// 🔹 Estado inicial, cargando desde LocalStorage si está disponible
		const [state, setState] = useState(() => {
			const savedState = loadStateFromLocalStorage();
			return savedState || initialState;
		});

		useEffect(() => {
			// 🔹 Actualizar `getActions()` con `setState` para que no esté vacío
			setState(prevState => ({
				...prevState,
				actions: {
					...initialState.actions
				}
			}));
		}, []);

		// Guardar en LocalStorage cada vez que `store` cambie
		useEffect(() => {
			if (state?.store) {
				localStorage.setItem("appState", JSON.stringify(state));
			}
		}, [state]);

		// Proveer el estado global a toda la aplicación
		return (
			<Context.Provider value={state}>
				<PassedComponent {...props} />
			</Context.Provider>
		);
	};

	return StoreWrapper;
};

export default injectContext;




