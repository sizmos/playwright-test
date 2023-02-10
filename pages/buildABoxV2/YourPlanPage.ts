import { Page } from '@playwright/test';

export enum PlanType {
  Half = 'Half bowl subscription',
  Full = 'Full bowl subscription',
  Starter = '2 week starter box',
}

export default (page: Page) => {
  const getPlanButton = (planType: PlanType) => {
    if (process.env.DEVICE.includes('Desktop')) {
      return page.locator(`.d-none [text*="${planType}"]`);
    }
    return page.locator(`.d-block [text*="${planType}"]`);
  };

  const selectYourPlan = async (planType: PlanType) => {
    await getPlanButton(planType).click();
  };

  return { selectYourPlan };
};
