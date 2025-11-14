// community.js - public community + localStorage
const COMMUNITY_STORAGE_KEY="rm_community_messages";
function cmLoad(){
  try{const raw=localStorage.getItem(COMMUNITY_STORAGE_KEY);return raw?JSON.parse(raw):[];}
  catch{return [];}
}
function cmSave(list){localStorage.setItem(COMMUNITY_STORAGE_KEY,JSON.stringify(list));}

(function(){
 const form=document.getElementById("communityForm");
 const publicList=document.getElementById("publicMessages");
 if(!form||!publicList)return;

 function renderPublic(){
  const msgs=cmLoad().filter(m=>!!m.answer);
  publicList.innerHTML="";
  if(msgs.length===0){
   publicList.innerHTML="<li class='message-card text-muted'>No answered community questions yet (placeholders).</li>";
   return;
  }
  msgs.forEach(m=>{
   const li=document.createElement("li");
   li.className="message-card";
   li.innerHTML=`
    <strong>${m.name}</strong>${m.email?` <span class="text-muted"> • ${m.email}</span>`:""}
    <p><em>Q:</em> ${m.message}</p>
    <p><em>Richmond Motors (placeholder):</em> ${m.answer}</p>`;
   publicList.appendChild(li);
  });
 }

 renderPublic();

 form.addEventListener("submit",e=>{
  e.preventDefault();
  const name=document.getElementById("communityName").value.trim();
  const email=document.getElementById("communityEmail").value.trim();
  const message=document.getElementById("communityMessage").value.trim();
  if(!name||!message){alert("Please fill in the name and message placeholders.");return;}
  const msgs=cmLoad();
  msgs.unshift({id:Date.now().toString(),name,email,message,answer:null});
  cmSave(msgs);
  form.reset();
  alert("Your placeholder message has been sent to the admin queue.");
 });
})();
