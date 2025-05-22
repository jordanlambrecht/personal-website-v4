# Jordan Lambrecht's Personal Website

    1. Edit Payload config (add/update collections or fields)
    2. Run: pnpm generate:schema
    3. Run: pnpm migrate:create
    4. Run: pnpm migrate:dev (updates your dev Neon DB)
    5. Test everything locally using pnpm start:dev
    6. Push changes to GitHub in a feature branch
    7. Open a pull request → merge into main
    8. After merge, run: pnpm migrate:prod (updates your main Neon DB)
    9. Done.
