import { useSelector } from "react-redux";

import { selectors } from "app/store";

export const EnvWrapperCockpit = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const authError = useSelector(selectors.authError);
  return (
    <div className="App">
      {authError && (
        <div>
          Authentication error happened.
          <div>Code:{authError.code} </div>
          <div>Message:{authError.message} </div>
        </div>
      )}
      {authError === undefined && children}
    </div>
  );
};
