import { expect, test } from "@playwright/test";

test("Sample Test Suite", async ({ browser,page }) => {

    await page.goto("https://www.google.com");
    await expect(page).toHaveTitle("Google");

    await page.screenshot({ path: "google.png", fullPage: true });



});