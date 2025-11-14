// admin.js - login + dashboard (placeholder)

// login data
const ADMIN_ALLOWED=[
 "haaris@richmondmotors.co.uk",
 "haider@richmondmotors.co.uk",
 "shakeel@richmondmotors.co.uk",
 "shaista@richmondmotors.co.uk"
];
const ADMIN_PASSWORD="1234";
const ADMIN_SESSION_KEY="rm_admin_logged_in";

function setAdminSession(email){
 if(email){localStorage.setItem(ADMIN_SESSION_KEY,email);}
 else{localStorage.removeItem(ADMIN_SESSION_KEY);}
}
function getAdminSession(){return localStorage.getItem(ADMIN_SESSION_KEY);}

// login page
(function(){
 const form=document.getElementById("adminLoginForm");
 const msg=document.getElementById("adminLoginMessage");
 if(!form)return;
 form.addEventListener("submit",e=>{
  e.preventDefault();
  const email=document.getElementById("adminEmail").value.trim().toLowerCase();
  const pass=document.getElementById("adminPassword").value.trim();
  if(!ADMIN_ALLOWED.includes(email)){
    msg.textContent="Admin email placeholder not recognised.";
    return;
  }
  if(pass!==ADMIN_PASSWORD){
    msg.textContent="Incorrect placeholder password.";
    return;
  }
  setAdminSession(email);
  msg.textContent="Login successful (placeholder). Redirecting...";
  setTimeout(()=>{window.location.href="admin-dashboard.html";},700);
 });
})();

// dashboard page
const ADMIN_COMMUNITY_KEY="rm_community_messages";
const ADMIN_VEHICLES_KEY="rm_admin_vehicles";
const ADMIN_SERVICES_KEY="rm_admin_services";
const ADMIN_ANNOUNCEMENTS_KEY="rm_announcements";

function aLoad(key,fb=[]){
 try{const raw=localStorage.getItem(key);return raw?JSON.parse(raw):fb;}
 catch{return fb;}
}
function aSave(key,val){localStorage.setItem(key,JSON.stringify(val));}

