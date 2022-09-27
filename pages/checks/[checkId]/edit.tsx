import { Suspense } from "react";
import { Routes } from "@blitzjs/next";
import Head from "next/head";
import Link from "next/link";
import { useRouter } from "next/router";
import { useQuery, useMutation } from "@blitzjs/rpc";
import { useParam } from "@blitzjs/next";

import Layout from "app/core/layouts/Layout";
import getCheck from "app/checks/queries/getCheck";
import updateCheck from "app/checks/mutations/updateCheck";
import { CheckForm, FORM_ERROR } from "app/checks/components/CheckForm";

export const EditCheck = () => {
  const router = useRouter();
  const checkId = useParam("checkId", "number");
  const [check, { setQueryData }] = useQuery(
    getCheck,
    { id: checkId },
    {
      // This ensures the query never refreshes and overwrites the form data while the user is editing.
      staleTime: Infinity,
    }
  );
  const [updateCheckMutation] = useMutation(updateCheck);

  return (
    <>
      <Head>
        <title>Edit Check {check.id}</title>
      </Head>

      <div>
        <h1>Edit Check {check.id}</h1>
        <pre>{JSON.stringify(check, null, 2)}</pre>

        <CheckForm
          submitText="Update Check"
          // TODO use a zod schema for form validation
          //  - Tip: extract mutation's schema into a shared `validations.ts` file and
          //         then import and use it here
          // schema={UpdateCheck}
          initialValues={check}
          onSubmit={async (values) => {
            try {
              const updated = await updateCheckMutation({
                id: check.id,
                ...values,
              });
              await setQueryData(updated);
              router.push(Routes.ShowCheckPage({ checkId: updated.id }));
            } catch (error: any) {
              console.error(error);
              return {
                [FORM_ERROR]: error.toString(),
              };
            }
          }}
        />
      </div>
    </>
  );
};

const EditCheckPage = () => {
  return (
    <div>
      <Suspense fallback={<div>Loading...</div>}>
        <EditCheck />
      </Suspense>

      <p>
        <Link href={Routes.ChecksPage()}>
          <a>Checks</a>
        </Link>
      </p>
    </div>
  );
};

EditCheckPage.authenticate = true;
EditCheckPage.getLayout = (page) => <Layout>{page}</Layout>;

export default EditCheckPage;
