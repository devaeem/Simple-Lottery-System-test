/*Create Basic Lotto Service following this requirement

This Basic Lotto Service implements a simple lottery system where users can buy lotto tickets and win based on the drawn result. The lotto service allows users to select the number of digits (from 1 to 6 digits) they wish to bet on, and the system calculates the winnings based on how many digits match the last digits of the randomly drawn 6-digit result. The service should support the purchase of multiple tickets with different numbers and amounts, and users can choose to buy random numbers based on their selected digit length. Additionally, users can specify fixed digits for specific positions in the generated random numbers. The system should also allow users to set the draw result, check winning tickets, and return the corresponding prize based on matching digits.


given:
- customer can choose to buy ticket that contain many number with different digit example: 123456 for 1000baht, 124 for 500baht
- lotto has 6 digits
- lotto result will draw 1 time which each digit payout is from the last digit example the draw of lotto result is 123456 the prize of 3 digit is 456
- ticket payout base on digit
 1 digit = 10 times of bet example customer buy number 6 for 100 baht and the result is 123456 then the prize is 1000 baht
 2 digit = 100 times of bet example customer buy number 56 for 100 baht and the result is 123456 then the prize is 10000 baht
 3 digit = 1000 times of bet example customer buy number 456 for 100 baht and the result is 123456 then the prize is 100000 baht
 4 digit = 10000 times of bet example customer buy number 3456 for 100 baht and the result is 123456 then the prize is 1000000 baht
 5 digit = 100000 times of bet example customer buy number 23456 for 100 baht and the result is 123456 then the prize is 10000000 baht
 6 digit = 1000000 times of bet example customer buy number 123456 for 100 baht and the result is 123456 then the prize is 100000000 baht


key features:
- buy ticket: buy lotto by input number and amount of money and add to customer ticket
- get ticket: get all ticket that customer buy
- get random number: select digit that want to buy from 1-6 digits, how many numbers to buy, how much money for each number, and optional customer can select fixed number of digit (example: 5 digits, 10 number, 1000 baht and 4th digit is 5 and 5th digit is 6 then output must be random 10 number that last 2 digit is 56)
- set draw: set payout randomly one munber and used for the current draw result
- check win ticket: check winning prize by input all ticket that customer buy and return which number is win and prize
*/

// Ticketr interfaces
interface Ticket {
  number: number;
  amount: number;
}

// FixedDigit interfaces
interface FixedDigit {
  digit: number;
  number: number;
}

//Example data
const buyTicketData: Ticket[] = [
  {
    number: 123456,
    amount: 100,
  },
  {
    number: 58,
    amount: 100,
  },
];

//Example data for buy random number
const buyDigit = 4;
const buyNumber = 10;
const buyAmount = 1000;
const fixedDigit: FixedDigit[] = [
  {
    digit: 3,
    number: 8,
  },
  {
    digit: 2,
    number: 6,
  },
];
// mean that customer want to buy 4 digits, 10 number, each 1000 baht,fxied third digit is 8 and fixed second digit is 6

// WinningTicket interfaces
interface WinningTicket {
  number: number;
  prize: number;
  digits: number;
}

interface Discount {
  number: number;
  amount: number;
}

// LottoService class
class LottoService {
  private customerTickets: Ticket[] = [];
  private drawResult: string | null = null;

  private readonly PAYOUT_MULTIPLIERS = {
    1: 10, // 1 หลัก จ่าย 10 เท่า
    2: 100, // 2 หลัก จ่าย 100 เท่า
    3: 1000, // 3 หลัก จ่าย 1,000 เท่า
    4: 10000, // 4 หลัก จ่าย 10,000 เท่า
    5: 100000, // 5 หลัก จ่าย 100,000 เท่า
    6: 1000000, // 6 หลัก จ่าย 1,000,000 เท่า
  } as const;

  /**
   * ซื้อหวย - สามารถซื้อได้หลายเลข หลายหลัก พร้อมระบุจำนวนเงิน
   */
  public buyTicket(tickets: Ticket[]): void {
    tickets.forEach((ticket) => {
      // ตรวจสอบความถูกต้องของตัวเลข
      if (!this.isValidNumber(ticket.number)) {
        throw new Error(`เลขหวยไม่ถูกต้อง: ${ticket.number}`);
      }
      // ตรวจสอบจำนวนเงิน
      if (ticket.amount <= 0) {
        throw new Error(`จำนวนเงินต้องมากกว่า 0: ${ticket.amount}`);
      }
      this.customerTickets.push(ticket);
    });
    console.log(`ซื้อหวยเรียบร้อย:`, tickets);
  }

