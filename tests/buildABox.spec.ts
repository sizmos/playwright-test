import { test } from '@playwright/test';
import pupperDetailsPage, {
  BreedType,
  Gender,
} from '../pages/buildABoxV2/PupperDetailsPage';
import pupperHealthPage, {
  ActiveLevel,
  Answer,
  BodyShape,
  EatingHabit,
} from '../pages/buildABoxV2/PupperHealthPage';
import aboutYouPage from '../pages/buildABoxV2/AboutYouPage';

test('Lyka Build a Box V2 Journey', async ({ page }) => {
  const pupperDetails = pupperDetailsPage(page);
  await pupperDetails.goto();
  await pupperDetails.fillPupperDetails(
    'Archimedes',
    '2042',
    Gender.Boy,
    BreedType.MixBreed,
    'American Bulldog | Akita',
    '3',
    '10',
    '12.3'
  );

  const pupperHealth = pupperHealthPage(page);
  await pupperHealth.fillPupperHealth(
    BodyShape.CarriesExtra,
    ActiveLevel.Energy,
    EatingHabit.Anything,
    Answer.No,
    Answer.No
  );

  const aboutYou = aboutYouPage(page);
  await aboutYou.fillAboutYou('Adam Test', 'test@gmail.com', 'Archimedes');
});
