import { defineStorage } from "@aws-amplify/backend";

export const storage = defineStorage({
    name: 'DataFoundryReactApp',
    access: (allow) => ({
        'service-requests/ss/*': [
          allow.authenticated.to(['read']),
          allow.entity('identity').to(['read', 'write', 'delete'])
        ],
      })
});
