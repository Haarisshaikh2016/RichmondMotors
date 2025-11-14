// main.js - theme toggle + nav active + footer year
const htmlEl=document.documentElement;
const themeToggleBtns=document.querySelectorAll("[data-theme-toggle]");
const savedTheme=localStorage.getItem("rm-theme");
if(savedTheme==="dark"){htmlEl.setAttribute("data-theme","dark");}
else{htmlEl.setAttribute("data-theme","light");}
function updateThemeButtonText(){
  const isDark=htmlEl.getAttribute("data-theme")==="dark";
  themeToggleBtns.forEach(btn=>{btn.textContent=isDark?"Dark Mode":"Light Mode";});
}
updateThemeButtonText();
themeToggleBtns.forEach(btn=>{
  btn.addEventListener("click",()=>{
    const current=htmlEl.getAttribute("data-theme");
    const next=current==="dark"?"light":"dark";
    htmlEl.setAttribute("data-theme",next);
    localStorage.setItem("rm-theme",next);
    updateThemeButtonText();
  });
});
const currentPage=document.body.dataset.page;
document.querySelectorAll(".nav-link[data-page-name]").forEach(link=>{
  if(link.getAttribute("data-page-name")===currentPage){
    link.classList.add("nav-link--active");
  }
});
const yearSpan=document.getElementById("yearSpan");
if(yearSpan){yearSpan.textContent=new Date().getFullYear();}
