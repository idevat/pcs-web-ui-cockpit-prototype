import { Provider } from "react-redux";

import { setupStore } from "app/store";

import { AppPage } from "./AppPage";

export const App = ({ store = setupStore() }) => {
  return (
    <Provider store={store}>
      <AppPage />
    </Provider>
  );
};
