var __typeError = (msg) => {
  throw TypeError(msg);
};
var __accessCheck = (obj, member, msg) => member.has(obj) || __typeError("Cannot " + msg);
var __privateGet = (obj, member, getter) => (__accessCheck(obj, member, "read from private field"), getter ? getter.call(obj) : member.get(obj));
var __privateAdd = (obj, member, value) => member.has(obj) ? __typeError("Cannot add the same private member more than once") : member instanceof WeakSet ? member.add(obj) : member.set(obj, value);
var __privateSet = (obj, member, value, setter) => (__accessCheck(obj, member, "write to private field"), setter ? setter.call(obj, value) : member.set(obj, value), value);
var __privateMethod = (obj, member, method) => (__accessCheck(obj, member, "access private method"), method);
var _lottoNumbers, _count, _Lotto_instances, ascendingSort_fn, _lottos, _count2, _checkCountResult, _LottoPack_instances, generateLottos_fn, saveCheckCount_fn, mappingWinningCount_fn;
(function polyfill() {
  const relList = document.createElement("link").relList;
  if (relList && relList.supports && relList.supports("modulepreload")) {
    return;
  }
  for (const link of document.querySelectorAll('link[rel="modulepreload"]')) {
    processPreload(link);
  }
  new MutationObserver((mutations) => {
    for (const mutation of mutations) {
      if (mutation.type !== "childList") {
        continue;
      }
      for (const node of mutation.addedNodes) {
        if (node.tagName === "LINK" && node.rel === "modulepreload")
          processPreload(node);
      }
    }
  }).observe(document, { childList: true, subtree: true });
  function getFetchOpts(link) {
    const fetchOpts = {};
    if (link.integrity) fetchOpts.integrity = link.integrity;
    if (link.referrerPolicy) fetchOpts.referrerPolicy = link.referrerPolicy;
    if (link.crossOrigin === "use-credentials")
      fetchOpts.credentials = "include";
    else if (link.crossOrigin === "anonymous") fetchOpts.credentials = "omit";
    else fetchOpts.credentials = "same-origin";
    return fetchOpts;
  }
  function processPreload(link) {
    if (link.ep)
      return;
    link.ep = true;
    const fetchOpts = getFetchOpts(link);
    fetch(link.href, fetchOpts);
  }
})();
const DomSelector = {
  lottoGame: document.querySelector("#lottoGame"),
  purchaseAmount: document.querySelector("#purchaseAmount"),
  purchaseButton: document.querySelector("#purchaseButton"),
  purchaseCount: document.querySelector(".purchase_count"),
  lottoPack: document.querySelector(".lotto_pack"),
  answerLottoSection: document.querySelector(".answer_lotto_section"),
  reusltButton: document.querySelector(".reuslt_button_section #resultButton"),
  winningNumbers: document.querySelectorAll(".winning_number"),
  bonusNumber: document.querySelector(".bonus_number"),
  lottoResultModal: document.querySelector(".lotto_result_modal"),
  errorModal: document.querySelector(".error_modal"),
  lottoResult: document.getElementById("lottoResult"),
  statistics: document.querySelector(".statistics"),
  statisticsRows: document.querySelectorAll(".statistics .row"),
  profitRate: document.querySelector(".profit_rate"),
  restartButton: document.querySelector("#restartButton")
};
const DomUpdator = {
  content: (element, content) => {
    element.textContent = content;
  },
  removeClass: (element, className) => {
    element.classList.remove(className);
  },
  addClass: (element, className) => {
    element.classList.add(className);
  },
  blur: (element) => {
    element.blur();
  },
  initialInputValue: (element) => {
    element.value = "";
  },
  replaceChildren: (element) => {
    element.replaceChildren();
  },
  showModal: (element, flag) => {
    if (flag) {
      element.showModal();
      return;
    }
    element.close();
  }
};
const WINNING = "당첨 번호";
const BONUS = "보너스 번호";
const LOTTO_NUMBER_MAX_LENGTH = 6;
const LOTTO_NUMBER_START = 1;
const LOTTO_NUMBER_END = 45;
const HUNDRED_PERCENT = 100;
const LOTTO_PURCHASE_UNIT = 1e3;
const YES = "y";
const NO = "n";
const LOTTO_NUMBER_SPLITER$1 = ",";
const MATCH_COUNT = Object.freeze({
  THREE: "3개 일치 (5,000원)",
  FOUR: "4개 일치 (50,000원)",
  FIVE: "5개 일치 (1,500,000원)",
  FIVE_BONUS: "5개 일치, 보너스 볼 일치 (30,000,000원)",
  SIX: "6개 일치 (2,000,000,000원)"
});
class Lotto {
  constructor(lottoNumbers) {
    __privateAdd(this, _Lotto_instances);
    __privateAdd(this, _lottoNumbers);
    __privateAdd(this, _count, {
      winningCount: 0,
      bonusCount: 0
    });
    __privateSet(this, _lottoNumbers, __privateMethod(this, _Lotto_instances, ascendingSort_fn).call(this, lottoNumbers));
  }
  compareWinningNumbers(answerLotto) {
    __privateGet(this, _lottoNumbers).forEach((number) => {
      if (answerLotto[number] === WINNING) {
        __privateGet(this, _count).winningCount += 1;
      }
      if (answerLotto[number] === BONUS) {
        __privateGet(this, _count).bonusCount += 1;
      }
    });
    return __privateGet(this, _count);
  }
  get lottoNumbers() {
    return [...__privateGet(this, _lottoNumbers)];
  }
}
_lottoNumbers = new WeakMap();
_count = new WeakMap();
_Lotto_instances = new WeakSet();
ascendingSort_fn = function(lottoNumbers) {
  return [...lottoNumbers].sort((a, b) => a - b);
};
class LottoPack {
  constructor(lottos, count) {
    __privateAdd(this, _LottoPack_instances);
    __privateAdd(this, _lottos);
    __privateAdd(this, _count2);
    __privateAdd(this, _checkCountResult, {
      [MATCH_COUNT.SIX]: 0,
      [MATCH_COUNT.FIVE_BONUS]: 0,
      [MATCH_COUNT.FIVE]: 0,
      [MATCH_COUNT.FOUR]: 0,
      [MATCH_COUNT.THREE]: 0
    });
    __privateSet(this, _lottos, __privateMethod(this, _LottoPack_instances, generateLottos_fn).call(this, lottos));
    __privateSet(this, _count2, count);
  }
  compareAndReturnResult(answerLotto) {
    __privateGet(this, _lottos).forEach((lotto) => {
      const { winningCount, bonusCount } = lotto.compareWinningNumbers(answerLotto);
      __privateMethod(this, _LottoPack_instances, saveCheckCount_fn).call(this, winningCount, bonusCount);
    });
    return __privateGet(this, _checkCountResult);
  }
  get lottos() {
    return [...__privateGet(this, _lottos)];
  }
  get count() {
    return __privateGet(this, _count2);
  }
}
_lottos = new WeakMap();
_count2 = new WeakMap();
_checkCountResult = new WeakMap();
_LottoPack_instances = new WeakSet();
generateLottos_fn = function(lottos) {
  return lottos.map((lottoNumbers) => {
    return new Lotto(lottoNumbers);
  });
};
saveCheckCount_fn = function(winningCount, bonusCount) {
  if (winningCount >= 3) {
    const matchKey = __privateMethod(this, _LottoPack_instances, mappingWinningCount_fn).call(this, winningCount, bonusCount);
    __privateGet(this, _checkCountResult)[matchKey]++;
  }
};
mappingWinningCount_fn = function(winningCount, bonusCount) {
  if (winningCount === 5 && bonusCount === 1) {
    return MATCH_COUNT.FIVE_BONUS;
  }
  const matchMap = {
    6: MATCH_COUNT.SIX,
    5: MATCH_COUNT.FIVE,
    4: MATCH_COUNT.FOUR,
    3: MATCH_COUNT.THREE
  };
  return matchMap[winningCount];
};
const Validator = {
  isEmpty(input) {
    return !input;
  },
  isZero(input) {
    return input === 0;
  },
  isNotDivisible(purchaseAmount) {
    return purchaseAmount % LOTTO_PURCHASE_UNIT !== 0;
  },
  isFormat(numbers) {
    return numbers.length === 1;
  },
  isNotNumber(numbers) {
    return numbers.some((number) => isNaN(number));
  },
  isMaxLength(numbers) {
    return numbers.length !== LOTTO_NUMBER_MAX_LENGTH;
  },
  isWinningNumbersRange(numbers) {
    return !numbers.every((num) => num >= LOTTO_NUMBER_START && num <= LOTTO_NUMBER_END);
  },
  isDuplicate(numbers) {
    return new Set(numbers).size !== numbers.length;
  },
  isBonusNumberRange(number) {
    return number < LOTTO_NUMBER_START || number > LOTTO_NUMBER_END;
  },
  isIncludeNumber(Numbers, number) {
    return Numbers.includes(number);
  },
  isYesOrNo(input) {
    return input !== YES && input !== NO;
  }
};
const generateRandomNumber = (start, end) => Math.floor(Math.random() * end - start + 1) + start;
const pushRandomNumbers = (randomNumbers) => {
  while (randomNumbers.length < LOTTO_NUMBER_MAX_LENGTH) {
    const randomNumber = generateRandomNumber(LOTTO_NUMBER_START, LOTTO_NUMBER_END);
    randomNumbers.push(randomNumber);
  }
  return randomNumbers;
};
const createSixRandomNumbers = () => {
  const initialRandomNumbers = [];
  const randomNumbers = pushRandomNumbers(initialRandomNumbers);
  if (Validator.isDuplicate(randomNumbers)) return createSixRandomNumbers();
  return randomNumbers;
};
const generateLottoNumbersSet = (count) => {
  const lottoNumbersSet = [];
  for (let i = 1; i <= count; i++) {
    const sixRandomNumber = createSixRandomNumbers();
    lottoNumbersSet.push(sixRandomNumber);
  }
  return lottoNumbersSet;
};
const purchaseLottoCount = (money) => money / LOTTO_PURCHASE_UNIT;
const LottoMachine = (purchaseAmount) => {
  const count = purchaseLottoCount(purchaseAmount);
  const lottoNumbersSet = generateLottoNumbersSet(count);
  const lottoPack = new LottoPack(lottoNumbersSet, count);
  return lottoPack;
};
const ERROR_MESSAGE = Object.freeze({
  NOT_DIVISIBLE_BY_UNIT: "구매 가격은 1000원 단위로 입력해주세요.",
  INVALID_INPUT_PRICE: "숫자 값만 입력해주세요.",
  INVALID_INPUT_PRICE_ZERO: "0이 아닌 숫자를 입력해주세요.",
  INVALID_WINNING_NUMBERS_FORMAT: "숫자와 구분자로 입력해주세요.",
  INVALID_WINNING_NUMBERS_COUNT: "6개의 숫자를 입력해주세요.",
  INVALID_WINNING_NUMBERS_TYPE: "6개의 값 모두 숫자로 입력해주세요.",
  INVALID_WINNING_NUMBERS_RANGE: "6개의 숫자는 1~45 사이로 입력해주세요.",
  DUPLICATE_WINNING_NUMBERS: "6개의 숫자는 중복없이 입력해주세요.",
  INVALID_BONUS_NUMBER_TYPE: "보너스 번호는 숫자로 입력해주세요.",
  INVALID_BONUS_NUMBER_RANGE: "보너스 번호는 1~45 사이로 입력해주세요.",
  DUPLICATE_BONUS_NUMBER: "보너스 번호는 당첨번호와 중복되지 않게 입력해주세요.",
  INVALID_RESTART_FORMAT: "재시작 여부는 y 또는 n으로 입력해주세요."
});
const Parser = {
  number: (input) => Number(input),
  splitWinningNumbers: (input) => input.split(LOTTO_NUMBER_SPLITER$1).map((number) => Number(number.trim())),
  yesOrNo: (input) => input === YES
};
const parseAndValidatePurchaseAmount = (input) => {
  const purchaseAmount = parsePurchaseAmount(input);
  validatePurchaseAmount(purchaseAmount);
  return purchaseAmount;
};
const validatePurchaseAmount = (purchaseAmount) => {
  if (Validator.isZero(purchaseAmount)) throw new Error(ERROR_MESSAGE.INVALID_INPUT_PRICE_ZERO);
  if (Validator.isEmpty(purchaseAmount)) throw new Error(ERROR_MESSAGE.INVALID_INPUT_PRICE);
  if (Validator.isNotDivisible(purchaseAmount)) throw new Error(ERROR_MESSAGE.NOT_DIVISIBLE_BY_UNIT);
};
const parsePurchaseAmount = (input) => {
  return Parser.number(input);
};
const LOTTO_NUMBER_SPLITER = ", ";
const OUTPUT_MESSAGE = Object.freeze({
  PURCHASE_COUNT: (count) => `${count}개를 구매했습니다.`,
  LOTTO_NUMBERS: (lottoNumbers) => `[${lottoNumbers.join(LOTTO_NUMBER_SPLITER)}]`,
  PROFIT_RATE: (profitRate) => `총 수익률은 ${profitRate}%입니다.`
});
const WebView = {
  updatePurchaseCount(element, count) {
    DomUpdator.content(element, `총 ${OUTPUT_MESSAGE.PURCHASE_COUNT(count)}`);
  },
  updateLottoPack(element, lottos) {
    lottos.forEach((lotto) => {
      element.innerHTML += `
                <div class="lotto">
                    <img src="./public/ticket.png" alt="로또" width="34px" height="36px" />
                    <span>${lotto.lottoNumbers.join(`${LOTTO_NUMBER_SPLITER$1} `)}</span>
                </div>
                  `;
    });
  },
  updateStatistics(element, winningResult) {
    element.forEach((row) => {
      const price = row.querySelector(".price").textContent;
      const matchedKey = Object.keys(winningResult).find((key) => key.includes(price));
      if (matchedKey) {
        DomUpdator.content(row.querySelector(".user_count"), `${winningResult[matchedKey]}개`);
      }
    });
  },
  updateProfitRate(element, profitRate) {
    DomUpdator.content(element, `당신의 총 수익률은 ${profitRate}%입니다.`);
  }
};
const handlePurchase = () => {
  const lotto_game = DomSelector.lottoGame;
  const purchase_amount = DomSelector.purchaseAmount;
  const purchase_count = DomSelector.purchaseCount;
  const lotto_pack = DomSelector.lottoPack;
  const error_modal = DomSelector.errorModal;
  try {
    const purchaseAmount = parseAndValidatePurchaseAmount(purchase_amount.value);
    const lottoPack = LottoMachine(purchaseAmount);
    WebView.updatePurchaseCount(purchase_count, lottoPack.count);
    WebView.updateLottoPack(lotto_pack, lottoPack.lottos);
    DomUpdator.removeClass(lotto_game, "opacity-0");
    DomUpdator.blur(purchase_amount);
    return { purchaseAmount, lottoPack };
  } catch (error) {
    DomUpdator.initialInputValue(purchase_amount);
    DomUpdator.content(error_modal, error);
    DomUpdator.showModal(error_modal, true);
  }
};
const handleRestart = () => {
  const lotto_game = DomSelector.lottoGame;
  const lotto_result_modal = DomSelector.lottoResultModal;
  const purchase_amount = DomSelector.purchaseAmount;
  const purchase_count = DomSelector.purchaseCount;
  const lotto_pack = DomSelector.lottoPack;
  const winning_numbers = DomSelector.winningNumbers;
  const bonus_number = DomSelector.bonusNumber;
  DomUpdator.showModal(lotto_result_modal, false);
  DomUpdator.replaceChildren(lotto_pack);
  DomUpdator.initialInputValue(purchase_amount);
  DomUpdator.content(purchase_count, "");
  DomUpdator.addClass(lotto_game, "opacity-0");
  winning_numbers.forEach((element) => {
    DomUpdator.initialInputValue(element);
  });
  DomUpdator.initialInputValue(bonus_number);
};
const generateAnswerLotto = (winningNumbers, bonusNumber) => {
  const answerLotto = {};
  winningNumbers.forEach((number) => {
    answerLotto[number] = WINNING;
  });
  answerLotto[bonusNumber] = BONUS;
  return answerLotto;
};
const parseAndValidateBonusNumber = (winningNumbers) => {
  return (bonusNumberInput) => {
    const bonusNumber = parseBonusNumber(bonusNumberInput);
    validateBonusNumber(winningNumbers, bonusNumber);
    return bonusNumber;
  };
};
const validateBonusNumber = (winningNumbers, bonusNumber) => {
  if (Validator.isEmpty(bonusNumber)) throw new Error(ERROR_MESSAGE.INVALID_BONUS_NUMBER_TYPE);
  if (Validator.isBonusNumberRange(bonusNumber)) throw new Error(ERROR_MESSAGE.INVALID_BONUS_NUMBER_RANGE);
  if (Validator.isIncludeNumber(winningNumbers, bonusNumber)) throw new Error(ERROR_MESSAGE.DUPLICATE_BONUS_NUMBER);
};
const parseBonusNumber = (input) => {
  return Parser.number(input);
};
const parseAndValidateWinningNumbers = (input) => {
  const winningNumbers = parseWinningNumbers(input);
  validateWinningNumbers(winningNumbers);
  return winningNumbers;
};
const validateWinningNumbers = (winningNumbers) => {
  if (Validator.isFormat(winningNumbers)) throw new Error(ERROR_MESSAGE.INVALID_WINNING_NUMBERS_FORMAT);
  if (Validator.isMaxLength(winningNumbers)) throw new Error(ERROR_MESSAGE.INVALID_WINNING_NUMBERS_COUNT);
  if (Validator.isNotNumber(winningNumbers)) throw new Error(ERROR_MESSAGE.INVALID_WINNING_NUMBERS_TYPE);
  if (Validator.isWinningNumbersRange(winningNumbers)) throw new Error(ERROR_MESSAGE.INVALID_WINNING_NUMBERS_RANGE);
  if (Validator.isDuplicate(winningNumbers)) throw new Error(ERROR_MESSAGE.DUPLICATE_WINNING_NUMBERS);
};
const parseWinningNumbers = (input) => {
  return Parser.splitWinningNumbers(input);
};
const processDecimalPoint = (rate) => {
  if (rate % 1 === 0) {
    return rate;
  } else if (rate * 10 % 1 === 0) {
    return rate.toFixed(1);
  }
  return rate.toFixed(2);
};
const WINNING_PRICE = Object.freeze({
  [MATCH_COUNT.SIX]: 2e9,
  [MATCH_COUNT.FIVE_BONUS]: 3e7,
  [MATCH_COUNT.FIVE]: 15e5,
  [MATCH_COUNT.FOUR]: 5e4,
  [MATCH_COUNT.THREE]: 5e3
});
const calculateProfitAmount = (winningResult) => {
  const totalWinningAmount = Object.entries(winningResult).reduce((proceeds, [matchCount, winningCount]) => {
    return proceeds + WINNING_PRICE[matchCount] * winningCount;
  }, 0);
  return totalWinningAmount;
};
const calculateProfitRate = (profitAmount, purchaseAmount) => {
  return profitAmount / purchaseAmount * HUNDRED_PERCENT;
};
const profitCalculator = (purchaseAmount, winningResult) => {
  const profitAmount = calculateProfitAmount(winningResult);
  const rate = calculateProfitRate(profitAmount, purchaseAmount);
  const profitRate = processDecimalPoint(rate);
  return profitRate;
};
const handleWinningCheck = (purchaseAmount, lottoPack) => {
  const winning_numbers = DomSelector.winningNumbers;
  const bonus_number = DomSelector.bonusNumber;
  const statistics_rows = DomSelector.statisticsRows;
  const profit_rate = DomSelector.profitRate;
  const lotto_result_modal = DomSelector.lottoResultModal;
  const error_modal = DomSelector.errorModal;
  try {
    const { winningNumbersInput, bonusNumberInput } = getAnswerLottoInput(winning_numbers, bonus_number);
    const { winningNumbers, bonusNumber } = parseAndValidatAnswerLotto(winningNumbersInput, bonusNumberInput);
    const answerLotto = generateAnswerLotto(winningNumbers, bonusNumber);
    const winningResult = lottoPack.compareAndReturnResult(answerLotto);
    const profitRate = profitCalculator(purchaseAmount, winningResult);
    WebView.updateStatistics(statistics_rows, winningResult);
    WebView.updateProfitRate(profit_rate, profitRate);
    DomUpdator.showModal(lotto_result_modal, true);
  } catch (error) {
    DomUpdator.content(error_modal, error);
    DomUpdator.showModal(error_modal, true);
  }
};
const getAnswerLottoInput = (winning_numbers, bonus_number) => {
  const winningNumbersInput = [];
  winning_numbers.forEach((element) => {
    winningNumbersInput.push(element.value);
  });
  const bonusNumberInput = bonus_number.value;
  return { winningNumbersInput, bonusNumberInput };
};
const parseAndValidatAnswerLotto = (winningNumbersInput, bonusNumberInput) => {
  const winningNumbers = parseAndValidateWinningNumbers(winningNumbersInput.join(LOTTO_NUMBER_SPLITER$1));
  const parseAndValidateBonusNumberFunc = parseAndValidateBonusNumber(winningNumbers);
  const bonusNumber = parseAndValidateBonusNumberFunc(bonusNumberInput);
  return { winningNumbers, bonusNumber };
};
const startLottoGame = () => {
  const purchase_button = DomSelector.purchaseButton;
  const purchase_amount = DomSelector.purchaseAmount;
  const reuslt_button = DomSelector.reusltButton;
  const lotto_result_modal = DomSelector.lottoResultModal;
  const restart_button = DomSelector.restartButton;
  const error_modal = DomSelector.errorModal;
  purchase_amount.addEventListener("keydown", (event) => {
    if (event.key === "Enter") {
      purchase_button.click();
    }
  });
  purchase_button.addEventListener("click", () => {
    const { purchaseAmount, lottoPack } = handlePurchase();
    reuslt_button.addEventListener("click", () => handleWinningCheck(purchaseAmount, lottoPack));
  });
  lotto_result_modal.addEventListener("click", (event) => {
    if (event.target === event.currentTarget) DomUpdator.showModal(lotto_result_modal, false);
  });
  error_modal.addEventListener("click", (event) => {
    if (event.target === event.currentTarget) DomUpdator.showModal(error_modal, false);
  });
  restart_button.addEventListener("click", () => handleRestart());
};
startLottoGame();
