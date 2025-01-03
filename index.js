import fs from 'fs';
import path, { format } from 'path';
import readline from 'readline';
import os from 'os';

const motivationalMessages = [
  "Believe in yourself; you are capable of amazing things!",
  "Every small step you take brings you closer to your dreams.",
  "Hard work beats talent when talent doesn’t work hard.",
  "Your effort today will pay off tomorrow.",
  "Stay focused, stay positive, and keep pushing forward!",
  "Mistakes are proof that you are trying; learn and grow from them.",
  "You have the power to create your own success story!",
  "Progress is progress, no matter how small.",
  "Keep going; you're doing better than you think!",
  "Success is not final; failure is not fatal. Keep moving!"
];

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

const getPiDigits = (n) => {
  const piDigits = fs.readFileSync(
    path.join(process.cwd(), 'pi-digits.txt'),
    'utf8'
  );
  return piDigits.slice(0, n);
};

const getMotivationalMessage = () => {
  const randomIndex = Math.floor(Math.random() * motivationalMessages.length);
  return motivationalMessages[randomIndex];
}

const formatLine = (line, chunkSize) => {
  const output = [];
  for (let i = 0; i < line.length; i += chunkSize) {
    output.push(line.slice(i, i + chunkSize));
  }
  return output.join(' ');
};

const formatPiDigits = ({ n, groupSize, lineSize }) => {
  const output = [];
  const piDigits = getPiDigits(n + 2);
  const decimalValuesInPi = piDigits.slice(2);
  output.push(piDigits.slice(0, 2));
  const numberOfLines = n / lineSize;

  for (let lineIndex = 0; lineIndex < numberOfLines; lineIndex++) {
    const startIndex = lineIndex * lineSize;
    const endIndex = startIndex + lineSize;
    const line = decimalValuesInPi.slice(startIndex, endIndex);
    output.push(formatLine(line, 5));
    if (endIndex % groupSize === 0) {
      output.push(os.EOL);
      output.push(os.EOL);
      output.push(getMotivationalMessage());
      output.push(os.EOL);
      output.push(os.EOL);
    } else {
      output.push(os.EOL);
    }
  }
  return output;
};

const validateInputs = ({ n, groupSize, lineSize }) => {
  if (n <= 0) {
    throw new Error('n must be greater than 0');
  }
  if (groupSize <= 0) {
    throw new Error('groupSize must be greater than 0');
  }
  if (lineSize <= 0) {
    throw new Error('lineSize must be greater than 0');
  }
  if(n < groupSize) {
    throw new Error('n must be greater than groupSize');
  }
  if(n < lineSize) {
    throw new Error('n must be greater than lineSize');
  }
  if(groupSize < lineSize) {
    throw new Error('groupSize must be greater than lineSize');
  }
  if (n % groupSize !== 0) {
    throw new Error('number of digits must be divisible by groupSize');
  }
  if (n % lineSize !== 0) {
    throw new Error('number of digits must be divisible by lineSize');
  }
  if (groupSize % lineSize !== 0) {
    throw new Error('groupSize must be divisible by lineSize');
  }
};

rl.question('Enter the number of digits of pi you want to print: ', (n) => {
  rl.question('How many digits of pi per group? ', (groupSize) => {
    rl.question('How many digits of pi per line? ', (lineSize) => {
      try {
        validateInputs({ n: parseInt(n), groupSize: parseInt(groupSize), lineSize: parseInt(lineSize) });
      } catch (error) {
        console.error(error.message);
        rl.close();
        return;
      }
      const output = formatPiDigits({
        n: parseInt(n),
        groupSize: parseInt(groupSize),
        lineSize: parseInt(lineSize),
      });
      console.log(output.join(''));

      rl.close();
    });
  });
});
