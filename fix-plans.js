const fs = require('fs');
const path = require('path');

const plansDir = path.join(__dirname, 'testsprite-plans');
const filesToUpdate = [
  'arsip-crud.json',
  'peminjaman-crud.json',
  'rak-crud.json',
  'dashboard-loads.json'
];

const loginSteps = [
  { type: "action", description: "Navigate to the login page" },
  { type: "action", description: "Fill the email input with 'admin@siwono.local' and the password input with 'password123'" },
  { type: "action", description: "Submit the login form" }
];

const sidebarLinks = {
  'arsip-crud.json': "Click the 'Arsip' link in the sidebar",
  'peminjaman-crud.json': "Click the 'Peminjaman' link in the sidebar",
  'rak-crud.json': "Click the 'Rak' link in the sidebar",
  'dashboard-loads.json': null // no need to click anything, login redirects to dashboard
};

filesToUpdate.forEach(file => {
  const filePath = path.join(plansDir, file);
  if (fs.existsSync(filePath)) {
    const data = JSON.parse(fs.readFileSync(filePath, 'utf8'));
    
    // Remove the first step if it's "Navigate to..."
    let steps = data.planSteps;
    if (steps[0].description.toLowerCase().includes('navigate to')) {
      steps.shift(); // remove first step
    }

    const nextStep = sidebarLinks[file];
    const newSteps = [...loginSteps];
    if (nextStep) {
      newSteps.push({ type: "action", description: nextStep });
    }

    data.planSteps = [...newSteps, ...steps];

    fs.writeFileSync(filePath, JSON.stringify(data, null, 2));
    console.log(`Updated ${file}`);
  }
});
