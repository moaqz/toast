import { toast } from "./lib/main";

document.querySelector("#app").innerHTML = `
  <button id="toast-btn" type="button">Render a toast</button>
  <moaqz-toaster></moaqz-toaster>
`;

document.querySelector("#toast-btn").addEventListener("click", () => {
  toast.success({
    title: "Success! Everything went smoothly.",
    description: "Your request was successful!"
  });
});
