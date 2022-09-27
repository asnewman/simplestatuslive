import { Routes } from "@blitzjs/next";
import Link from "next/link";
import { useRouter } from "next/router";
import { useMutation } from "@blitzjs/rpc";
import Layout from "app/core/layouts/Layout";
import createCheck from "app/checks/mutations/createCheck";
import { CheckForm, FORM_ERROR } from "app/checks/components/CheckForm";

const NewCheckPage = () => {
  const router = useRouter();
  const [createCheckMutation] = useMutation(createCheck);

  return (
    <Layout title={"Create New Check"}>
      <h1>Create New Check</h1>

      <CheckForm
        submitText="Create Check"
        // TODO use a zod schema for form validation
        //  - Tip: extract mutation's schema into a shared `validations.ts` file and
        //         then import and use it here
        // schema={CreateCheck}
        // initialValues={{}}
        onSubmit={async (values) => {
          try {
            const check = await createCheckMutation(values);
            router.push(Routes.ShowCheckPage({ checkId: check.id }));
          } catch (error: any) {
            console.error(error);
            return {
              [FORM_ERROR]: error.toString(),
            };
          }
        }}
      />

      <p>
        <Link href={Routes.ChecksPage()}>
          <a>Checks</a>
        </Link>
      </p>
    </Layout>
  );
};

NewCheckPage.authenticate = true;

export default NewCheckPage;
