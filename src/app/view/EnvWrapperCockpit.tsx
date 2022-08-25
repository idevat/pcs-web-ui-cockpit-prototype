import { useSelector } from "react-redux";
import { Page, PageSection } from "@patternfly/react-core";

import { selectors } from "app/store";

export const EnvWrapperCockpit = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const authError = useSelector(selectors.authError);
  return (
    <Page>
      <PageSection variant="light">
        {authError && (
          <div>
            Authentication error happened.
            <div>Code:{authError.code} </div>
            <div>Message:{authError.message} </div>
          </div>
        )}
        {authError === undefined && children}
      </PageSection>
    </Page>
  );
};
