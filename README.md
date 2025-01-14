# Brief Description

This Basic Lotto Service implements a simple lottery system where users can buy lotto tickets and win based on the drawn result. The lotto service allows users to select the number of digits (from 1 to 6 digits) they wish to bet on, and the system calculates the winnings based on how many digits match the last digits of the randomly drawn 6-digit result. The service should support the purchase of multiple tickets with different numbers and amounts, and users can choose to buy random numbers based on their selected digit length. Additionally, users can specify fixed digits for specific positions in the generated random numbers. The system should also allow users to set the draw result, check winning tickets, and return the corresponding prize based on matching digits.

**Given:**

- customer can choose to buy ticket that contain many number with different digit example: 123456 for 1000baht, 124 for 500baht
- lotto has 6 digits
- lotto result will draw 1 time which each digit payout is from the last digit example the draw of lotto result is 123456 the prize of 3 digit is 456

**Ticket Payout Calculation:**

- 1 digit = 10 times of bet example customer buy number 6 for 100 baht and the result is 123456 then the prize is 1000 baht
- 2 digit = 100 times of bet example customer buy number 56 for 100 baht and the result is 123456 then the prize is 10000 baht
- 3 digit = 1000 times of bet example customer buy number 456 for 100 baht and the result is 123456 then the prize is 100000 baht
- 4 digit = 10000 times of bet example customer buy number 3456 for 100 baht and the result is 123456 then the prize is 1000000 baht
- 5 digit = 100000 times of bet example customer buy number 23456 for 100 baht and the result is 123456 then the prize is 10000000 baht
- 6 digit = 1000000 times of bet example customer buy number 123456 for 100 baht and the result is 123456 then the prize is 100000000 baht

**Key Features:**

- buy ticket: buy lotto by input number and amount of money
- get ticket: get all ticket that customer buy
- get random number: select digit that want to buy from 1-6 digits, how many numbers to buy, how much money for each number, and optional customer can select fixed number of digit (example: 5 digits, 10 number, 1000 baht and 4th digit is 5 and 5th digit is 6 then output must be random 10 number that last 2 digit is 56)
- set draw: set payout randomly one munber and used for the current draw result
- check win ticket: check winning prize by input all ticket that customer buy and return which number is win and prize

## Get started

1. Install dependencies

   ```bash
   pnpm install
   ```

2. Start the app

   ```bash
   pnpx run dev
   ```

# Score Criteria

To evaluate the implementation of the Lotto Service, the following **score criteria** will be used. The total score is **100 points**.

| **Criteria**                          | **Max Points** | **Description**                                                                                                                                                                                                                                     |
| ------------------------------------- | -------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **Correctness**                       | 35             | Does the service meet the main requirements (buying tickets, generating numbers, checking wins, etc.)? This includes supporting multiple digit lengths (1-6 digits), managing multiple tickets, and correctly implementing prize calculation logic. |
| **Prize Calculation**                 | 20             | The prize calculation logic is correctly implemented based on the ticket's digits and how they match the drawn result.                                                                                                                              |
| **Input Validation & Error Handling** | 15             | Proper validation for ticket number lengths, bet amounts, and draw results. Proper handling of invalid inputs or errors.                                                                                                                            |
| **Performance**                       | 10             | The service should be able to handle the expected volume of data (e.g., multiple tickets or large draw sets) efficiently, without noticeable delays or issues.                                                                                      |
| **Code Structure & Cleanliness**      | 20             | Code is well-structured, readable, and follows best practices for maintainability (e.g., modularity, naming conventions, etc.).                                                                                                                     |
