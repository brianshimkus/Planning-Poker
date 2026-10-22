# Notes

## Day 1

> **Why separate node modules folders?**
>
> Separate folders also let two packages keep different versions. Right now server resolves @types/node to 22.20.5 and web resolves it to 24.19.2. One flat directory can only hold one folder named @types/node. pnpm stores both under .pnpm and points each package at the version it asked for.
> A single root folder is simpler to browse, and npm still installs that way by default. The cost is that every package can see every other package's dependencies. pnpm's layout keeps the strict boundary and still stores each version of a library only once.

> **Why `z.uuid()` instead of `z.string().uuid()`?**
>
> Zod 4.6.7 deprecates `z.string().uuid()`. `z.uuid()` is the same check, and it accepts the ids `crypto.randomUUID()` produces. `z.string().trim()` still rewrites the value, so `"  Ann  "` is stored as `"Ann"`, and a name that is only spaces is rejected.
