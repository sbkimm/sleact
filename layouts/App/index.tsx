import React from "react";
import loadable from "@loadable/component";
import { Redirect, Route, Switch } from "react-router";
import Channel from "@pages/Channel";
import DirectMessage from "@pages/DirectMessage";

//코드 스플릿팅
const LogIn = loadable(() => import("@pages/LogIn"));
const SignUp = loadable(() => import("@pages/SignUp"));
const Workspace = loadable(() => import("@layouts/Workspace"));

const App = () => {
  return (
    <Switch>
      //라우터 실행 순서는 위에서 아래로
      <Redirect exact path="/" to="/login" />
      <Route path="/login" component={LogIn} />
      <Route path="/signup" component={SignUp} />
      <Route path="/workspace/:workspace" component={Workspace} />
    </Switch>
  );
};

export default App;
