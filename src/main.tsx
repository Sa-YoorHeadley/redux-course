import { createRoot } from "react-dom/client";
import App from "./App.tsx";
import "./index.css";
import { store } from "./app/store.ts";
import { Provider } from "react-redux";
import { extendedApiSlice } from "./features/posts/postsSlice.ts";
import { extendedApiSliceUsers } from "./features/users/usersSlice.ts";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

store.dispatch(extendedApiSlice.endpoints.getPosts.initiate(undefined));
store.dispatch(extendedApiSliceUsers.endpoints.getUsers.initiate(undefined));

createRoot(document.getElementById("root")!).render(
  <Provider store={store}>
    <Router>
      <Routes>
        <Route path="/*" element={<App />} />
      </Routes>
    </Router>
  </Provider>
);
