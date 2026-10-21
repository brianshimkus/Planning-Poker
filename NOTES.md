# Notes

## Day 1

> **Why separate node modules folders?**
>
> Separate folders also let two packages keep different versions. Right now server resolves @types/node to 22.20.5 and web resolves it to 24.19.2. One flat directory can only hold one folder named @types/node. pnpm stores both under .pnpm and points each package at the version it asked for.
> A single root folder is simpler to browse, and npm still installs that way by default. The cost is that every package can see every other package's dependencies. pnpm's layout keeps the strict boundary and still stores each version of a library only once.