  /**
   * ดูรายการหวยที่ซื้อทั้งหมด
   */
  public getTickets(): Ticket[] {
    return [...this.customerTickets];
  }

  /**
   * สุ่มเลขหวยตามเงื่อนไขที่กำหนด
   */
  public getRandomNumber(
    digitCount: number,
    quantity: number,
    amount: number,
    fixedDigits: FixedDigit[] = []
  ): number[] {
    // ตรวจสอบความถูกต้องของข้อมูล
    if (digitCount < 1 || digitCount > 6) {
      throw new Error("จำนวนหลักต้องอยู่ระหว่าง 1-6");
    }
    if (quantity <= 0) {
      throw new Error("จำนวนเลขที่ต้องการต้องมากกว่า 0");
    }
    if (amount <= 0) {
      throw new Error("จำนวนเงินต้องมากกว่า 0");
    }

    const randomNumbers: number[] = [];
    const maxAttempts = quantity * 10;
    let attempts = 0;

    while (randomNumbers.length < quantity && attempts < maxAttempts) {
      attempts++;
      let randomNum = this.generateRandomNumber(digitCount);
      let numStr = randomNum.toString().padStart(digitCount, "0");

      // ใส่เลขที่กำหนดตามตำแหน่ง
      fixedDigits.forEach((fixed) => {
        if (fixed.digit <= digitCount) {
          const position = digitCount - fixed.digit;
          numStr =
            numStr.substring(0, position) +
            fixed.number +
            numStr.substring(position + 1);
        }
      });

      randomNum = parseInt(numStr);

      // เช็คว่าไม่ซ้ำกับเลขที่มีอยู่แล้ว
      if (!randomNumbers.includes(randomNum)) {
        randomNumbers.push(randomNum);
        this.customerTickets.push({ number: randomNum, amount });
      }
    }

    if (randomNumbers.length < quantity) {
      throw new Error("ไม่สามารถสุ่มเลขได้ครบตามจำนวนที่ต้องการ");
    }

    return randomNumbers;
  }

  /**
   * ออกผลรางวัล
   */
  public setDraw(): string {
    if (this.drawResult) {
      throw new Error("ได้ออกผลรางวัลไปแล้ว");
    }
    //this.generateRandomNumber(6).toString().padStart(6, '0');
    this.drawResult = "56";
    // this.drawResult = this.generateRandomNumber(6).toString().padStart(6,'0');
    return this.drawResult;
  }

  /**
   * ตรวจรางวัล
   */
  public checkWinTicket(): WinningTicket[] {
    if (!this.drawResult) {
      throw new Error("ยังไม่ได้ออกผลรางวัล");
    }

    if (this.customerTickets.length === 0) {
      throw new Error("ไม่มีรายการซื้อหวย กรุณาซื้อหวยก่อนตรวจรางวัล");
    }

    const winners: WinningTicket[] = [];

    this.customerTickets.forEach((ticket) => {
      const ticketNumber = ticket.number.toString();
      const ticketDigits = ticketNumber.length;

      // ตรวจทุกความยาวที่เป็นไปได้จากเลขที่ซื้อ
      for (let checkDigits = 1; checkDigits <= ticketDigits; checkDigits++) {
        const lastDigitsOfDraw = this.drawResult!.slice(-checkDigits);
        const lastDigitsOfTicket = ticketNumber.slice(-checkDigits);

        if (lastDigitsOfTicket === lastDigitsOfDraw) {
          const prize =
            ticket.amount *
            this.PAYOUT_MULTIPLIERS[
              checkDigits as keyof typeof this.PAYOUT_MULTIPLIERS
            ];
          winners.push({
            number: ticket.number,
            prize,
            digits: checkDigits,
          });
        }
      }
    });

    this.displayResults(winners);
    return winners;
  }     

  // ฟังก์ชันนี้ใช้สำหรับการสุ่มตัวเลขตามจำนวนหลักที่ระบุ
  private generateRandomNumber(digits: number): number {
    return Math.floor(Math.random() * Math.pow(10, digits));
  }

  //ฟังก์ชันนี้ใช้ตรวจสอบความถูกต้องของเลขว่าเป็นจำนวนเต็มและอยู่ในช่วงที่กำหนด
  private isValidNumber(number: number): boolean {
    return Number.isInteger(number) && number >= 0 && number < 1000000;
  }

