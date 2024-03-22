import "./App.css";
import { Outlet } from "react-router-dom";

function App() {
  return (
    <>
      <header></header>
      <aside></aside>
      <Outlet />
    </>
  );
}

export default App;
