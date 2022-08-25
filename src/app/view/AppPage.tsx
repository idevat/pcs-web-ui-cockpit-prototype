import { Router, useRoute } from "app/view/share";

import { ClusterPage } from "./ClusterPage";
import { DashboardPage } from "./DashboardPage";

export const AppPage = () => {
  const cluster = useRoute("/cluster/:name/*");
  if (cluster) {
    return (
      <Router base={cluster.matched}>
        <ClusterPage clusterName={cluster.params.name} />
      </Router>
    );
  }
  return <DashboardPage />;
};
