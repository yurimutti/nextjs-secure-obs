import "server-only";

import { redirect } from "next/navigation";
import { cache } from "react";
import {
  getAccessToken,
  decryptAccessToken,
  refreshTokensServerSide
} from "@/shared/libs/session";

export const verifySession = cache(async () => {
  let accessToken = await getAccessToken();
  let payload = await decryptAccessToken(accessToken);

  if (!payload?.userId) {
    const refreshSuccess = await refreshTokensServerSide();

    if (refreshSuccess) {
      accessToken = await getAccessToken();
      payload = await decryptAccessToken(accessToken);
    }

    if (!payload?.userId) {
      redirect("/login");
    }
  }

  return { isAuth: true, userId: payload.userId };
});
