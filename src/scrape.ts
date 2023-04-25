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
    headless: false,
    defaultViewport: false,
  });

  const page = await browser.newPage();
  await page.goto(url);

  await page.click(".cookies_info-pop-buttons-accept");

  await page.click("#onglets > li:nth-child(1) > a");

  await page.waitForSelector(".dis_content_img display_product3 > a");

  const scrapedData: Data[] = [];

  // const scrapeCurrentPage = async () => {
  //   try {
  //     await page.waitForSelector(".productsList");

  //     let urls = await page.evaluate(".global_products", (links: any) => {
  //       links.map((link: any) => link.querySelector().href);
  //       return links;
  //     });

  //     let getPagaData = async (link: string) => {
  //       let data = {
  //         productRef: null,
  //         productName: "",
  //         brandName: "Aldo",
  //         size: [],
  //         color: [],
  //         image: [],
  //         mainCategory: "",
  //         subCategory: "",
  //         resumLong: "",
  //         resumCourt: "",
  //         description: "",
  //         price: null,
  //       };
  //       let newPage = await browser.newPage();
  //       await newPage.goto(link);

  //       const ref = await newPage.waitForSelector("#products_info_refspartoo");
  //       const productRef = await ref?.evaluate((el) => el.textContent);

  //       console.log("productRef", productRef);

  //       return data;
  //     };
  //   } catch (error) {
  //     console.log(error);
  //   }
  // };

  // const productData = await page.evaluate(() => {
  //   const products = Array.from(document.querySelectorAll(".productsList"));

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

  //   // page.click(".dis_content_img_product");

  //   // for (const product of products) {
  //   //   let productRef = "";
  //   //   let productName = "";
  //   //   let brandName = "Aldo";
  //   //   let size = [];
  //   //   let color = [];
  //   //   let image = [];
  //   //   let mainCategory = "";
  //   //   let subCategory = "";
  //   //   let resumLong = "";
  //   //   let resumCourt = "";
  //   //   let description = "";
  //   //   let price: null;

  //   //   try {
  //   //     productRef = await page.evaluate(
  //   //       (el: any) =>
  //   //         el.querySelector("#products_info_refspartoo").textContent,
  //   //       product
  //   //     );
  //   //   } catch (error) {}
  //   // }
  // });
  // console.log(productData);

  //let data = await scrapeCurrentPage();

  csvWriter.writeRecords(scrapedData);

  await browser.close();
};

main();
