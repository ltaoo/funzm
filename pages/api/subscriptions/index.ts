/**
 * https://stripe.com/docs/billing/subscriptions/overview
 */
import { NextApiRequest, NextApiResponse } from "next";

import { ensureLogin } from "@/lib/utils";
import prisma from "@/lib/prisma";

export default async function provideSubscriptionSearchService(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const user_id = await ensureLogin(req, res);

  const { id } = req.body;

  const price = await prisma.price.findUnique({
    where: {
      id,
    },
  });
  const existingSubscription = await prisma.subscription.findFirst({
    where: {
      user_id,
    },
  });
  if (!existingSubscription) {
    const existingSubscription = await prisma.subscription.findFirst({
      where: {
        user_id,
      },
    });
  }
}
