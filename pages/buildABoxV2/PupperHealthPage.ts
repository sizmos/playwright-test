import { Page } from '@playwright/test';
import IntercomComponent from '../External/IntercomComponent';

export enum BodyShape {
  Slim = 'A bit slim',
  JustRight = 'Just right',
  CarriesExtra = 'Carries a bit extra',
}

export enum ActiveLevel {
  Chilled = 'Chilled out',
  Play = 'Loves to play',
  Energy = 'Ball of energy',
}

export enum EatingHabit {
  Fussy = 'Seriously fussy',
  Choosy = 'Can be choosy',
  Anything = 'Will eat anything',
}

export enum Answer {
  Yes = 'Yes',
  No = 'No',
}

export default (page: Page) => {
  const intercom = IntercomComponent(page);

  const getNextButton = () => page.locator('[title="Next"]');

  const getBodyShapeOption = (bodyShape: BodyShape, index: number = 1) =>
    page.locator(
      `#dog-${index} .card:has(.text-secondary:has-text("${bodyShape}"))`
    );

  const getActiveLevelOption = (activeLevel: ActiveLevel, index: number = 1) =>
    page.locator(
      `#dog-${index} .card:has(.text-secondary:has-text("${activeLevel}"))`
    );

  const getEatingHabitOption = (eatingHabit: EatingHabit, index: number = 1) =>
    page.locator(
      `#dog-${index} .card:has(.text-secondary:has-text("${eatingHabit}"))`
    );

  const getAnswerOption = (answer: Answer) =>
    page.locator(`[dog-data-options*="object"] .title:has-text("${answer}")`);

  const clickNext = async () => {
    try {
      await intercom.close();
      await getNextButton().click({ timeout: 5000 });
    } catch (e) {
      await intercom.close();
      await clickNext();
    }
  };

  const fillPupperHealth = async (
    bodyShape: BodyShape,
    activeLevel: ActiveLevel,
    eatingHabit: EatingHabit,
    intolerance: Answer,
    healthIssue: Answer
  ) => {
    await getBodyShapeOption(bodyShape).click();
    await clickNext();

    await getActiveLevelOption(activeLevel).click();
    await clickNext();

    await getEatingHabitOption(eatingHabit).click();
    await clickNext();

    await getAnswerOption(intolerance).click();
    await clickNext();

    await getAnswerOption(healthIssue).click();
    await clickNext();
  };

  return { fillPupperHealth };
};
