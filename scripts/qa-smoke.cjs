const {chromium}=require('playwright');
const path=require('node:path');
(async()=>{
  const browser=await chromium.launch({headless:true,channel:'msedge'});
  const context=await browser.newContext({viewport:{width:1440,height:960},locale:'fr-FR'});
  const page=await context.newPage();const errors=[];page.on('pageerror',e=>errors.push(e.message));
  await page.goto('http://127.0.0.1:4173/connexion.html');await page.screenshot({path:path.resolve('../connexion-fr.png')});
  await page.locator('[data-demo="etudiant"]').click();await page.waitForURL('**/etudiant.html');await page.screenshot({path:path.resolve('../espace-etudiant-fr.png')});
  console.log(JSON.stringify({title:await page.title(),errors}));await browser.close();
})().catch(e=>{console.error(e);process.exitCode=1;});
