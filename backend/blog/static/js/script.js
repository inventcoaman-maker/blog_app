function openReply(id) {
  var input = document.getElementById("reply-" + id);
  var button = document.getElementById("send-" + id);

  if (input.style.display === "none") {
    input.style.display = "inline";
    button.style.display = "inline";
    input.focus();
  } else {
    input.style.display = "none";
    button.style.display = "none";
  }
}

// function myFunction() {
//   console.log("CLICKED");
// }


const result = async ()=>{
  
}