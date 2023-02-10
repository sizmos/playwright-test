import { Page, expect } from '@playwright/test';

export default (page: Page) => {
  const getNameField = () => page.locator('[placeholder="Your Name"]');

  const getEmailField = () => page.locator('[placeholder="Email"]');

  const fillAboutYou = async (name: string, email: string, dogName: string) => {
    await getNameField().type(name);
    await getEmailField().type(email);
  };

  return { fillAboutYou };
};
