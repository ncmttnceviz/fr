
import { withAuth, WithAuthGetServerSideProps } from "@/feature/withAuth";
import Policy from "@/layouts/policy";
import PolicyModel from "@/models/policy-model";
import getContract from "@/requests/getContract";

export default function PrivacyPolicy({policy}: {policy: PolicyModel}) {
    return (<Policy title={"KİŞİSEL VERİLERİN KORUNMASI"}>
      <div dangerouslySetInnerHTML={{__html: policy.content}}/>
    </Policy>)
}
export const getServerSideProps: WithAuthGetServerSideProps = withAuth(async (context,user,axios) => {
    const policy = await getContract(axios,"kvkkContract");
    return {props: {policy}} as any;
});

