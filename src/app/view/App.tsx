import { Provider } from "react-redux";

import { setupStore } from "app/store";
import { Router } from "app/view/share";

import { EnvWrapperCockpit } from "./EnvWrapperCockpit";
import { EnvWrapperStandalone } from "./EnvWrapperStandalone";
import { AppPage } from "./AppPage";

const EnvWrapper =
  process.env.REACT_APP_PCS_WEB_UI_ENVIRONMENT === "cockpit"
    ? EnvWrapperCockpit
    : EnvWrapperStandalone;

export const App = ({ store = setupStore() }) => {
  return (
    <Provider store={store}>
      <EnvWrapper>
        <Router base="">
          <AppPage />
        </Router>
      </EnvWrapper>
    </Provider>
  );
};
