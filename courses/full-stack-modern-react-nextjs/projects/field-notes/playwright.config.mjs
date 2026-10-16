import {defineConfig,devices,chromium} from '@playwright/test';
import {existsSync} from 'node:fs';
const executable=existsSync(chromium.executablePath())?chromium.executablePath():existsSync('/usr/bin/google-chrome')?'/usr/bin/google-chrome':undefined;
export default defineConfig({
 testMatch:'smoke.spec.mjs',workers:1,timeout:60000,
 use:{baseURL:'http://127.0.0.1:5173',...devices['Desktop Chrome'],launchOptions:{executablePath:executable,args:['--no-sandbox']},trace:'retain-on-failure'},
 webServer:[
  {command:'npm run dev:api',url:'http://127.0.0.1:4000/health',reuseExistingServer:false},
  {command:'npm run dev:web',url:'http://127.0.0.1:5173',reuseExistingServer:false},
  {command:'npm run dev:ssr',url:'http://127.0.0.1:5174',reuseExistingServer:false},
  {command:'npm start --workspace=@field-notes/next-app',url:'http://127.0.0.1:3001',reuseExistingServer:false}
 ]
});
