import { Link } from "app/view/share";

export const ClusterPage = ({ clusterName }: { clusterName: string }) => {
  return (
    <>
      <div>
        <strong>{clusterName}</strong> detail{" "}
      </div>
      <div>
        <Link to={"~/"}>Back</Link>
      </div>
    </>
  );
};
