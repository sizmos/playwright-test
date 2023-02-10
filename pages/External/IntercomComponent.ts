import { Page } from '@playwright/test';

export default (page: Page) => {
  const getIntercomApp = () =>
    page.locator(
      '.intercom-lightweight-app .intercom-lightweight-app-launcher'
    );

  const getIntercomNotificationsFrame = () =>
    page.frameLocator('[name="intercom-notifications-frame"]');

  const getNotificationsFrameLocator = () =>
    page.locator('iframe[name="intercom-notifications-frame"]');

  const getIntercomClose = () =>
    getIntercomNotificationsFrame().locator('.intercom-notifications button');

  const waitForLoad = async () => {
    await getIntercomApp().waitFor();
  };

  const close = async () => {
    try {
      await getNotificationsFrameLocator().waitFor({
        state: 'detached',
        timeout: 2000,
      });
    } catch (e) {
      await getIntercomClose().click();
    }
  };

  return { waitForLoad, close };
};
