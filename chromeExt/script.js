let inpArr;
let inpFrom;
let inpTo;
let btnTab;
let lastRange;

function openTabs() {
  //['raz','dwa','trzy','cztery','piec','szec']

  const arr = inpArr.value.split(`','`);

  const from = Number(inpFrom.value);
  const to = Number(inpTo.value);

  let i = from;
  for (i = from; i <= to; i++) {
    chrome.tabs.create({
      url: "https://www.google.com/search?q=" + String(arr[i]) + "&start=",
    });
  }
}

document.addEventListener("DOMContentLoaded", function () {
  inpArr = document.getElementById("arrayInput");
  inpFrom = document.getElementById("rangeFrom");
  inpTo = document.getElementById("rangeTo");
  btnTab = document.getElementById("btnTab");
  btnDelete = document.getElementById("btnDelete");
  btnRefresh = document.getElementById("getData");
  btnCopy = document.getElementById("btnCopy");
  btnRefresh.addEventListener("click", get);
  btnCopy.addEventListener("click", copy);
  btnTab.addEventListener("click", openTabs);
  btnDelete.addEventListener("click", clear);
  //lastRange = document.getElementById('lastRange')
});

let org = { email: "", name: "", address: "", phone: "", link: "" };
let key = "";
async function copy() {
  const x = document.getElementById("orgList");
  //navigator.clipboard.write(x);
  x.select();
  document.execCommand("copy");
  //   chrome.storage.local.get(["organisations"], (items) => {
  //     navigator.clipboard.write(items.organisations);
  //     console.log("its", items);
  //   });
  //navigator.clipboard.write(window.getElementById());
}
async function getTab() {
  console.log("gettingtab");
  const response = await chrome.runtime.sendMessage({ cmd: "getUrl" });
  // do something with response here, not outside the function
  console.log(response);
  return response.link;
}
async function save() {
  console.log("saving");
  org.link = await getTab();

  chrome.storage.local.get(
    /* String or Array */ ["organisations"],
    function (items) {
      console.log("got items1:");
      let saved = items.organisations ? items.organisations : [];
      console.log(saved);
      updated = saved;
      updated.push(org);
      console.log("got items2 parsed:");
      //console.log(saved.length>0?JSON.parse(saved):'no data')
      chrome.storage.local.set({ organisations: updated }, function () {
        console.log("saved", org);
        org = { email: "", name: "", address: "", phone: "", link: "" };
      });
    }
  );
}
function clear() {
  chrome.storage.local.set({ organisations: [] }, function () {
    console.log("cleared", org);
  });
}

function get() {
  chrome.storage.local.get(
    /* String or Array */ ["organisations"],
    function (items) {
      console.log("got items3:");
      orgs = items.organisations;
      list = document.getElementById("orgList");
      console.log("organisatoins on get():", orgs);
      return orgs !== undefined
        ? (list.innerHTML = orgs.map(
            (org) =>
              `<tr><th>${org.name}</th><th>${org.email}</th><th>${org.address}</th><th>${org.phone}</th><th><a href="${org.link}">LINK</a></th></tr>`
          ))
        : null;
    }
  );
}

function search() {
  console.log("searching");
  const reEmail = new RegExp(/[a-zA-Z,_]*[@][a-zA-Z,._]*/);
  const reStreet = new RegExp(/ul[.]?[\s]?[A-Za-z]*[\s]?\d*[/]?[\d]*/);
  const rePostalCode = new RegExp(/\d{2}[\s]?[-][\s]?\d{3}[\s][A-Za-z]*/);
  const rePhoneNum = new RegExp(
    /[+]?[\s]?[4]?[8]?[\s]?\d{3}[\s]?\d{3}[\s]?\d{3}/
  );
  let x = document.getElementsByTagName("p");

  for (let i = 0; i < x.length; i++) {
    const regex = new RegExp(
      reEmail.source +
        "|" +
        rePostalCode.source +
        "|" +
        reStreet.source +
        "|" +
        rePhoneNum.source,
      "gi"
    );

    let text = x[i].innerHTML;
    text = text.replace(/(<mark class="highlight">|<\/mark>)/gim, "");

    const newText = text.replace(
      regex,
      '<mark class="highlight" style=" color: red;">$&</mark>'
    );
    x[i].innerHTML = newText;
  }
}
document.addEventListener("keypress", (e) => {
  console.log("keyDown");
  if (e.key === "s") {
    console.log("save");

    save();
    console.log(org);
    key = "";
  } else if (e.key === "z") {
    console.log("here");
    console.log(window.getSelection().toString());
    org.name = window.getSelection().toString();
  } else if (e.key === "x") {
    org.email = window.getSelection().toString();
  } else if (e.key === "c") {
    org.address = window.getSelection().toString();
  } else if (e.key === "v") {
    org.phone = window.getSelection().toString();
  } else if (e.key === "b") {
    phrase = window.getSelection().toString();
    window.open(
      "https://www.google.com/search?q=" + phrase + "&start=",
      "_blank"
    );
  } else if (e.key === "f") {
    search();
  } else {
    key = e.key;
  }

  key = "";
  //chrome.runtime.sendMessage(null,key,(response)=>{
  //console.log("Sent key value"+response)
  //})
});

get();

//fetchData();
