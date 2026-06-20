import { test, expect } from '@playwright/test';

test('Upload Document', async ({ page }) => {

  // Create an HTML page with a file input element
  await page.setContent(`
    <input type="file" id="fileInput" />
    <button onclick="document.getElementById('fileInput').click()">Upload</button>
  `);

  // Upload the file
  const fileInput = page.locator('#fileInput');
  await fileInput.setInputFiles('./tests/test-document.txt');

  // Verify file was selected
  const fileName = await fileInput.inputValue();
  console.log('File selected:', fileName); 

});