  private displayResults(winners: WinningTicket[]): void {
    if (this.customerTickets.length === 0) {
      console.log("\nไม่มีรายการซื้อหวย กรุณาซื้อหวยก่อนตรวจรางวัล");
      return;
    }

    console.log(`\nผลการออกรางวัล: ${this.drawResult}`);
    console.log(`จำนวนตั๋วที่ซื้อทั้งหมด: ${this.customerTickets.length} ใบ`);

    if (winners.length === 0) {
      console.log("ไม่มีผู้ถูกรางวัลในงวดนี้");
      return;
    }

    // จัดกลุ่มตามจำนวนหลัก
    const winsByDigits: { [key: number]: WinningTicket[] } = {};
    let totalPrize = 0;

    winners.forEach((winner) => {
      if (!winsByDigits[winner.digits]) {
        winsByDigits[winner.digits] = [];
      }
      winsByDigits[winner.digits].push(winner);
      totalPrize += winner.prize;
    });

    console.log("\nสรุปผลการถูกรางวัล:");
    console.log(`จำนวนถูกรางวัลทั้งหมด: ${winners.length} รางวัล`);

    // แสดงผลแยกตามจำนวนหลัก
    Object.keys(winsByDigits)
      .sort((a, b) => Number(b) - Number(a)) // เรียงจากหลักมากไปน้อย
      .forEach((digits) => {
        const digitWinners = winsByDigits[Number(digits)];
        console.log(
          `\nถูกรางวัลเลข ${digits} หลัก: ${digitWinners.length} รางวัล`
        );
        digitWinners.forEach((winner) => {
          console.log(
            `  - เลข ${
              winner.number
            } ได้รับเงิน ${winner.prize.toLocaleString()} บาท`
          );
        });
      });

    console.log(`\nรวมเงินรางวัลทั้งหมด: ${totalPrize.toLocaleString()} บาท`);
  }

  public discount(tickets: Discount[]): Discount[] {
    return tickets
      .filter((ticket) => {
        const hasDiscount = ticket.number.toString().length >= 5;
        if (!hasDiscount) {
          console.log(`เลข ${ticket.number} ไม่ได้รับส่วนลด`);
        }
        return hasDiscount;
      })
      .map((ticket) => ({
        ...ticket,
        amount: ticket.amount * 0.9, // Apply 10% discount
      }));
  }
}

// ตัวอย่างการใช้งาน
const demo = () => {
  const lotto = new LottoService();

  // 1. ซื้อหวยแบบระบุเลข
  console.log("\n1. ซื้อหวยแบบระบุเลข:");
  // lotto.buyTicket(buyTicketData);
  lotto.buyTicket([
    // { number: 123456, amount: 100 },  // 6 หลัก
    // { number: 456, amount: 100 },     // 3 หลัก
    { number: 12333, amount: 100 }, // 2 หลัก
  ]);
  // lotto.buyTicket(buyTicketData)

  // 2. ซื้อหวยแบบสุ่มเลข
  console.log("\n2. ซื้อหวยแบบสุ่มเลข:");
  const randomNumbers = lotto.getRandomNumber(
    4, // จำนวนหลัก
    3, // จำนวนชุด
    100, // จำนวนเงิน
    [
      // กำหนดเลขตายตัว
      { digit: 2, number: 1 }, // หลักที่ 2 เป็น 5
      { digit: 1, number: 1 }, // หลักที่ 1 เป็น 6
    ]
  );
  console.log("เลขที่สุ่มได้:", randomNumbers);

  // 3. ดูรายการหวยที่ซื้อทั้งหมด
  console.log("\n3. รายการหวยที่ซื้อทั้งหมด:");
  console.log(lotto.getTickets());

  //3.1 ส่วนลด
  const getTic = lotto.getTickets();
  const disc = lotto.discount(getTic);
  console.log("\n3.1 .ส่วนลดพิเศษ:", disc);

  // 4. ออกผลรางวัล
  console.log("\n4. ผลการออกรางวัล:");
  const drawResult = lotto.setDraw();
  console.log("เลขที่ออก:", drawResult);

  // 5. ตรวจรางวัล
  console.log("\n5. ตรวจรางวัล:");
  const winners = lotto.checkWinTicket();
};

// รันตัวอย่าง
demo();
