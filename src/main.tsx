import { createRoot } from "react-dom/client";
import App from "./App.tsx";
import "./index.css";
import { store } from "./app/store.ts";
import { Provider } from "react-redux";
import { fetchUsers } from "./features/users/usersSlice.ts";

store.dispatch(fetchUsers());

createRoot(document.getElementById("root")!).render(
  <Provider store={store}>
    <App />
  </Provider>
);
