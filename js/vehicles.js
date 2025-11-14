// vehicles.js - placeholder vehicle data + list + details
const VEHICLES_DATA=[
 {id:"1",title:"[Generic Car Model 1]",manufacturer:"[Manufacturer Placeholder]",price:"[Price Placeholder]",mileage:"[Mileage Placeholder]",fuel:"[Fuel Type Placeholder]",transmission:"[Transmission Placeholder]",year:"[Year Placeholder]",images:Array.from({length:6},()=> "sampleimg.jpeg"),videoUrl:"",description:"[Vehicle Description Placeholder – include detailed specifications, features, and history for this vehicle listing.]",specs:{"Body Style":"[Body Style Placeholder]","Engine Size":"[Engine Size Placeholder]","Colour":"[Colour Placeholder]","Owners":"[Number of Owners Placeholder]","MOT Status":"[MOT Status Placeholder]","Service History":"[Service History Placeholder]"}},
 {id:"2",title:"[Generic Car Model 2]",manufacturer:"[Manufacturer Placeholder]",price:"[Price Placeholder]",mileage:"[Mileage Placeholder]",fuel:"[Fuel Type Placeholder]",transmission:"[Transmission Placeholder]",year:"[Year Placeholder]",images:Array.from({length:6},()=> "sampleimg.jpeg"),videoUrl:"",description:"[Vehicle Description Placeholder – long description for vehicle 2.]",specs:{"Body Style":"[Body Style Placeholder]","Engine Size":"[Engine Size Placeholder]","Colour":"[Colour Placeholder]","Owners":"[Number of Owners Placeholder]","MOT Status":"[MOT Status Placeholder]","Service History":"[Service History Placeholder]"}},
 {id:"3",title:"[Generic Car Model 3]",manufacturer:"[Manufacturer Placeholder]",price:"[Price Placeholder]",mileage:"[Mileage Placeholder]",fuel:"[Fuel Type Placeholder]",transmission:"[Transmission Placeholder]",year:"[Year Placeholder]",images:Array.from({length:6},()=> "sampleimg.jpeg"),videoUrl:"",description:"[Vehicle Description Placeholder – long description for vehicle 3.]",specs:{"Body Style":"[Body Style Placeholder]","Engine Size":"[Engine Size Placeholder]","Colour":"[Colour Placeholder]","Owners":"[Number of Owners Placeholder]","MOT Status":"[MOT Status Placeholder]","Service History":"[Service History Placeholder]"}}
];
function getAllVehicles(){return VEHICLES_DATA.slice();}

// list page
(function(){
 const listContainer=document.getElementById("vehicleList");
 if(!listContainer)return;
 const vehicles=getAllVehicles();
 listContainer.innerHTML="";
 vehicles.forEach(v=>{
  const card=document.createElement("article");
  card.className="vehicle-card";
  card.innerHTML=`
   <div class="vehicle-card-img">
     <img src="sampleimg.jpeg" alt="${v.title} placeholder image"/>
   </div>
   <div class="vehicle-card-main">
     <div>
       <div class="vehicle-title">${v.title}</div>
       <div class="vehicle-meta">${v.manufacturer} • ${v.year} • ${v.mileage}</div>
       <div class="vehicle-price">${v.price}</div>
     </div>
     <div class="vehicle-actions">
       <button class="btn btn-primary" data-view-id="${v.id}">View Details</button>
     </div>
   </div>`;
  listContainer.appendChild(card);
 });
 listContainer.addEventListener("click",e=>{
  const btn=e.target.closest("[data-view-id]");
  if(!btn)return;
  const vid=btn.getAttribute("data-view-id");
  window.location.href=`vehicle-details.html?id=${encodeURIComponent(vid)}`;
 });
})();

// details page
(function(){
 const root=document.getElementById("vehicleDetailsRoot");
 if(!root)return;
 const params=new URLSearchParams(window.location.search);
 const id=params.get("id");
 const v=getAllVehicles().find(x=>x.id===id)||getAllVehicles()[0];
 if(!v){root.innerHTML="<p>Vehicle placeholder not found.</p>";return;}
 const imagesHtml=v.images.slice(0,10).map((src,i)=>`<img src="${src}" alt="${v.title} image placeholder ${i+1}"/>`).join("");
 const specsRows=Object.entries(v.specs).map(([label,val])=>`<tr><th>${label}</th><td>${val}</td></tr>`).join("");
 const videoSection=`
  <div class="video-placeholder">
    <div style="padding:1rem;">
      <p class="text-muted">[Embedded Vehicle Video Placeholder – e.g. YouTube or HTML5 video]</p>
    </div>
  </div>`;
 root.innerHTML=`
  <div class="vehicle-details-layout">
    <section>
      <div class="announcement-banner">
        <strong>${v.title}</strong> – [Vehicle Details Placeholder View]
      </div>
      <div class="card">
        <h2>${v.title}</h2>
        <p class="text-muted">${v.manufacturer}</p>
        <div class="vehicle-price" style="margin-top:0.6rem;">${v.price}</div>
        <p class="text-muted" style="margin-top:0.2rem;">
          ${v.year} • ${v.mileage} • ${v.fuel} • ${v.transmission}
        </p>
      </div>
      <div class="card" style="margin-top:1.5rem;">
        <h3>Media (Placeholders)</h3>
        <div class="media-grid">${imagesHtml}</div>
        ${videoSection}
      </div>
      <div class="card" style="margin-top:1.5rem;">
        <h3>Vehicle Description (Placeholder)</h3>
        <p>${v.description}</p>
        <h3 style="margin-top:1.5rem;">Specifications (Placeholder)</h3>
        <table class="specs-table"><tbody>${specsRows}</tbody></table>
      </div>
    </section>
    <aside>
      <div class="card">
        <h3>Contact About this Vehicle</h3>
        <p class="text-muted">[Contact Means Placeholder – phone, email, and/or contact form link for this vehicle listing.]</p>
        <ul class="text-muted" style="padding-left:1rem;">
          <li>[Phone Placeholder]</li>
          <li>[Email Placeholder]</li>
          <li>[Online Form Placeholder]</li>
        </ul>
        <form class="form" style="margin-top:1rem;">
          <div class="form-group">
            <label for="enquiryName">Your Name</label>
            <input id="enquiryName" type="text" placeholder="[Name Placeholder]"/>
          </div>
          <div class="form-group">
            <label for="enquiryEmail">Email</label>
            <input id="enquiryEmail" type="email" placeholder="[Email Placeholder]"/>
          </div>
          <div class="form-group">
            <label for="enquiryMessage">Message</label>
            <textarea id="enquiryMessage" rows="4" placeholder="[Message Placeholder]"></textarea>
          </div>
          <button type="button" class="btn btn-primary">Submit Enquiry Placeholder</button>
          <p class="text-muted">
            This is a frontend-only placeholder. In a real system, this would go to the admin queue.
          </p>
        </form>
      </div>
    </aside>
  </div>`;
})();
