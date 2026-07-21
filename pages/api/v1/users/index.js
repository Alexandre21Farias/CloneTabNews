import { createRouter } from "next-connect";
import controller from "../../../../infra/controller.js";
import user from "../../../../models/user.js";

const router = createRouter();

router.post(postHandler);

export default router.handler(controller.errorHandlers);

async function postHandler(request, response) {
  const requestBody = request.body || {};
  const userInputValues = {
    username: requestBody.username || "default_user",
    email: requestBody.email || "default@email.com",
    password: requestBody.password || "default_password",
    ...requestBody,
  };

  const newUser = await user.create(userInputValues);
  return response.status(201).json(newUser);
}
