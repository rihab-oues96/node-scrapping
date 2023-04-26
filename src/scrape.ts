import { Browser } from "puppeteer";
import { Data } from "./types";
const createCsvWriter = require("csv-writer").createObjectCsvWriter;
const puppeteer = require("puppeteer");
//const fs = require("fs");

const url = "https://www.aldoshoes.fr";

const csvWriter = createCsvWriter({
  path: "output.csv",
  header: [
    { id: "productRef", title: "Product Ref" },
    { id: "productName", title: "Product Name" },
    { id: "brandName", title: "Brand Name" },
    { id: "size", title: "Size" },
    { id: "color", title: "Color" },
    { id: "image", title: "Image" },
    { id: "mainCategory", title: "Main Category" },
    { id: "subCategory", title: "Sub Category" },
    { id: "resumLong", title: "Resum Long" },
    { id: "resumCourt", title: "Resum Court" },
    { id: "description", title: "Description" },
    { id: "price", title: "Price" },
  ],
});

const main = async () => {
  const browser: Browser = await puppeteer.launch({
    headless: true,
    defaultViewport: false,
    ignoreDefaultArgs: ["--enable-automation"],
  });

  const page = await browser.newPage();

  await page.goto(url);

  await page.click(".cookies_info-pop-buttons-accept");

  const newArticles = await page.waitForSelector(
    "#homeContent > div.home_opNewCo > picture > img"
  );
  await newArticles?.evaluate((el) => el.click());

  // const products = await page.$$(".dis_zoomInfo");
  // console.log(products.length);

  const elm = await page.waitForSelector(".dis_zoomInfo > a > img");
  await elm?.evaluate((el) => el.click());

  const ref = await page.waitForSelector("#products_info_refspartoo");
  const productRef = await ref?.evaluate((el) => el.textContent);
  console.log("ref type : ", typeof productRef);

  const productName = await page.$eval(".seo_hn_tag", (el) => el.textContent);

  const brandName = "ALDO";

  const size = await page.$eval(".size_name", (el) => el.textContent);

  const color = await page.$eval(
    "#prodcard2 > div:nth-child(1) > div.prodcardBase > div:nth-child(1) > div > span:nth-child(3)",
    (el) => el.textContent
  );

  const image = await page.$$("productView a > .thumbnail");
  image.join(",");

  // let counter = 0;
  // page.on("response", async (response) => {
  //   const matches = /.*\.(jpg|png|svg|gif)$/.exec(response.url());
  //   console.log(matches);
  //   if (matches && matches.length === 2) {
  //     const extension = matches[1];
  //     const buffer = await response.buffer();
  //     fs.writeFileSync(
  //       `./images/image-${counter}.${extension}`,
  //       buffer,
  //       "base64"
  //     );
  //     counter += 1;
  //   }
  // });

  const mainCategory = await page.$eval(
    "#parent > div:nth-child(1) > span",
    (el) => el.textContent
  );

  const subCategory = "";

  const resumL = await page.waitForSelector("#products_info_composition > li");
  const resumLong = await resumL?.evaluate((el) => el.textContent);

  const resumC = await page.waitForSelector("#products_info_composition > li");
  const resumCourt = await resumC?.evaluate((el) => el.textContent);

  const desc = await page.waitForSelector("#products_info_composition > li");
  const description = await desc?.evaluate((el) => el.textContent);

  const price = await page.$eval(
    "#display_price_size_id1 > span > span > span",
    (el) => el.textContent
  );

  await page.click("#filArianeProdcard > #prodcard_return");

  console.log(
    "productRef :",
    productRef,
    "productName :",
    productName,
    "brandName :",
    brandName,
    "size :",
    size,
    "color :",
    color,
    "image :",
    image,
    "mainCategory : ",
    mainCategory,
    "subCategory : ",
    subCategory,
    "resumLong : ",
    resumLong,
    "resumCourt :",
    resumCourt,
    "description :",
    description,
    "price:",
    price
  );

  let scrapedData: Data[] = [];

  scrapedData.push({
    productRef: productRef!,
    productName: productName!,
    brandName,
    size: size!,
    color: color!,
    //image: image,
    mainCategory: mainCategory!,
    subCategory: subCategory,
    resumLong: resumLong!,
    resumCourt: resumCourt!,
    description: description!,
    price: price!,
  });

  // pagination
  let nextButtonExist = false;
  try {
    const nextButton = await page.$eval(
      ".bordure > span",
      (el) => el.textContent
    );
    nextButtonExist = true;
  } catch (err) {
    nextButtonExist = false;
  }
  if (nextButtonExist) {
    await page.click(".bordure > span");
    // return scrape();
  }

  // const productData = await page.evaluate(() => {
  //   const products = Array.from(document.querySelector(".productsList"));

  //   const data = products.map((product: any) => ({
  //     productRef: "",
  //     productName: product.querySelector(".productlist_name")?.textContent,
  //     brandName: "Aldo",
  //     size: [],
  //     color: "",
  //     image: "",
  //     mainCategory: "",
  //     subCategory: "",
  //     resumLong: "",
  //     resumCourt: "",
  //     description: "",
  //     price: product.querySelector(".productlist_prix span")?.textContent,
  //   }));
  //   return data;

  // console.log(productData);

  console.log("scrapedData", scrapedData);

  csvWriter.writeRecords(scrapedData);

  //await browser.close();
};

main();
