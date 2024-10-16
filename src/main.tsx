import { createRoot } from "react-dom/client";
import App from "./App.tsx";
import "./index.css";
import { store } from "./app/store.ts";
import { Provider } from "react-redux";
import { fetchUsers } from "./features/users/usersSlice.ts";
import { fetchPosts } from "./features/posts/postsSlice.ts";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

store.dispatch(fetchUsers());
store.dispatch(fetchPosts());

createRoot(document.getElementById("root")!).render(
  <Provider store={store}>
    <Router>
      <Routes>
        <Route path="/*" element={<App />} />
      </Routes>
    </Router>
  </Provider>
);
