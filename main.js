const markers=document.querySelectorAll(".marker");
markers.forEach(function(e){
    e.onclick=function(){
        markers[0].classList.remove("select","dark");
        markers[1].classList.remove("select","dark");
        e.classList.add("select","dark");
    }

});
