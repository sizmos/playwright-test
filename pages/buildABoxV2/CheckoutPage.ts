import { Page, Locator, expect } from '@playwright/test';
import IntercomComponent from '../External/IntercomComponent';

export enum DeliveryPlace {
  Home = 'Home',
  Work = 'Work',
}

export enum DeliveryTime {
  AM = '12am - 7am',
  PM = '8am - 6pm',
}

export default (page: Page) => {
  const intercom = IntercomComponent(page);

  const getDiscountCodeField = () =>
    page.locator('[placeholder="Add discount code"]');

  const getDiscountApplyButton = () =>
    page.locator('.discount-input-div [title="Apply"]');

  const getDiscountMessage = () =>
    page.locator(
      '.tooltip-wrapper div.text-secondary:has-text("successfully applied")'
    );

  const getMobileField = () => page.locator('#mobile');
  const getPasswordField = () => page.locator('#password');
  const getConfirmPasswordField = () => page.locator('#confirmPassword');
  const getChannelDropdown = () =>
    page.locator('#my-details div:has(label:has-text("How did you hear"))');
  const getDeliveryPlaceOption = (deliveryPlace: DeliveryPlace) =>
    page.locator(
      `div:has(label:has-text("Delivery place")) span.title:has-text("${deliveryPlace}")`
    );
  const getAddressField = () => page.locator('[placeholder="Enter Address"]');
  const getAddressOption = (address: string) =>
    page.locator(`.data-options .text-secondary:has-text("${address}")`);
  const getDeliveryTimeOption = (deliveryTime: DeliveryTime) =>
    page.locator(
      `#delivery-details div.d-none:has(label:has-text("Delivery time")) span.title:has-text("${deliveryTime}")`
    );
  const getDeliveryDateOption = (deliveryOption: string) =>
    page.locator(
      `#delivery-details div:has(label:has-text("Delivery date")) span.title:has-text("${deliveryOption}")`
    );
  const getAddDeliveryInstructions = () =>
    page.locator('#get-started-page .add-delivery-ins');
  const getDeliveryInstructionsField = () =>
    page.locator('#get-started-page .delivery-instruction-textarea-input');

  const getStripeFrame = () => page.frameLocator('[name*=StripeFrame]');
  const getCardNumberField = () =>
    getStripeFrame().locator('[name="cardnumber"]');
  const getExpiryField = () => getStripeFrame().locator('[name="exp-date"]');
  const getCvcField = () => getStripeFrame().locator('[name="cvc"]');
  const getZipField = () => getStripeFrame().locator('[name="postal"]');

  const getConfirmAndPayButton = () =>
    page.locator('.submit-button #submit-button');

  const getDashboardButton = () =>
    page.locator('[title="Continue to dashboard"]');

  const selectDropdownOption = async (dropdown: Locator, option: string) => {
    await dropdown.locator('.main-button').click();
    await dropdown.locator(`span:has-text("${option}")`).click();
  };

  const setUserDetails = async (
    mobile: string,
    password: string,
    channel: string
  ) => {
    await getMobileField().type(mobile);
    await getPasswordField().type(password);
    await getConfirmPasswordField().type(password);
    await selectDropdownOption(getChannelDropdown(), channel);
  };

  const setDeliveryDate = async (date: string) => {
    const deliveryOption = date !== 'ASAP' ? 'Select date' : 'ASAP';
    await getDeliveryDateOption(deliveryOption).click();

    if (deliveryOption !== 'ASAP') {
      // TODO Add select date calendar picker logic
    }
  };

  const setDeliveryDetails = async (
    place: DeliveryPlace,
    address: string,
    deliveryTime: DeliveryTime = null,
    deliveryDate: string = null,
    deliveryInstructions: string = null
  ) => {
    await getDeliveryPlaceOption(place).click();
    await getAddressField().type(address);
    try {
      await intercom.close();
      await getAddressOption(address).click({ timeout: 2000 });
    } catch (e) {
      await intercom.close();
      await getAddressOption(address).click();
    }

    // TODO Align delivery time with cutoffs when choosing ASAP
    if (deliveryTime) {
      await getDeliveryTimeOption(deliveryTime).click();
    }

    if (deliveryDate) {
      await setDeliveryDate(deliveryDate);
    }

    if (deliveryInstructions) {
      await getAddDeliveryInstructions().click();
      await getDeliveryInstructionsField().type(deliveryInstructions);
    }
  };

  const setPaymentDetails = async (
    cardNumber = '4242 4242 4242 4242',
    expiry = '0424',
    cvc = '242',
    zip = '42424'
  ) => {
    await getCardNumberField().type(cardNumber);
    await getExpiryField().type(expiry);
    await getCvcField().type(cvc);
    await getZipField().type(zip);
  };

  const clickPay = async () => {
    try {
      await intercom.close();
      await getConfirmAndPayButton().click({ timeout: 5000 });
    } catch (e) {
      await intercom.close();
      await getConfirmAndPayButton().click();
    }

    await getConfirmAndPayButton().waitFor({ state: 'hidden' });
  };

  const completeCheckout = async (
    discountCode: string = null,
    discountAmount: string = null
  ) => {
    if (discountCode) {
      await getDiscountCodeField().type(discountCode);
      await getDiscountApplyButton().click();

      await expect(getDiscountMessage()).toHaveText(
        `${discountAmount} off successfully applied`
      );
    }

    await setUserDetails('0400111222', process.env.USER_PASSWORD, 'Facebook');
    await setDeliveryDetails(
      DeliveryPlace.Home,
      '29 Amelia Street, WATERLOO NSW 2017'
    );
    await setPaymentDetails();

    await new Promise((res) => setTimeout(res, 2000));

    await clickPay();
    await getDashboardButton().click();
  };

  return { completeCheckout };
};
