import { includeHTML } from "./include-html.js";
import { main } from "./main.js";

includeHTML().then(async () => {
  main();
});
