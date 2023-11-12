import { includeHTML } from "./include-html.js";
import { animate } from "./animate.js";

includeHTML().then(async () => {
  animate();
});
