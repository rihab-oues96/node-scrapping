import { Browser } from "puppeteer";
import { Data } from "./types";
const createCsvWriter = require("csv-writer").createObjectCsvWriter;
const puppeteer = require("puppeteer");

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
    args: ["--disable-infobars"],
    //  ignoreDefaultArgs: ["--enable-automation"],
  });

  const page = await browser.newPage();

  await page.goto(url);

  await page.click(".cookies_info-pop-buttons-accept");

  await page.click("#onglets > li:nth-child(1) > a");

  await page.waitForSelector(".dis_content_img .display_product3 > a");

  const productRef = await page.$eval(
    "#products_info_refspartoo",
    (el) => el.textContent
  );
  const productName = await page.$eval(".seo_hn_tag", (el) => el.textContent);
  const brandName = "ALDO";
  const size = await page.$eval(".size_name", (el) => el.textContent);
  const color = await page.$eval(
    "[itemprop=color] meta",
    (el) => el.textContent
  );
  const image = await page.$$("productView a > .thumbnail");
  const mainCategory = await page.$eval(
    "#parent > div:nth-child(1) > span",
    (el) => el.textContent
  );
  const subCategory = "";
  const resumLong = "";
  const resumCourt = "";
  const description = await page.$$("#products_info_composition > li");
  const price = await page.$eval(
    ".productlist_prix span",
    (el) => el.textContent
  );

  let scrapedData: Data[] = [];

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

  csvWriter.writeRecords(scrapedData);

  await browser.close();
};

main();
