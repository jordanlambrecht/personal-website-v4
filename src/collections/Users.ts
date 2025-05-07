import type { CollectionConfig } from 'payload'

export const Users: CollectionConfig = {
  slug: 'users',
  admin: {
    useAsTitle: 'email',
  },
  auth: {
    maxLoginAttempts: 4,
    lockTime: 600 * 1000,
    loginWithUsername: {
      allowEmailLogin: true,
      requireEmail: true,
    },
  },

  fields: [
    // Email added by default
  ],
}