(function(){
 const root=document.getElementById("adminDashboardRoot");
 if(!root)return;

 const statusEl=document.getElementById("adminStatusText");
 const logoutBtn=document.getElementById("adminLogoutBtn");
 const sessionEmail=getAdminSession();
 if(!sessionEmail){
  if(statusEl){statusEl.textContent="Not logged in. Please log in as an admin placeholder.";}
  setTimeout(()=>{window.location.href="admin-login.html";},1000);
  return;
 }
 if(statusEl){statusEl.textContent=`Logged in as ${sessionEmail} (placeholder admin).`;}
 if(logoutBtn){logoutBtn.addEventListener("click",()=>{setAdminSession(null);window.location.href="admin-login.html";});}

 // community queue
 const qList=document.getElementById("adminQueueList");
 const aList=document.getElementById("adminAnsweredList");
 function loadMsgs(){return aLoad(ADMIN_COMMUNITY_KEY,[]);}
 function saveMsgs(list){aSave(ADMIN_COMMUNITY_KEY,list);}
 function renderMsgs(){
  const all=loadMsgs();
  const pending=all.filter(m=>!m.answer);
  const answered=all.filter(m=>!!m.answer);
  if(qList){
    qList.innerHTML="";
    if(pending.length===0){qList.innerHTML="<li class='text-muted'>No pending messages in the admin queue.</li>";}
    else{
      pending.forEach(m=>{
        const li=document.createElement("li");
        li.className="message-card";
        li.innerHTML=`
          <strong>${m.name}</strong>${m.email?` <span class="text-muted"> • ${m.email}</span>`:""}
          <p>${m.message}</p>
          <button class="btn btn-secondary" data-answer-id="${m.id}">Add Placeholder Answer</button>`;
        qList.appendChild(li);
      });
    }
  }
  if(aList){
    aList.innerHTML="";
    if(answered.length===0){aList.innerHTML="<li class='text-muted'>No answered messages yet.</li>";}
    else{
      answered.forEach(m=>{
        const li=document.createElement("li");
        li.className="message-card";
        li.innerHTML=`
          <strong>${m.name}</strong>${m.email?` <span class="text-muted"> • ${m.email}</span>`:""}
          <p><em>Q:</em> ${m.message}</p>
          <p><em>Answer (placeholder):</em> ${m.answer}</p>`;
        aList.appendChild(li);
      });
    }
  }
 }
 if(qList){
  qList.addEventListener("click",e=>{
    const btn=e.target.closest("[data-answer-id]");
    if(!btn)return;
    const id=btn.getAttribute("data-answer-id");
    const ans=prompt("Enter placeholder answer:");
    if(!ans)return;
    const all=loadMsgs();
    const msg=all.find(m=>m.id===id);
    if(msg){msg.answer=ans.trim();saveMsgs(all);renderMsgs();}
  });
 }
 renderMsgs();

 // admin vehicles
 const vBody=document.getElementById("adminVehiclesTableBody");
 const vForm=document.getElementById("adminVehicleForm");
 function renderAdminVehicles(){
  if(!vBody)return;
  const list=aLoad(ADMIN_VEHICLES_KEY,[]);
  vBody.innerHTML="";
  if(list.length===0){
    vBody.innerHTML="<tr><td colspan='4' class='text-muted'>No admin-added vehicle placeholders yet.</td></tr>";
    return;
  }
  list.forEach((v,idx)=>{
    const tr=document.createElement("tr");
    tr.innerHTML=`
      <td>${v.title}</td>
      <td>${v.price}</td>
      <td>${v.status}</td>
      <td><button class="btn btn-secondary" data-remove-vehicle="${idx}">Remove</button></td>`;
    vBody.appendChild(tr);
  });
 }
 if(vForm){
  vForm.addEventListener("submit",e=>{
    e.preventDefault();
    const title=document.getElementById("adminVehicleTitle").value.trim();
    const price=document.getElementById("adminVehiclePrice").value.trim();
    const status=document.getElementById("adminVehicleStatus").value.trim();
    if(!title||!price){alert("Please fill in vehicle title and price placeholders.");return;}
    const list=aLoad(ADMIN_VEHICLES_KEY,[]);
    list.push({title,price,status});
    aSave(ADMIN_VEHICLES_KEY,list);
    vForm.reset();
    renderAdminVehicles();
  });
 }
 if(vBody){
  vBody.addEventListener("click",e=>{
    const btn=e.target.closest("[data-remove-vehicle]");
    if(!btn)return;
    const idx=parseInt(btn.getAttribute("data-remove-vehicle"),10);
    const list=aLoad(ADMIN_VEHICLES_KEY,[]);
    list.splice(idx,1);
    aSave(ADMIN_VEHICLES_KEY,list);
    renderAdminVehicles();
  });
 }
 renderAdminVehicles();

 // admin services
 const sBody=document.getElementById("adminServicesTableBody");
 const sForm=document.getElementById("adminServiceForm");
 function renderAdminServices(){
  if(!sBody)return;
  const list=aLoad(ADMIN_SERVICES_KEY,[]);
  sBody.innerHTML="";
  if(list.length===0){
    sBody.innerHTML="<tr><td colspan='3' class='text-muted'>No admin-added service placeholders yet.</td></tr>";
    return;
  }
  list.forEach((s,idx)=>{
    const tr=document.createElement("tr");
    tr.innerHTML=`
      <td>${s.name}</td>
      <td>${s.description}</td>
      <td><button class="btn btn-secondary" data-remove-service="${idx}">Remove</button></td>`;
    sBody.appendChild(tr);
  });
 }
 if(sForm){
  sForm.addEventListener("submit",e=>{
    e.preventDefault();
    const name=document.getElementById("adminServiceName").value.trim();
    const description=document.getElementById("adminServiceDescription").value.trim();
    if(!name||!description){alert("Please fill in service name and description placeholders.");return;}
    const list=aLoad(ADMIN_SERVICES_KEY,[]);
    list.push({name,description});
    aSave(ADMIN_SERVICES_KEY,list);
    sForm.reset();
    renderAdminServices();
  });
 }
 if(sBody){
  sBody.addEventListener("click",e=>{
    const btn=e.target.closest("[data-remove-service]");
    if(!btn)return;
    const idx=parseInt(btn.getAttribute("data-remove-service"),10);
    const list=aLoad(ADMIN_SERVICES_KEY,[]);
    list.splice(idx,1);
    aSave(ADMIN_SERVICES_KEY,list);
    renderAdminServices();
  });
 }
 renderAdminServices();

 // announcements
 const aForm=document.getElementById("announcementForm");
 const aContainer=document.getElementById("announcementList");
 function renderAnnouncements(){
  if(!aContainer)return;
  const list=aLoad(ADMIN_ANNOUNCEMENTS_KEY,[]);
  aContainer.innerHTML="";
  if(list.length===0){
    aContainer.innerHTML="<p class='text-muted'>No site announcements yet.</p>";
    return;
  }
  list.forEach((a,idx)=>{
    const div=document.createElement("div");
    div.className="announcement-banner";
    div.innerHTML=`
      ${a.text}
      <button class="btn btn-secondary" data-remove-announcement="${idx}" style="float:right;">Remove</button>`;
    aContainer.appendChild(div);
  });
 }
 if(aForm){
  aForm.addEventListener("submit",e=>{
    e.preventDefault();
    const text=document.getElementById("announcementText").value.trim();
    if(!text){alert("Please enter announcement placeholder text.");return;}
    const list=aLoad(ADMIN_ANNOUNCEMENTS_KEY,[]);
    list.unshift({text});
    aSave(ADMIN_ANNOUNCEMENTS_KEY,list);
    aForm.reset();
    renderAnnouncements();
  });
 }
 if(aContainer){
  aContainer.addEventListener("click",e=>{
    const btn=e.target.closest("[data-remove-announcement]");
    if(!btn)return;
    const idx=parseInt(btn.getAttribute("data-remove-announcement"),10);
    const list=aLoad(ADMIN_ANNOUNCEMENTS_KEY,[]);
    list.splice(idx,1);
    aSave(ADMIN_ANNOUNCEMENTS_KEY,list);
    renderAnnouncements();
  });
 }
 renderAnnouncements();
})();
