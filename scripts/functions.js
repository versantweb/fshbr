// définition des urls pour la récupération des informations
var urls = {
  classement: {
    d1: "http://www.fshbr.ch/competitions/index/1",
    d2: "http://www.fshbr.ch/competitions/index/2",
    d3a: "http://www.fshbr.ch/competitions/index/3",
    d3b: "http://www.fshbr.ch/competitions/index/4",
    juniors: "http://www.fshbr.ch/competitions/index/5",
    novices: "http://www.fshbr.ch/competitions/index/6",
    minis: "http://www.fshbr.ch/competitions/index/7"
  }
}

// met la page en 100% de haut
function setRealContentHeight() {
  var header = $.mobile.activePage.find("div[data-role='header']:visible");
  var footer = $.mobile.activePage.find("div[data-role='footer']:visible");
  var content = $.mobile.activePage.find("div.ui-content:visible:visible");
  var viewport_height = $(window).height();

  // var content_height = viewport_height - header.outerHeight() - footer.outerHeight();
  var content_height = viewport_height - (header.outerHeight() - 1) - (footer.outerHeight() - 1);
  if((content.outerHeight() - header.outerHeight() - footer.outerHeight()) <= viewport_height) {
    content_height -= (content.outerHeight() - content.height());
  }
  $(".ui-content").height(content_height);
}



// récupert le programme tv d'après un flux RSS donné
function classement(division, success){
  // récupert l'url du classement de la division demandée
  var url = urls.classement[division];
alert(url);
  // pour stocker les chaînes et leurs programmes
  var equipes = [];
  var equipe = '';

  $.get(url, function(data){
    var x = 0;
    // parcourt les équipes
    $(data).find(".classement tbody tr").each(function(){
      alert(x++);
      var el = $(this);
      log(el.text());
      equipe = {};
      // récupert les informations de l'équipe en cours
      $scores = $el.find("td");
      equipe.nom        = $scores[0];
      equipe.joue       = $scores[1];
      equipe.gagne      = $scores[2];
      equipe.egalite    = $scores[3];
      equipe.perdu      = $scores[4];
      equipe.marques    = $scores[5];
      equipe.encaisses  = $scores[6];
      equipe.difference = $scores[7];
      equipe.points     = $scores[8];
      log(JSON.stringify(equipe));
    });

    // appelle la fonction de callback avec en paramètre les chaînes trouvées    
    success(equipes);
  });
}



function init(){
  // met la page en 100% de haut
  $(document).on("pageshow", setRealContentHeight);

  // $(document).on("deviceready", function(){
  //   console.log('ready');
  // });

  // charge le menu
  $(document).on("pageshow", function(){
    $(".nav-menu").load("menu.html", function(){
      $(".nav-menu").panel();
      $(".nav-menu").trigger("updatelayout");
    });
  });
}



function log(text){
  $('.console').append("<div>" + text + "</div>");
}