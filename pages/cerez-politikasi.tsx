
import { withAuth, WithAuthGetServerSideProps } from "@/feature/withAuth";
import Policy from "@/layouts/policy";
import PolicyModel from "@/models/policy-model";
import getContract from "@/requests/getContract";

export default function ({policy}: {policy: PolicyModel}) {
    return (<Policy title={"ÇEREZ POİTİKASI"}>
       <div dangerouslySetInnerHTML={{__html: policy.content}}/>
    </Policy>)
}

export const getServerSideProps: WithAuthGetServerSideProps = withAuth(async (context,user,axios) => {
    const policy = await getContract(axios,"cookieContract");
    return {props: {policy}} as any;
});


