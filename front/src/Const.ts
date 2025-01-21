export const ERROR_MESSAGES = {
  mailaddress_1: "MailAddress is required.",
  mailaddress_2:
    "MailAddress must be 4-16 characters, alphanumeric, and may include underscores. Cannot be all numbers.",
  password_1: "Password is required.",
  password_2:
    "Password must be 8 to 16 characters long and contain at least two of the following: uppercase letters, lowercase letters, numbers, or special characters (!@#$%^&*).",
  confirmPassword_1: "ConfirmPassword is required.",
  confirmPassword_2: "Passwords do not match.",
};

export const brewingMethodLabels: { [key: number]: string } = {
  1: "Hand Drip",
  2: "French Press",
  3: "Moka Pot",
};

export const roastLevelLabels: { [key: number]: string } = {
  1: "Light Roast",
  2: "Medium Roast",
  3: "Dark Roast",
  4: "Espresso Roast",
  5: "French Roast",
};

export const grindSizeLabels: { [key: number]: string } = {
  1: "Fine Grind", // 細挽き
  2: "Medium-Fine Grind", // 中細挽き
  3: "Medium Grind", // 中挽き
  4: "Medium-Coarse Grind", // 中粗挽き
  5: "Coarse Grind", // 粗挽き
};
