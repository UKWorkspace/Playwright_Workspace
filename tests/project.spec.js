import { test, expect } from "@playwright/test";

test("Assignment", async ({ page }) => {
  // Scenario 1
  await page.goto(
    "https://www.booking.com/?chal_t=1781950395544&force_referer=",
  );
  await page.getByRole("button", { name: "Dismiss sign-in info." }).click();

  await expect(page.getByTestId("header-booking-logo")).toBeVisible();

  await page.getByTestId("header-language-picker-trigger").click();
  await page.getByRole("button", { name: "English (US)" }).click();

  await page.getByTestId("occupancy-config").click();
  await page
    .locator(
      "div:nth-child(2) > .e301a14002 > .de576f5064.b46cd7aad7.e26a59bb37.c295306d66.c7a901b0e7.aaf9b6e287",
    )
    .click();
  await page
    .getByTestId("kids-ages-select")
    .getByLabel("Age of child 1 on check-out")
    .selectOption("8");
  await page.getByRole("button", { name: "Done" }).click();

  await page.getByRole("combobox", { name: "Where are you going?" }).click();
  await page
    .getByRole("combobox", { name: "Where are you going?" })
    .fill("stockholm");
  await page.getByText("Stockholm", { exact: true }).click();
  await page.getByRole("checkbox", { name: "Th 25 June" }).click();
  await page.getByRole("checkbox", { name: "Mo 29 June" }).click();
  await page.getByRole("button", { name: "Search" }).click();

  //   Scenario 2
  await page.getByTestId("header-currency-picker-trigger").click();
  await page.getByRole("button", { name: "Swedish Krona SEK" }).click();
  await page.locator(".fc835e65e6").first().click();
  await page.getByText("SEK 2,000 – SEK 6,000+").click();

  await page
    .locator('[id="filter_group_mealplan_:r3b:"]')
    .getByText("Breakfast included")
    .click();
});
