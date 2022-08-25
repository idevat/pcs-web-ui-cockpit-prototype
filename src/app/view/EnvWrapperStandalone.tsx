import React from "react";
import { Page, PageHeader, PageSection } from "@patternfly/react-core";

import { EnsureLogin } from "./login";

export const EnvWrapperStandalone = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  return (
    <EnsureLogin>
      <Page header={<PageHeader logo="HA Cluster Management" />}>
        <PageSection variant="light">{children}</PageSection>
      </Page>
    </EnsureLogin>
  );
};
