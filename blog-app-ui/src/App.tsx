import React from "react";
import { Route, Switch } from "react-router";
import "./App.css";
import ForgetPassword from "./ForgetPassword/ForgetPassword";
import Home from "./Home/Home";
import SignInSide from "./Login/SignInSide";
// import SignIn from "./SignIn/SignIn";
import SignUp from "./SignUp/SignUp";

function App() {
  return (
    // <Switch>
    //   <Route path="/login">
    //     <SignInSide />
    //   </Route>
    //   <Route path="/signup">
    //     <SignUp />
    //   </Route>
    //   <Route path="/">
    //     <Home />
    //   </Route>
    // </Switch>
    <ForgetPassword />
  );
}

export default App;
