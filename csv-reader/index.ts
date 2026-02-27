import fs from "fs";
import path from "path";
import csv from "csv-parser";
import { stringify } from "csv-stringify";

const inputFilePath = path.join(__dirname, "postgres03052059-2100.log"); // 입력 CSV 파일 경로
const outputFilePath = path.join(__dirname, "filteredOutPut03052059-2100.log"); // 출력 CSV 파일 경로
const filterKeywords = [
  "remaining connection",
  "connection authenticated",
  "connection authorized",
  "current transaction is aborted",
  "sorry, too many clients already",
];

async function filterCSV(
  inputPath: string,
  outputPath: string,
  keywords: string[]
) {
  const results: any[] = [];
  console.log(inputFilePath);
  console.log(outputFilePath);
  return new Promise<void>((resolve, reject) => {
    fs.createReadStream(inputPath)
      .pipe(csv())
      .on("data", (row) => {
        const rowString = Object.values(row).join(" ");
        for (let i = 0; i < keywords.length; i++) {
          if (rowString.includes(keywords[i])) {
            return;
          }
        }
        results.push(row);
      })
      .on("end", () => {
        const writableStream = fs.createWriteStream(outputPath);
        const stringifier = stringify({ header: true });

        stringifier.pipe(writableStream);
        results.forEach((row) => stringifier.write(row));
        stringifier.end();

        console.log(`Filtered CSV saved to ${outputPath}`);
        resolve();
      })
      .on("error", (err) => reject(err));
  });
}

filterCSV(inputFilePath, outputFilePath, filterKeywords).catch((err) =>
  console.error("Error processing CSV:", err)
);
