import { Suspense } from "react";
import { Routes } from "@blitzjs/next";
import Head from "next/head";
import Link from "next/link";
import { useRouter } from "next/router";
import { useQuery, useMutation } from "@blitzjs/rpc";
import { useParam } from "@blitzjs/next";

import Layout from "app/core/layouts/Layout";
import getCheck from "app/checks/queries/getCheck";
import deleteCheck from "app/checks/mutations/deleteCheck";

export const Check = () => {
  const router = useRouter();
  const checkId = useParam("checkId", "number");
  const [deleteCheckMutation] = useMutation(deleteCheck);
  const [check] = useQuery(getCheck, { id: checkId });

  return (
    <>
      <Head>
        <title>Check {check.id}</title>
      </Head>

      <div>
        <h1>Check {check.id}</h1>
        <pre>{JSON.stringify(check, null, 2)}</pre>

        <Link href={Routes.EditCheckPage({ checkId: check.id })}>
          <a>Edit</a>
        </Link>

        <button
          type="button"
          onClick={async () => {
            if (window.confirm("This will be deleted")) {
              await deleteCheckMutation({ id: check.id });
              router.push(Routes.ChecksPage());
            }
          }}
          style={{ marginLeft: "0.5rem" }}
        >
          Delete
        </button>
      </div>
    </>
  );
};

const ShowCheckPage = () => {
  return (
    <div>
      <p>
        <Link href={Routes.ChecksPage()}>
          <a>Checks</a>
        </Link>
      </p>

      <Suspense fallback={<div>Loading...</div>}>
        <Check />
      </Suspense>
    </div>
  );
};

ShowCheckPage.authenticate = true;
ShowCheckPage.getLayout = (page) => <Layout>{page}</Layout>;

export default ShowCheckPage;
