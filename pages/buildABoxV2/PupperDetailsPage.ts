import { Page, expect } from '@playwright/test';

import intercomComponent from '../External/IntercomComponent';

export enum Gender {
  Boy = 'Boy',
  Girl = 'Girl',
}

export enum BreedType {
  PureBreed = 'Pure Breed',
  MixBreed = 'Mix Breed',
  Unknown = 'Unknown',
}

export default (page: Page) => {
  const intercom = intercomComponent(page);

  const getDogNameField = (index: number = 1) =>
    page.locator(`#dogNameInput-${index}`);

  const getNextButton = () => page.locator('[title="Next"]');

  const getPostcodeField = () => page.locator('#postcodeInput');

  const getHeadingText = () => page.locator('.gender-question .heading-text');

  const getGenderOption = (gender: Gender) =>
    page.locator(`.dog-gender-question .title:has-text("${gender}")`);

  const getBreedOption = (breed: BreedType) =>
    page.locator(`.dog-breed-question .title:has-text("${breed}")`);

  const getBreedField = () => page.locator('[placeholder="Select a breed"]');

  const getBreedDropOption = (breed: string) =>
    page.locator(`.list-group .text-secondary:has-text("${breed}")`).nth(0);

  const getYearsField = (index: number = 1) =>
    page.locator(`#dogAge-years-${index}`);

  const getMonthsField = (index: number = 1) =>
    page.locator(`#dogAge-months-${index}`);

  const getWeightField = (index: number = 1) =>
    page.locator(`#dogWeight-${index}`);

  const goto = async () => {
    await page.goto('https://lyka.com.au/get-started');
  };

  const clickNext = async () => {
    try {
      await intercom.close();
      await getNextButton().click({ timeout: 5000 });
    } catch (e) {
      await intercom.close();
      await getNextButton().click();
    }
  };

  const setBreed = async (breedType: BreedType, breed: string) => {
    await getBreedOption(breedType).click();

    if (breedType === 'Pure Breed') {
      await getBreedField().nth(0).type(breed);
    }

    if (breedType === 'Mix Breed') {
      const mixBreed = breed.split('|');
      await getBreedField().nth(0).type(mixBreed[0].trim());
      await getBreedDropOption(mixBreed[0]).click();
      await getBreedField().nth(1).type(mixBreed[1].trim());
      await getBreedDropOption(mixBreed[1]).click();
    }
  };

  const fillPupperDetails = async (
    dogName: string,
    postcode: string,
    gender: Gender,
    breedType: BreedType,
    breed: string,
    years: string,
    months: string,
    weight: string
  ) => {
    await intercom.waitForLoad();
    await getDogNameField().type(dogName);
    await clickNext();

    await getPostcodeField().type(postcode);
    await clickNext();

    await expect(getHeadingText()).toHaveText(`Is ${dogName} a boy or girl?`);
    await getGenderOption(gender).click();
    await clickNext();

    await setBreed(breedType, breed);
    await clickNext();

    await getYearsField().type(years);
    await getMonthsField().type(years);
    await clickNext();

    await getWeightField().type(weight);
    await clickNext();
  };

  return { goto, fillPupperDetails };
};
