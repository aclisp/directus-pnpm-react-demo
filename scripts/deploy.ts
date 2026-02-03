import { $ } from 'bun'

await $`pnpm run lint`
await $`pnpm run test`
await $`pnpm run build`
await $`tar zcf dist.tar.gz dist`

await $`echo `

await $`rsync -av --progress -e ssh dist.tar.gz aclisp.xyz:/var/www/www.aclisp.xyz`
await $`rm dist.tar.gz`

await $`echo `

const remoteDeploymentCommands = `
cd /var/www/www.aclisp.xyz &&
rm -rf dist &&
tar zxf dist.tar.gz &&
rm dist.tar.gz
`

await $`ssh aclisp.xyz ${remoteDeploymentCommands}`

await $`echo `
await $`echo "Deployment successful!"`
